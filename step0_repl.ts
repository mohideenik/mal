const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function read(str: String): String {
  return str
}

function evaluate(str: String): String {
    return str
}

function prnt(str: String): String {
    return str
}

function rep(str: String): String {
    return str
}

// Main loop
process.stdout.write("user> ")
rl.on('line', (input: String) => {
    console.log(rep(input))
    process.stdout.write("user> ")
});
