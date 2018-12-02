import { read_str } from "./reader"
import { pr_str } from "./printer"
import { Mal, List, Symbol, Function, Number, Vector } from "./types"

const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function read(str: string): Mal {
    return read_str(str)
}

function eval_ast(ast: Mal, repl_env: any): Mal {
    if (ast instanceof Symbol) {
        if (repl_env[ast.contents])
            return new Function(repl_env[ast.contents])
        else
            throw "'" + ast.contents + "' not found"
    } else if (ast instanceof List) {
        return new List(ast.contents.map(x => evaluate(x, repl_env)))
    } else if (ast instanceof Vector) {
        return new Vector(ast.contents.map(x => evaluate(x, repl_env)))
    } else {
        return ast
    }
}

function evaluate(ast: Mal, repl_env: any): Mal {
    if (ast instanceof List) {
        if (ast.contents.length == 0) {
            return ast
        } else {
            let evaluated = eval_ast(ast, repl_env)
            let fn = evaluated.contents.shift().contents
            let args = evaluated.contents
            let result = fn.apply(null, args.map(x => x.contents))
            return read_str(result)
        }
    } else {
        return eval_ast(ast, repl_env)
    }
}

function prnt(ast: Mal): string {
    return pr_str(ast)
}

function rep(str: string): void {
    let repl_env = {
        "+": (x: number, y: number) => x + y,
        "-": (x: number, y: number) => x - y,
        "*": (x: number, y: number) => x * y,
        "/": (x: number, y: number) => x / y
    }

    try {
        let ast: Mal = read(str)
        let processed: Mal = evaluate(ast, repl_env)

        let x: string = prnt(processed)
        if (x != "")
            console.log(x)
    } catch (error) {
        console.log(error)
    }
}

// Main loop
process.stdout.write("user> ")
rl.on('line', (input: string) => {
    if (input.trim() != "")
        rep(input)
    process.stdout.write("user> ")
});
