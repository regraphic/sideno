import { SiFont } from "../deps.ts";

export class Font {
    public font: Promise<SiFont>
    constructor(src: string | Uint8Array) {
        if (typeof src === "string") {
            this.font = new Promise<SiFont>(async (resolve) => resolve(await new SiFont(src,undefined)));
        } else {
            this.font = new Promise<SiFont>(async (resolve) => resolve(await new SiFont("", src)))
        }
    }
}

export default Font;