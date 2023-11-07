import { Block, CodeGenerator, Workspace } from "blockly"

export const Order = {
    ATOMIC: 0,         // 0 "" ...
    UNARY_POSTFIX: 1,  // expr++ expr-- () [] . ?.
    UNARY_PREFIX: 2,   // -expr !expr ~expr ++expr --expr
    MULTIPLICATIVE: 3, // * / % ~/
    ADDITIVE: 4,       // + -
    SHIFT: 5,          // << >>
    BITWISE_AND: 6,    // &
    BITWISE_XOR: 7,    // ^
    BITWISE_OR: 8,     // |
    RELATIONAL: 9,     // >= > <= < as is is!
    EQUALITY: 10,      // == !=
    LOGICAL_AND: 11,   // &&
    LOGICAL_OR: 12,    // ||
    IF_NULL: 13,       // ??
    CONDITIONAL: 14,   // expr ? expr : expr
    CASCADE: 15,       // ..
    ASSIGNMENT: 16,    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
    NONE: 99,          // (...)
}

export class NXCGenerator extends CodeGenerator {
    constructor(name?: string) {
        super(name ?? "NXC")
    }

    override init(workspace: Workspace): void {
        super.init(workspace)
    }

    override finish(code: string): string {
        return super.finish(code)
    }
    override scrubNakedValue(line: string): string {
        console.log("scrubNakedValue", line)
        return super.scrubNakedValue(line)
    }
    protected override scrub_(block: Block, code: string, opt_thisOnly?: boolean): string {
        console.log("scrub_", block.type, opt_thisOnly, code)
        const nextBlock =
            block.nextConnection && block.nextConnection.targetBlock()
        const nextCode = opt_thisOnly ? '' : this.blockToCode(nextBlock)
        return code + nextCode
    }
}
