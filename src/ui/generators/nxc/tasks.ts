import { Block, CodeGenerator } from "blockly"

export function main_task(block: Block, generator: CodeGenerator): string {
    const stack = generator.statementToCode(block, "STACK")
    return "task main()\n{\n" + stack + "}"
}
