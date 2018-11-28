import { Mal, Atom, List } from "./types"

export function read_str(str: string): Mal {
    let tokens = tokenizer(str)
    // console.log("Obtained these tokens: ", tokens)
    let rdr = reader(tokens)
    return read_form(rdr)
}

function tokenizer(str: string): string[] {
    const regx = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g
    
    let result: string[] = []
    while (true) {
        let match = regx.exec(str)
        if (!match || match[1] == "") 
            break;
        if (match[0] != ";") 
            result.push(match[1])
    }

    if (result == null)
        return []
    else
        return result.filter(x => x != "").map(x => x.trim())
}

function reader(tokens: string[]): Reader {
    var i = 0
    return {
        next: (): string => {
            if (i >= tokens.length)
                throw new Error("Calling reader when it is empty")
            else
                return tokens[i++]
        },
        peek: (): string => {
            return tokens[i]
        },
        hasNext: (): boolean => {
            return i < tokens.length - 1
        }
    }
}

function read_form(rdr: Reader): Mal {
    let token = rdr.peek()

    if (token[0] == '(')
        return read_list(rdr)
    else
        return read_atom(rdr)
}

function read_list(rdr: Reader): Mal {
    rdr.next()
    var contents : Mal[] = []
    while (rdr.peek()[0] != ')') {
        contents.push(read_form(rdr))
    }
    // console.log("Obtained list " + contents)
    rdr.next()
    return new List(contents)
}

function read_atom(rdr: Reader): Atom {
    let contents = rdr.next()
    return new Atom(contents)
}

interface Reader {
    next: () => string
    peek: () => string
    hasNext: () => boolean
}