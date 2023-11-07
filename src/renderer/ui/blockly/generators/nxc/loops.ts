import { Block, CodeGenerator } from "blockly"

export function controls_repeat_ext(block: Block, generator: CodeGenerator): string {
    console.log(block.getParent()?.type)
    return "UPS"
}
