import {loadImage, createCanvas} from "./deps.ts";

interface ImageTextFont {
    src: ArrayBuffer,
    alias: string,
    family: string,
}

interface ImageTextComponent {
    text: string,
    posX: number,
    posY: number,
    font: Promise<ImageTextFont> | ImageTextFont,
    color: string
}

class Font {
    src: string | ArrayBuffer;
    alias: string;
    family: string;
    constructor (src: string | ArrayBuffer, alias: string, family: string) {
        this.src = src;
        this.alias = alias;
        this.family = family;
    }
    async export() {
        let buf: ArrayBuffer;
        if (typeof this.src === "string") {
            buf = await (await fetch(this.src)).arrayBuffer();
        } else {
            buf = this.src;
        }
        return {
            src: buf,
            alias: this.alias,
            family: this.family
        }

    }
}

/** A class of the SI.Image */

export class Image {
    TITLE_FONT_SIZE = 64;
    TAGLINE_FONT_SIZE = 48;
    TAGLINE_Y = 320;
    IMAGE_WIDTH = 1280;
    IMAGE_HEIGHT = 669;
    src: string|Uint8Array;
    title: ImageTextComponent = {text: "", posX: 480, posY: 254, font: (new Font("https://github.com/Zype-Z/ShareImage.js/raw/main/assets/fonts/sirin-stencil.ttf", "sirin", "Sirin Stencil")).export(), color: "black"};
    tagline: ImageTextComponent = {text: "", posX: 480, posY: 320, font: (new Font("https://github.com/Zype-Z/ShareImage.js/raw/main/assets/fonts/arial.ttf", "arial", "Arial")).export(), color: "black"};
    constructor (src: string |Uint8Array){
        this.src = src;
    }
    /**
     * @param {"buffer" | "data"} _type - Buffer or Data URI export option.
     * @returns {Promise<ArrayBuffer | string>} A Promise containing the ArrayBuffer or Data URI of the output image.
     */
    export(_type: "buffer" | "data") {
        return (async () => {
            const img = await loadImage(this.src);
            const canvas = createCanvas(this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            const ctx = canvas.getContext("2d");
            const title_font = await this.title.font;
            const tagline_font = await this.tagline.font;
            await canvas.loadFont(title_font.src, {family: title_font.alias});
            await canvas.loadFont(tagline_font.src, {family: tagline_font.alias});
            ctx.drawImage(img, 0, 0);
            ctx.font = `${this.TITLE_FONT_SIZE}px ${title_font.alias}`;
            ctx.fillText(this.title.text, this.title.posX, this.title.posY);
            if (this.tagline.text) {
                ctx.font = `${this.TAGLINE_FONT_SIZE}px ${tagline_font.alias}`;
                ctx.fillText(this.tagline.text, this.tagline.posX, this.tagline.posY);
            }
            if (_type === "buffer") {
                return canvas.toBuffer("image/png");
            } else {
                return canvas.toDataURL("image/png", 100);
            }
        })()
    }
}

export default {
    Font,
    Image
}