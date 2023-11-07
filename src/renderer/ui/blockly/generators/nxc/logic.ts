import { Block, CodeGenerator } from "blockly"
import { Order } from "./nxc_generator"

export function controls_if(block: Block, generator: CodeGenerator): string {
    let n = 0
    let code = "",
        branchCode,
        conditionCode

    if (generator.STATEMENT_PREFIX) {
        code += generator.injectId(generator.STATEMENT_PREFIX, block)
    }

    do {
        conditionCode =
            generator.valueToCode(block, "IF" + n, Order.NONE) || "false"
        branchCode = generator.statementToCode(block, "DO" + n)
        if (generator.STATEMENT_SUFFIX) {
            branchCode =
                generator.prefixLines(
                    generator.injectId(generator.STATEMENT_SUFFIX, block),
                    generator.INDENT
                ) + branchCode
        }
        code +=
            (n > 0 ? "else " : "") +
            "if (" +
            conditionCode +
            ") {\n" +
            branchCode +
            "}"
        n++
    } while (block.getInput("IF" + n))

    if (block.getInput("ELSE") || generator.STATEMENT_SUFFIX) {
        branchCode = generator.statementToCode(block, "ELSE")
        if (generator.STATEMENT_SUFFIX) {
            branchCode =
                generator.prefixLines(
                    generator.injectId(generator.STATEMENT_SUFFIX, block),
                    generator.INDENT
                ) + branchCode
        }
        code += ' else {\n' + branchCode + '}'
    }

    return code + "\n"
}
