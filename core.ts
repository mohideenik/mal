import { Mal, Number, Nil, List, True, False, Vector, String } from "./types"
import { pr_str } from "./printer"

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