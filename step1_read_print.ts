import { read_str } from "./reader"
import { pr_str } from "./printer"
import { Mal } from "./types"

const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function read(str: string): Mal {
  return read_str(str)
}

function evaluate(str: string): string {
    return str
}

function prnt(ast: Mal): string {
    return pr_str(ast)
}

function rep(str: string): void {
    let ast: Mal = read(str)
    let x: string = prnt(ast)
    if (x != "")
        console.log(x)
}

// Main loop
process.stdout.write("user> ")
rl.on('line', (input: string) => {
    rep(input)
    process.stdout.write("user> ")
});
