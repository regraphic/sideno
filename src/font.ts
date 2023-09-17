import { SiFont } from "../deps.ts";

export class Font {
    public font: Promise<SiFont>
    constructor(src: string | Uint8Array) {
        if (typeof src === "string") {
            this.font = new Promise<SiFont>(async (resolve) => resolve(await SiFont.from_network_async(src)));
        } else {
            this.font = new Promise<SiFont>(async (resolve) => resolve(new SiFont(src)))
        }
    }
}

export default Font;