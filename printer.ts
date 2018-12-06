import { Mal, Vector, List } from "./types"

export function pr_str(ast: Mal, print_readably: boolean): string {
    return ast.toString(print_readably)
}