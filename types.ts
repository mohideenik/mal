export const enum Node {
    List,
    Atom
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