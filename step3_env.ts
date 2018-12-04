import { read_str } from "./reader"
import { pr_str } from "./printer"
import { Mal, List, Symbol, Function, Number, Vector, Map } from "./types"
import { Env } from "./env";

const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function read(str: string): Mal {
    return read_str(str)
}

function eval_ast(ast: Mal, repl_env: Env): Mal {
    if (ast instanceof Symbol) {
        let result = repl_env.get(ast.contents)
        if (result)
            return result
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

function evaluate(ast: Mal, repl_env: Env): Mal {
    if (ast instanceof List) {
        if (ast.contents.length == 0) {
            return ast
        } else if (ast.contents[0] instanceof Symbol && ast.contents[0].contents == "def!") {
            if (!(ast.contents[1] instanceof Symbol)) 
                throw "Second parameter of define needs to be a valid symbol"
            if (!(ast.contents[2])) 
                throw "Third parameter is needed for the value"

            let result = evaluate(ast.contents[2], repl_env)
            repl_env.set(ast.contents[1].contents, result)
            return result
        } else if (ast.contents[0] instanceof Symbol && ast.contents[0].contents == "let*") {
            if (ast.contents.length != 3)
                throw "Invalid number of arguments for let*"
            if (!(ast.contents[1] instanceof List || ast.contents[1] instanceof Vector))
                throw "Invalid first parameter to let*"
            else if (ast.contents[1].contents.length % 2 == 1)
                throw "Invalid number of args in first parameter"
            
            let new_env = new Env(repl_env)
            let dec_lst: Mal[] = ast.contents[1].contents
            for (var i = 0; i < ast.contents[1].contents.length; i += 2) {
                if (!(dec_lst[i] instanceof Symbol))
                    throw "Invalid symbol given in let* list"
                
                let result = evaluate(dec_lst[i+1], new_env)
                new_env.set(dec_lst[i].contents, result)
            }
            
            return evaluate(ast.contents[2], new_env)
        } else {
            let evaluated = eval_ast(ast, repl_env)
            let fn = evaluated.contents.shift().contents
            let args = evaluated.contents
            let result = fn.apply(null, args.map(x => x.contents))
            return read_str(result)
        }
    } else if (ast instanceof Map) {
        let result = evaluate(ast.contents, repl_env)
        return new Map(ast.key, result)
    } else {
        return eval_ast(ast, repl_env)
    }
}

function prnt(ast: Mal): string {
    return pr_str(ast)
}

function rep(str: string, repl_env: Env): void {
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

// Initialize environment
let repl_env = new Env(null)
repl_env.set("+", new Function((x: number, y: number) => x + y))
repl_env.set("-", new Function((x: number, y: number) => x - y))
repl_env.set("*", new Function((x: number, y: number) => x * y))
repl_env.set("/", new Function((x: number, y: number) => x / y))

// Main loop
process.stdout.write("user> ")
rl.on('line', (input: string) => {
    if (input.trim() != "")
        rep(input, repl_env)
    process.stdout.write("user> ")
});
