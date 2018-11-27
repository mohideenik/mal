import { Mal } from "./types"

export function read_str(str: string): Mal {
    let tokens = tokenizer(str)
    let rdr = reader(tokens)
    return read_form(rdr)
}

function tokenizer(str: string): string[] {
    const regx = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g
    let result = str.match(regx)

    if (result == null)
        return []
    else
        return result.filter(x => x != "")
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
    return {items: []}
}

interface Reader {
    next: () => string
    peek: () => string
    hasNext: () => boolean
}