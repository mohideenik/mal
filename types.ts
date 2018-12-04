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
    Nil
}

export abstract class Mal {
    public abstract contents: any
    type: Node

    constructor(n: Node) {
        this.type = n
    }

    public abstract toString(): string
}

export class Function extends Mal {
    contents: any

    constructor(f: any) {
        super(Node.Function)
        this.contents = f
    }

    public toString(): string {
        return this.contents
    }
}

export abstract class Atom extends Mal {
    constructor(t: Node) {
        super(t)
    }
}

export class Nil extends Atom {
    contents: any

    constructor() {
        super(Node.Nil)
    }

    public toString(): string {
        return "nil"
    }
}

export class False extends Atom {
    contents: any

    constructor() {
        super(Node.False)
    }

    public toString(): string {
        return "false"
    }
}

export class True extends Atom {
    contents: any

    constructor() {
        super(Node.True)
    }

    public toString(): string {
        return "true"
    }
}

export class Number extends Atom {
    contents: number

    constructor(x: number) {
        super(Node.Number)
        this.contents = x
    }

    public toString(): string {
        return "" + this.contents
    }
}

export class String extends Atom {
    contents: string

    constructor(x: string) {
        super(Node.String)
        this.contents = x
    }

    public toString(): string {
        return this.contents
    }
}

export class Symbol extends Atom {
    contents: string

    constructor(x: string) {
        super(Node.Symbol)
        this.contents = x
    }

    public toString(): string {
        return this.contents
    }
}

export class List extends Mal {
    public contents: Mal[]

    constructor(v: Mal[]) {
        super(Node.List)
        this.contents = v
    }

    public toString(): string {
        return "(" + this.contents
            .map(x => x.toString())
            .join(" ") + ")"
    }
}

export class Vector extends Mal {
    public contents: Mal[]

    constructor(v: Mal[]) {
        super(Node.Vector)
        this.contents = v
    }

    public toString(): string {
        return "[" + this.contents
            .map(x => x.toString())
            .join(" ") + "]"
    }
}

export class Unquote extends Mal {
    contents: Mal

    constructor(v: Mal) {
        super(Node.Unquote)
        this.contents = v
    }

    public toString(): string {
        return "(unquote " + this.contents.toString() + ")"
    }
}

export class Quasiquote extends Mal {
    contents: Mal

    constructor(v: Mal) {
        super(Node.Quasiquote)
        this.contents = v
    }

    public toString(): string {
        return "(quasiquote " + this.contents.toString() + ")"
    }
}

export class Quote extends Mal {
    contents: Mal

    constructor(v: Mal) {
        super(Node.Quote)
        this.contents = v
    }

    public toString(): string {
        return "(quote " + this.contents.toString() + ")"
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

    public toString(): string {
        return "{" + this.key.toString() + " " + this.contents.toString() + "}"
    }
}