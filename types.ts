export type Mal = List | Atom

export type Atom = Number | Symbol | Str | True | False | Nil
export interface List {
    items: Mal[]
}

export interface Number {
    number: number
}
export interface Symbol {
    symbol: string
}
export interface Str {
    str: string
}
export interface True {}
export interface False {}
export interface Nil {}