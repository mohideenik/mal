import { Env } from "./env";

export const enum Node {
    List,
    Atom,
    Vector,
    Unquote,
    Quote,
    Map,
    Quasiquote,
    Number,
    String,
    Symbol, 
    Function,
    True,
    False,
    Colon,
    Null,
    Nil
}

export abstract class Mal {
    public abstract contents: any
    type: Node

    constructor(n: Node) {
        this.type = n
    }

    public abstract toString(print_readably: boolean): string
}

export class Function extends Mal {
    contents: any

    constructor(f: any) {
        super(Node.Function)
        this.contents = f
    }

    public toString(print_readably: boolean): string {
        return "#<function>"
    }
}

export class TCOFunction extends Mal {
    contents: Function
    ast: Mal
    params: string[]
    env: Env

    constructor(f: Function, ast: Mal, params: string[], env: Env) {
        super(Node.Function)
        this.contents = f
        this.ast = ast
        this.params = params
        this.env = env
    }

    public toString(print_readably: boolean): string {
        return "#<tco_function>"
    }
}

export class Colon extends Mal {
    contents: string

    constructor(x: string) {
        super(Node.Colon)
        this.contents = x
    }

    public toString(print_readably: boolean): string {
        return this.contents
    }
}

export class Atom extends Mal {
    contents: Mal

    constructor(x: Mal) {
        super(Node.Atom)
        this.contents = x
    }

    public toString(print_readably: boolean): string {
        return "(atom " + this.contents.toString(print_readably) + ")"
    }
}

export class Nil extends Mal {
    contents: any

    constructor() {
        super(Node.Nil)
        this.contents = "nil"
    }

    public toString(print_readably: boolean): string {
        return "nil"
    }
}

export class Null extends Mal {
    contents: any

    constructor() {
        super(Node.Null)
        this.contents = "null"
    }

    public toString(print_readably: boolean): string {
        return "null"
    }
}

export class False extends Mal {
    contents: any

    constructor() {
        super(Node.False)
        this.contents = "false"
    }

    public toString(print_readably: boolean): string {
        return "false"
    }
}

export class True extends Mal {
    contents: any

    constructor() {
        super(Node.True)
        this.contents = "true"
    }

    public toString(print_readably: boolean): string {
        return "true"
    }
}

export class Number extends Mal {
    contents: number

    constructor(x: number) {
        super(Node.Number)
        this.contents = x
    }

    public toString(print_readably: boolean): string {
        return "" + this.contents
    }
}

export class String extends Mal {
    contents: string

    constructor(x: string) {
        super(Node.String)
        this.contents = x
    }

    public toString(print_readably: boolean): string {
        if (print_readably)
            return JSON.stringify(this.contents)
        else
            return this.contents
    }
}

export class Symbol extends Mal {
    contents: string

    constructor(x: string) {
        super(Node.Symbol)
        this.contents = x
    }

    public toString(print_readably: boolean): string {
        return this.contents
    }
}

export class List extends Mal {
    public contents: Mal[]

    constructor(v: Mal[]) {
        super(Node.List)
        this.contents = v
    }

    public toString(print_readably: boolean): string {
        return "(" + this.contents
            .map(x => x.toString(print_readably))
            .join(" ") + ")"
    }
}

export class Vector extends Mal {
    public contents: Mal[]

    constructor(v: Mal[]) {
        super(Node.Vector)
        this.contents = v
    }

    public toString(print_readably: boolean): string {
        return "[" + this.contents
            .map(x => x.toString(print_readably))
            .join(" ") + "]"
    }
}

export class Map extends Mal {
    key: Mal
    contents: Mal

    constructor(k: Mal, v: Mal) {
        super(Node.Map)
        this.key = k
        this.contents = v
    }

    public toString(print_readably: boolean): string {
        return "{" + this.key.toString(print_readably) + " " + this.contents.toString(print_readably) + "}"
    }
}