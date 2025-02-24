export interface CardData {
    title:string
    titlePrefix?: string
    text:string
    
    pronounce:string
    pinyin: string

    type: 'BASE'

    comment?:string
    textToDisplay?:string
    textToSay?:string
}


export interface Content {
    section: {
        h1: string
        h2?: string
    }
    items: CardData[]
}
