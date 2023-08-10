import {loadImage, createCanvas} from "./deps.ts";

export interface ImageTextFont {
    src: ArrayBuffer,
    alias: string,
    family: string,
}

export interface ImageTextComponent {
    text: string,
    posX: number,
    posY: number,
    font: Promise<ImageTextFont> | ImageTextFont,
    /**
     * @todo Add support for text color
     */
    color: string
}

/** 
 * Represents a Font
 * @class
 * @classdesc Class for SI.Font.
 * @example
 * // example usage:
 * let font = new Font("FONT_URL", "Font Name", "Font Family");
 * // Assuming "img" is an instance of SI.Font
 * img.title.font = await font.export();
 * img.tagline.font = await font.export();
 */

export class Font {
    src: string | ArrayBuffer;
    alias: string;
    family: string;
    /**
     * Creates a SI.Font Instance
     * @constructor
     */
    constructor (src: string | ArrayBuffer, alias: string, family: string) {
        this.src = src;
        this.alias = alias;
        this.family = family;
    }
    /*
     * Exports the font
     * @returns {Promise<ImageTextFont} The Font
     */
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

/** A class of the SI.Image
 * @class
 * @classdesc The SI.Image class
 * @example
 * // example usage:
 * let img = new SI.Image("IMAGE_URL");
 * img.title.text = "Title";
 * img.tagline.text = "Tagline";
 */

export class Image {
    TITLE_FONT_SIZE = 64;
    TAGLINE_FONT_SIZE = 48;
    TAGLINE_Y = 320;
    /**
     * @todo Do automatic resize of the image
     */
    IMAGE_WIDTH = 1280;
    IMAGE_HEIGHT = 669;
    src: string|Uint8Array;
    title: ImageTextComponent = {text: "", posX: 480, posY: 254, font: (new Font("https://github.com/Zype-Z/ShareImage.js/raw/main/assets/fonts/sirin-stencil.ttf", "sirin", "Sirin Stencil")).export(), color: "black"};
    tagline: ImageTextComponent = {text: "", posX: 480, posY: 320, font: (new Font("https://github.com/Zype-Z/ShareImage.js/raw/main/assets/fonts/arial.ttf", "arial", "Arial")).export(), color: "black"};
    
    /**
     * Creates an instance of SI.Image
     * @constructor
     */
    constructor (src: string | Uint8Array){
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
            canvas.loadFont(title_font.src, {family: title_font.alias});
            canvas.loadFont(tagline_font.src, {family: tagline_font.alias});
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
    Image,
    VERSION: "v1.0.1"
}
