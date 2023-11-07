import { Block, CodeGenerator } from "blockly"
import { Order } from './nxc_generator'

export function math_number(block: Block, generator: CodeGenerator): [string, number] {
    let num = block.getFieldValue('NUM')
    return [num, Order.ATOMIC]
}
