import * as usb from 'usb';

declare global {
    interface DataView {
        getString(offset: number, length?: number): string;
    }
}

// https://github.com/doomjs/dataview-getstring/blob/master/index.js
DataView.prototype.getString = function (offset: number, length?: number): string {
    const end = length ? offset + length : this.byteLength;
    let text = "";
    while (offset < this.byteLength && offset < end) {
        const val = this.getUint8(offset++);
        if (val === 0)
            break;
        text += String.fromCharCode(val);
    }
    return text;
};

class NXTBrick {
    private _dev: USBDevice;
    private _name?: string;

    constructor(dev: USBDevice) {
        this._dev = dev;
    }

    async initialize() {
        await this._dev.open();
        await this._dev.selectConfiguration(1);
        await this._dev.claimInterface(0);
        await this.getFirmwareVersion();
        this._name = await this.getDeviceName();
        console.log(this._name);
    }

    async getFirmwareVersion() {
        const data = await this.sendRequest([0x01, 0x88], 7);
        const protocolMinor = data?.getUint8(3);
        const protocolMajor = data?.getUint8(4);
        const firmwareMinor = data?.getUint8(5);
        const firmwareMajor = data?.getUint8(6);
        console.log(`Protocol: ${protocolMajor}.${protocolMinor}`);
        console.log(`FW: ${firmwareMajor}.${firmwareMinor}`);
    }

    async setDeviceName(name: string) {
        const request = [0x01, 0x98];
        for (let i = 0; i < 15; ++i)
            request.push(name.charCodeAt(i) || 0);
        request.push(0);
        const data = await this.sendRequest(request, 3)
        console.log(data)
    }

    async getDeviceName(): Promise<string | undefined> {
        const data = await this.sendRequest([0x01, 0x9b], 33);
        const bytesFree = data?.getUint32(29, true);
        console.log(`${bytesFree} bytes free`);
        return data?.getString(3, 15);
    }

    async sendRequest(elements: Iterable<number>, responseSize?: number): Promise<DataView | undefined> {
        const buffer = new Uint8Array(elements);
        await this._dev.transferOut(1, buffer);
        const response = await this._dev.transferIn(2, 64);
        if (responseSize && response.data?.byteLength !== responseSize) {
            console.warn(`Invalid response size. Expected: ${responseSize}, Actual: ${response.data?.byteLength}`);
            return;
        }
        return response.data;
    }
}


const webusb = new usb.WebUSB(
    { allowAllDevices: true },
);

const Bricks: { [key: string]: NXTBrick; } = {};

function isNXTBrick(device: USBDevice): boolean {
    return device.vendorId === 0x0694
        && device.productId === 0x0002;
}

async function nxtBrickAttached(device: USBDevice) {
    if (!device.serialNumber) {
        console.warn("NXT brick without serial number. Ignoring.");
        return;
    }

    const brick = new NXTBrick(device);
    await brick.initialize();
    Bricks[device.serialNumber] = brick;
}

async function nxtBrickDetached(device: USBDevice) {
    if (device.serialNumber)
        delete Bricks[device.serialNumber];
}

export async function initUsb() {
    webusb.addEventListener('connect', (event) => {
        if (isNXTBrick(event.device))
            nxtBrickAttached(event.device);
    });

    webusb.addEventListener('disconnect', (event) => {
        if (isNXTBrick(event.device))
            nxtBrickDetached(event.device);
    });

    const devices = await webusb.getDevices();
    for (const dev of devices) {
        if (isNXTBrick(dev))
            nxtBrickAttached(dev);
    }
}

