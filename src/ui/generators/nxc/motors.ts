import { Block, CodeGenerator } from 'blockly'
import { FieldMotor } from '../../nxt/blocks/motors'
import { NXCGenerator, Order } from './nxc_generator'

export function nxt_motor_speed(block: Block, generator: NXCGenerator): string {
    const motor = (block.getField("MOTOR") as FieldMotor).getSelectedMotor()
    const speed = generator.valueToCode(block, 'SPEED', Order.ASSIGNMENT) || '0'
    const code = "OnFwdRegEx(" + motor?.output + ", " + speed + ", OUT_REGMODE_SPEED, RESET_NONE);\n"
    return motor ? code : "// " + code
}

export function nxt_motor_rotate(block: Block, generator: NXCGenerator): string {
    const motor = (block.getField("MOTOR") as FieldMotor).getSelectedMotor()
    const power = generator.valueToCode(block, 'POWER', Order.ASSIGNMENT) || '0'
    let amount = generator.valueToCode(block, 'AMOUNT', Order.ASSIGNMENT) || '0'
    if (block.getFieldValue("UNIT") === "REV")
        amount = "360 * " + amount
    const code = "RotateMotor(" + motor?.output + ", " + power + ", " + amount + ");\n"
    return motor ? code : "// " + code
}
