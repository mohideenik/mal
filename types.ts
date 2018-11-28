export const enum Node {
    List,
    Atom,
    Null,
    Vector,
    Unquote,
    Quote,
    Map,
    Quasiquote
}

export abstract class Mal {
    type: Node

    constructor(n: Node) {
        this.type = n
    }

    public abstract toString(): string
}

export class Atom extends Mal {
    contents: string

    constructor(v: string) {
        super(Node.Atom)
        this.contents = v
    }

    public toString(): string {
        return this.contents
    }
}

export class List extends Mal {
    contents: Mal[]

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
    contents: Mal[]

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
    value: Mal

    constructor(k: Mal, v: Mal) {
        super(Node.Map)
        this.key = k
        this.value = v
    }

    public toString(): string {
        return "{" + this.key.toString() + " " + this.value.toString() + "}"
    }
}

export class Null extends Mal {
    constructor() {
        super(Node.Null)
    }

    public toString(): string {
        return ""
    }
}