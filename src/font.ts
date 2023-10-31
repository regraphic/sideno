import { SiFont } from "../deps.ts";

export class Font {
    #font: Promise<SiFont>;
    public font?: SiFont;
    constructor(src: string | Uint8Array) {
        if (typeof src === "string") {
            this.#font = new Promise<SiFont>(async resolve => resolve(await SiFont.from_network_async(src)));
        } else {
            this.#font = new Promise<SiFont>(async resolve => resolve(await SiFont.from_vec(src)))
        }
    }

    async init(): Promise<Font> {
        this.font = await this.#font;
        console.log(this.#font);
        console.log(this.font);
        return this;
    }
}

export default Font;
