import { Mal, Number, Nil, List, True, False, Vector, String, Atom, TCOFunction } from "./types"
import { read_str } from "./reader";

const fs = require('fs');

export const ns : {[key: string] : any} = {
    "+": (x: Mal, y: Mal) => new Number(x.contents + y.contents),
    "-": (x: Mal, y: Mal) => new Number(x.contents - y.contents),
    "*": (x: Mal, y: Mal) => new Number(x.contents * y.contents),
    "/": (x: Mal, y: Mal) => new Number(x.contents / y.contents),
    "prn": (...x: Mal[]) => {
        if (x.length > 0) {
            let result = x.map(y => y.toString(true)).join(" ")
            console.log(result)
        } else {
            console.log("")
        }
        return new Nil()
    },
    "pr-str": (...x: Mal[]) => {
        if (x.length > 0) {
            let result = x.map(y => y.toString(true)).join(" ")
            return new String(result)
        } else {
            return new String("")
        }
    },
    "str": (...x: Mal[]) => {
        if (x.length > 0) {
            let result = x.map(y => y.toString(false)).join("")
            return new String(result)
        }
        return new String("")
    },
    "println": (...x: Mal[]) => {
        if (x.length > 0) {
            let result = x.map(y => y.toString(false)).join(" ")
            console.log(result)
        } else {
            console.log("")
        }
        return new Nil()
    },
    "list": (...args: Mal[]) => {
        return new List(args)
    },
    "list?": (x: Mal) => {
        if (x instanceof List)
            return new True()
        else
            return new False()
    },
    "empty?": (x: Mal) => {
        if (x.contents.length == 0)
            return new True()
        else
            return new False()  
    },
    "count": (x: Mal) => {
        if (x instanceof List || x instanceof Vector)
            return new Number(x.contents.length) 
        else
            return new Number(0)
    },
    "=": equal,
    "<": (x: Mal, y: Mal) => {
        if (x.contents < y.contents) return new True()
        return new False()
    },
    ">": (x: Mal, y: Mal) => {
        if (x.contents > y.contents) return new True()
        return new False()
    },
    "<=": (x: Mal, y: Mal) => {
        if (x.contents <= y.contents) return new True()
        return new False()
    },
    ">=": (x: Mal, y: Mal) => {
        if (x.contents >= y.contents) return new True()
        return new False()
    },
    "read-string": (str: Mal) => {
        return read_str(str.contents)
    },
    "slurp": (fn: Mal) => {
        let filename = fn.contents
        let contents = fs.readFileSync(filename, 'utf8')
        return new String(contents)
    },
    "atom": (ast: Mal) => {
        return new Atom(ast)
    },
    "atom?": (ast: Mal) => {
        if (ast instanceof Atom)
            return new True()
        else
            return new False()
    },
    "deref": (ast: Mal) => {
        return ast.contents
    },
    "reset!": (atom: Mal, val: Mal) => {
        atom.contents = val
        return val
    },
    "swap!": (atom: Mal, fn: Mal, ...args: Mal[]) => {
        var fun;
        if (fn instanceof TCOFunction)
            fun = fn.contents.contents
        else
            fun = fn.contents
        
        let new_args = [atom.contents].concat(args)
        atom.contents = fun.apply(null, new_args)
        return atom.contents
    },
    "remove-comments": (str: Mal) => {
        str.contents = str.contents.replace(/;;.*\n?/g, "")
        return str
    }
}

function equal (x: Mal, y: Mal): Mal {
    if ((x instanceof List || x instanceof Vector) 
            && (y instanceof List || y instanceof Vector)) {
        if (x.contents.length != y.contents.length)
            return new False()
        
        for (var i = 0; i < x.contents.length; i++) {
            let result = equal(x.contents[i], y.contents[i])
            if (result instanceof False)
                return result
        }
        return new True()
    } else if (x.constructor != y.constructor) {
        return new False()
    } else if (x.contents == y.contents) {
        return new True()
    } else {
        return new False()
    }
}