import { Block, CodeGenerator } from 'blockly'
import { NXTBrickBlock } from '../../nxt/blocks/nxt_brick'

export function nxt_brick(block: NXTBrickBlock, generator: CodeGenerator): string {
    const stack = generator.statementToCode(block, "STACK")
    return "task main() {\n" + stack + "}"
}
