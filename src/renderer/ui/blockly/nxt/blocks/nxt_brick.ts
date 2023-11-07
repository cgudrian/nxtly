import * as Blockly from 'blockly'
import { FieldMotor } from './motors'

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        "type": "nxt_motor",
        "message0": "Motor %1 %2",
        "implicitAlign0": "RIGHT",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "name"
            },
            {
                "type": "input_dummy"
            }
        ],
        "output": "MOTOR",
        "colour": 280,
    },
    {
        "type": "nxt_touch_sensor",
        "message0": "Touch %1",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "name"
            }
        ],
        "implicitAlign0": "RIGHT",
        "output": "SENSOR",
        "colour": 180,
    },
    {
        "type": "nxt_ultrasonic_sensor",
        "message0": "Distance %1",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "name"
            }
        ],
        "implicitAlign0": "RIGHT",
        "output": "SENSOR",
        "colour": 180,
    },
    {
        "type": "nxt_color_sensor",
        "message0": "Color %1",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "name"
            }
        ],
        "implicitAlign0": "RIGHT",
        "output": "SENSOR",
        "colour": 180,
    },
])

export type NXTBrickBlock = Blockly.Block & NXTBrickBlockMixin
interface NXTBrickBlockMixin extends NXTBrickBlockMixinType {
    motors_: Motors,
    sensors_: Inputs,
}
type NXTBrickBlockMixinType = typeof NXT_BRICK

interface State {
    motors: Motors,
    sensors: Inputs,
}

const NXT_BRICK = {
    init: function (this: NXTBrickBlock) {
        this.jsonInit({
            "message0": "NXT Brick %1 %2",
            "args0": [
                {
                    "type": "input_dummy"
                },
                {
                    "type": "input_statement",
                    "name": "STACK"
                }
            ],
            "colour": 230,
        })
        this.setMutator(
            new Blockly.icons.MutatorIcon([
                'nxt_motor',
                'nxt_touch_sensor',
                'nxt_color_sensor',
                'nxt_ultrasonic_sensor',
            ], this as unknown as Blockly.BlockSvg)
        )
        this.setDeletable(false)
        this.setMovable(false)
        this.motors_ = {}
        this.sensors_ = {}
    },

    saveExtraState: function (this: NXTBrickBlock): { motors: Motors, sensors: Inputs } {
        return {
            'motors': this.motors_,
            'sensors': this.sensors_,
        }
    },

    loadExtraState: function (this: NXTBrickBlock, state: State) {
        this.motors_ = state.motors || {}
        this.sensors_ = state.sensors || {}
    },

    decompose: function (this: NXTBrickBlock, workspace: Blockly.Workspace): ConfigurationBlock {
        const configurationBlock = workspace.newBlock('nxt_brick_container') as ConfigurationBlock
        (configurationBlock as Blockly.BlockSvg).initSvg()

        for (const id in this.motors_) {
            const motor = this.motors_[id]
            const block = workspace.newBlock('nxt_motor', id) as Blockly.BlockSvg
            block.setFieldValue(motor.name, 'NAME')
            block.initSvg()
            block.moveTo(new Blockly.utils.Coordinate(100, 100))
            configurationBlock.getInput(motor.output)?.connection?.connect(block.outputConnection)
        }

        const attachInput = (id: string) => {
            const input = this.sensors_[id]
            if (input) {
                const block = workspace.newBlock(input.type) as Blockly.BlockSvg
                block.initSvg()
                block.setFieldValue(input.name, 'NAME')
                configurationBlock.getInput(id)?.connection?.connect(block.outputConnection)
            }
        }
        attachInput('IN_1')
        attachInput('IN_2')
        attachInput('IN_3')
        attachInput('IN_4')

        return configurationBlock
    },

    compose: function (this: NXTBrickBlock, containerBlock: Blockly.Block) {
        this.motors_ = {}
        for (const output of ["OUT_A", "OUT_B", "OUT_C"]) {
            const motorBlock = containerBlock.getInputTargetBlock(output)
            if (motorBlock) {
                const id = motorBlock.id
                const name = motorBlock.getFieldValue('NAME') as string
                this.motors_[id] = { id, output, name }
            }
        }
        // TODO: iterate over all fields of type "field_motor"
        for (const block of this.workspace.getAllBlocks())
            (block.getField("MOTOR") as FieldMotor)?.refresh()

        this.sensors_ = {}

        const storeInput = (input: string) => {
            const itemBlock = containerBlock.getInputTargetBlock(input)
            if (itemBlock) {
                const name = itemBlock.getFieldValue('NAME') as string
                const type = itemBlock.type
                this.sensors_[input] = { name, type }
            }
        }
        storeInput('IN_1')
        storeInput('IN_2')
        storeInput('IN_3')
        storeInput('IN_4')
    },
}
blocks['nxt_brick'] = NXT_BRICK

type ConfigurationBlock = Blockly.Block & NXTBrickMutator
interface NXTBrickMutator extends NXTBrickMutatorType { }
type NXTBrickMutatorType = typeof NXT_BRICK_CONTAINER

const NXT_BRICK_CONTAINER = {
    init: function (this: ConfigurationBlock) {
        this.jsonInit({
            "message0": "Motors %1 A %2 B %3 C %4 Inputs %5 1 %6 2 %7 3 %8 4 %9",
            "args0": [
                { "type": "input_dummy" },
                { "type": "input_value", "name": "OUT_A", "check": "MOTOR", "align": "RIGHT" },
                { "type": "input_value", "name": "OUT_B", "check": "MOTOR", "align": "RIGHT" },
                { "type": "input_value", "name": "OUT_C", "check": "MOTOR", "align": "RIGHT" },

                { "type": "input_dummy" },
                { "type": "input_value", "name": "IN_1", "check": "SENSOR", "align": "RIGHT" },
                { "type": "input_value", "name": "IN_2", "check": "SENSOR", "align": "RIGHT" },
                { "type": "input_value", "name": "IN_3", "check": "SENSOR", "align": "RIGHT" },
                { "type": "input_value", "name": "IN_4", "check": "SENSOR", "align": "RIGHT" },
            ],
            "colour": 230,
            "inputsInline": false
        })
    }
}
blocks['nxt_brick_container'] = NXT_BRICK_CONTAINER

export interface Motor {
    id: string,
    output: string,
    name: string
}
interface Input {
    name: string,
    type: string,
}

export type Motors = { [id: string]: Motor }
type Inputs = { [output: string]: Input }

export function getMotors(workspace: Blockly.Workspace): Motors | undefined {
    const ws = workspace.isFlyout ? (workspace as Blockly.WorkspaceSvg).targetWorkspace : workspace
    const nxtBrick = ws?.getBlocksByType('nxt_brick')[0] as (NXTBrickBlock | undefined)
    return nxtBrick?.motors_
}

export function getMotor(workspace: Blockly.Workspace, id: string): Motor | null {
    return getMotors(workspace)?.[id] || null
}
