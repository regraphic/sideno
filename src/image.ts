import { SiImage } from "../deps.ts";
import Font from "./font.ts";
import {encodeB64} from "../deps.ts";

export class Image {
    img?: SiImage;
    #img: Promise<SiImage>;

    constructor(src: string | Uint8Array, font: Font) {
        if (typeof src === "string") {
            this.#img = new Promise<SiImage>(async resolve => resolve(await new SiImage(src, await font.font, undefined)));
        } else {
            this.#img = new Promise<SiImage>(async resolve => resolve(await new SiImage("", await font.font, src)));
        }
    }

    /**
     * Initializes the function.
     *
     * @return {Promise<void>} - A Promise that resolves when the function is initialized.
     */
    async init() {
        this.img = await this.#img;
        return this;
    }

    /**
     * Generates an image with the specified text.
     *
     * @param {string} text - The text to be added to the image.
     * @param {number} scale - The scale of the text.
     * @param {number} x - The x-coordinate of the text.
     * @param {number} y - The y-coordinate of the text.
     * @param {string} color - The color of the text (optional, default value is #000000).
     * @return {Image} - The updated image.
     */
    text(text: string, scale: number, x: number, y: number, color = "#000000"): Image {
        this.img = this.img?.text(text, scale, x, y, color);
        if (!this.#img) throw new Error("Image is empty");
        return this;
    }

    /**
     * Set the font for the image.
     *
     * @param {Font} font - The font to be set for the image.
     */
    set font(font: Font) {
        (async () => {
            if (this.img) this.img.font = await font.font;
        })();
    }

    /**
     * Sets the font for the image.
     *
     * @param {Font} font - The font to be set.
     * @return {Image} - The updated image object.
     */
    set_font(font: Font): Image {
        (async () => {
            if (this.img) this.img.font = await font.font;
        })();
        return this;
    }

    /**
     * Returns the image data as a Uint8Array.
     *
     * @return {Uint8Array} The image data as a Uint8Array (Buffer).
     */
    get as_bytes(): Uint8Array {
        return this.img?.as_bytes || new Uint8Array();
    }

    /**
     * Retrieves the base64 representation of the image.
     *
     * @return {string} The base64 representation of the image.
     */
    get as_base64(): string {
        return encodeB64(this.img?.as_bytes || new Uint8Array());
    }
}

export default {Image};