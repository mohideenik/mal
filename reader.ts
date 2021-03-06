import { Mal, Colon, Null, List, Vector, Map, String, Number, Symbol, True, False, Nil } from "./types"

export function read_str(str: string): Mal {
    let tokens = tokenizer(str)
    if (tokens.length > 0) {
        let rdr = reader(tokens)
        return read_form(rdr)
    }
    return new Null()
}

function tokenizer(str: string): string[] {
    const regx = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g
    
    let result: string[] = []
    while (true) {
        let match = regx.exec(str)
        if (!match || match[1] == "") 
            break;
        if (match[0][0] != ';') 
            result.push(match[1])
    }

    if (result == null || result == [])
        return []
    else
        return result.filter(x => x != "").map(x => x.trim())
}

function reader(tokens: string[]): Reader {
    var i = 0
    return {
        next: (): string => {
            if (i >= tokens.length)
                throw "expected ')', got EOF"
            else
                return tokens[i++]
        },
        peek: (): string => {
            if (i >= tokens.length)
                throw "expected ')', got EOF"
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
        case ':':
            return read_colon(rdr)
        case '@':
            return read_atom(rdr)
        default:
            return read_token(rdr)
    }        
}

function read_atom(rdr: Reader): Mal {
    rdr.next()
    return new List([
        new Symbol("deref"),
        new Symbol(rdr.next())
    ])
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
    return new List([new Symbol("quote"), contents])
}

function read_unquote(rdr: Reader): Mal {
    let sym = 
        rdr.peek() == "~@" ? 
        new Symbol("splice-unquote") : new Symbol("unquote")
    rdr.next()
    var contents : Mal = read_form(rdr)
    return new List([sym, contents])
}

function read_quasiquote(rdr: Reader): Mal {
    rdr.next()
    var contents : Mal = read_form(rdr)
    return new List([new Symbol("quasiquote"), contents])
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

function read_colon(rdr: Reader): Mal {
    let contents = rdr.next()
    return new Colon(contents)
}

function read_token(rdr: Reader): Mal {
    let contents = rdr.next()
    if (contents[0] == "\"") {
        return new String(JSON.parse(contents))
    } else if (contents == "true") {
        return new True()
    } else if (contents == "false") {
        return new False()
    } else if (contents == "nil") {
        return new Nil()
    } else if (!isNaN(+contents)) {
        return new Number(+contents)
    } else {
        return new Symbol(contents)
    }
}

interface Reader {
    next: () => string
    peek: () => string
    hasNext: () => boolean
}