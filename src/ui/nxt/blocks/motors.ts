import { BlockSvg, MenuGenerator, UnattachedFieldError, Workspace, WorkspaceSvg } from "blockly"
import * as Blockly from 'blockly'
import * as NXTBrick from './nxt_brick'

const EMPTY_ID: string = 'NONE'
const PLACEHOLDER: [string, string] = ['–', EMPTY_ID]
const OUTPUT_NAME: { [key: string]: string } = {
    OUT_A: 'A',
    OUT_B: 'B',
    OUT_C: 'C',
}

interface FieldMotorConfig extends Blockly.FieldConfig { }
interface FieldMotorJfromJsonConfig extends FieldMotorConfig { }
export class FieldMotor extends Blockly.FieldDropdown {
    private motor: NXTBrick.Motor | null = null

    private checkSourceBlock(): Blockly.Block {
        const block = this.getSourceBlock()
        if (!block)
            throw new UnattachedFieldError()
        return block
    }

    private getMotor(id: string): NXTBrick.Motor | null {
        const block = this.checkSourceBlock()
        return NXTBrick.getMotor(block.workspace, id)
    }

    constructor(
        config?: FieldMotorConfig
    ) {
        //super(FieldMotor.dropdownCreate as MenuGenerator, undefined, config)
        super(FieldMotor.SKIP_SETUP)
        this.menuGenerator_ = FieldMotor.dropdownCreate as MenuGenerator
        if (config)
            this.configure_(config)
    }

    getSelectedMotor(): NXTBrick.Motor | null {
        const id = this.getValue()
        if (!id)
            return null
        return this.getMotor(id)
    }

    protected override doValueUpdate_(newId: string): void {
        const block = this.getSourceBlock()
        if (!block)
            throw new UnattachedFieldError()
        const newMotor = NXTBrick.getMotor(block.workspace, newId)
        if (newMotor) {
            this.motor = newMotor
            super.doValueUpdate_(newId)
        } else {
            super.doValueUpdate_(EMPTY_ID)
        }
    }

    override initModel(): void {
        this.checkSourceBlock()
        if (this.motor)
            return
        this.doValueUpdate_(EMPTY_ID)
    }

    override loadState(id: any): void {
        this.motor = this.getMotor(id)
        this.setValue(this.motor ? id : EMPTY_ID)
    }

    protected override doClassValidation_(newValue?: string): string | null {
        if (!newValue)
            return EMPTY_ID

        const id = newValue!
        if (id === EMPTY_ID)
            return id

        if (!this.getMotor(id)) {
            console.warn("motor not found: " + id)
            return null
        }

        return id
    }

    refresh() {
        const id = this.motor?.id
        const options = this.getOptions(false)
        if (options.some((item) => item[1] === id)) {
            this.doValueUpdate_(id!)
        } else {
            this.doValueUpdate_(EMPTY_ID)
        }
        this.forceRerender()
    }

    static override fromJson(options: FieldMotorJfromJsonConfig): FieldMotor {
        return new this(options)
    }

    static dropdownCreate(this: FieldMotor): Blockly.MenuOption[] {
        const options: [string, string][] = []
        let found = false
        const selected = this.getValue()
        if (this.sourceBlock_ && !this.sourceBlock_.isDeadOrDying()) {
            const motors = NXTBrick.getMotors(this.sourceBlock_.workspace)
            if (motors) {
                for (const id in motors) {
                    const motor = motors[id]
                    options.push([motor.name, id])
                    if (id === selected)
                        found = true
                }
            }

            if (selected === EMPTY_ID || !found)
                options.push(PLACEHOLDER)
        }
        return options
    }
}
Blockly.fieldRegistry.register('field_motor', FieldMotor)

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        "type": "nxt_motor_speed",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "message0": "Run motor %1 with speed %2",
        "args0": [
            {
                "type": "field_motor",
                "name": "MOTOR"
            },
            {
                "type": "input_value",
                "name": "SPEED",
                "check": "Number"
            }
        ]
    },
    {
        "type": "nxt_motor_rotate",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "message0": "Run motor %1 for %2 %3 with power %4",
        "args0": [
            {
                "type": "field_motor",
                "name": "MOTOR"
            },
            {
                "type": "input_value",
                "name": "AMOUNT",
                "check": "Number"
            },
            {
                "type": "field_dropdown",
                "name": "UNIT",
                "options": [
                    ["degrees", "DEG"],
                    ["revolutions", "REV"]
                ]
            },
            {
                "type": "input_value",
                "name": "POWER",
                "check": "Number"
            }
        ],
        "inputsInline": true
    }
])

