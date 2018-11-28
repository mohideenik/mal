import { Mal, Atom, List, Null, Vector, Unquote, Map, Quasiquote, Quote } from "./types"

export function read_str(str: string): Mal {
    let tokens = tokenizer(str)
    let rdr = reader(tokens)

    if (tokens.length == 0) 
        return new Null()

    try {
        return read_form(rdr)
    } catch (err) {
        console.log("expected ')', got EOF\r\n")
        return new Null()
    }
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
                throw "expected ')', got EOF\r\n"
            else
                return tokens[i++]
        },
        peek: (): string => {
            if (i >= tokens.length)
                throw "expected ')', got EOF\r\n"
            else
                return tokens[i]
        },
        hasNext: (): boolean => {
            return i < tokens.length - 1
        }
    }
}

function read_form(rdr: Reader): Mal {
    let token = rdr.peek()

    switch(token[0]) {
        case '(':
            return read_list(rdr)
        case '[':
            return read_vector(rdr)
        case '~':
            return read_unquote(rdr)
        case '{':
            return read_map(rdr)
        case '`':
            return read_quasiquote(rdr)
        case '\'':
            return read_quote(rdr)
        default:
            return read_atom(rdr)
    }        
}

function read_map(rdr: Reader): Mal {
    rdr.next()
    let key = read_form(rdr)
    let value = read_form(rdr)
    rdr.next()
    return new Map(key, value)
}

function read_vector(rdr: Reader): Mal {
    rdr.next()
    var contents : Mal[] = []
    while (rdr.peek()[0] != ']') {
        contents.push(read_form(rdr))
    }
    rdr.next()
    return new Vector(contents)
}

function read_quote(rdr: Reader): Mal {
    rdr.next()
    var contents : Mal = read_form(rdr)
    return new Quote(contents)
}

function read_unquote(rdr: Reader): Mal {
    rdr.next()
    var contents : Mal = read_form(rdr)
    return new Unquote(contents)
}

function read_quasiquote(rdr: Reader): Mal {
    rdr.next()
    var contents : Mal = read_form(rdr)
    return new Quasiquote(contents)
}

function read_list(rdr: Reader): Mal {
    rdr.next()
    var contents : Mal[] = []
    while (rdr.peek()[0] != ')') {
        contents.push(read_form(rdr))
    }
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