const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function read(str: string): string {
  return str
}

function evaluate(str: string): string {
    return str
}

function prnt(str: string): string {
    return str
}

function rep(str: string): string {
    return str
}

// Main loop
process.stdout.write("user> ")
rl.on('line', (input: string) => {
    console.log(rep(input))
    process.stdout.write("user> ")
});
