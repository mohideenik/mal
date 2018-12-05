import { Mal } from "./types"

export class Env {
    private outer: Env | null
    private data: {[key: string] : any}

    constructor(outer: Env | null, binds: string[], exprs: Mal[]) {
        this.outer = outer
        this.data = {}

        for (var i = 0; i < binds.length; i++)
            this.set(binds[i], exprs[i])
    }

    public set(key: string, value: any) {
        this.data[key] = value
    }

    public find(key: string): any | null {
        if (this.data[key]) {
            return this.data[key]
        } else if (this.outer != null) {
            return this.outer.find(key)
        } else {
            return null
        }
    }

    public get(key: string): any {
        let result = this.find(key)
        if (result == null) 
            throw "'" + key + "' not found"
        else
            return result
    }
}