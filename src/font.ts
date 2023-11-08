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
        return this;
    }

    async [Symbol.dispose]() {
        await this.font?.free();
        delete this.font;
    }
}

export default Font;
