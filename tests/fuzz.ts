import { parser } from "../src/index";
import { exampleRules } from "../src/parsers";

export function fuzz(
    buf: Buffer
) {
    const test = parser(buf.toString(),exampleRules)
}
