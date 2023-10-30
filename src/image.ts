import { SiImage } from "../deps.ts";
import Font from "./font.ts";
import {encodeB64} from "../deps.ts";
import { Preset } from "./preset.ts";
export class Image {
    img?: SiImage;
    #img: Promise<SiImage>;

    constructor(src: string | Uint8Array) {
        if (typeof src === "string") {
            this.#img = new Promise<SiImage>(async resolve => resolve(await SiImage.from_network_async(src)));
        } else {
            this.#img = new Promise<SiImage>(async resolve => resolve(await SiImage.from_vec(src)));
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
     * @param {Font} font - The font to use
     * @return {Promise<Image>} - The updated image.
     */
    async text(text: string, scale: number, x: number, y: number, color = "#000000", font: Font): Promise<Image> {
        if (!this.img) throw new Error("Image is empty");
        this.img = this.img?.text(text, scale, x, y, color, await font.font);
        return this;
    }

    /**
     * Generates an image with the specified image as overlay.
     * 
     * @param {Image} img - The image to overlay.
     * @param {number} x - The x-coordinate of the overlay.
     * @param {number} y - The y-coordinate of the overlay.
     * @return {Promise<Image>} - The updated image.
     */
    async image(img: Image, x: number, y: number): Promise<Image> {
        if (!this.img) throw new Error("Image is empty");
        this.img = this.img?.image(await img.#img, BigInt(x), BigInt(y));
        return this;
    }

    /**
     * Returns the image data as a Uint8Array.
     *
     * @return {Uint8Array} The image data as a Uint8Array (Buffer).
     */
    get as_bytes(): Uint8Array {
        return this.img?.to_bytes() || new Uint8Array();
    }

    /**
     * Retrieves the base64 representation of the image.
     *
     * @return {string} The base64 representation of the image.
     */
    get as_base64(): string {
        return encodeB64(this.img?.to_bytes() || new Uint8Array());
    }

    async preset(preset: Preset, values: object): Promise<Image> {
        if (!this.img) throw new Error("Image is empty");
        const final = await preset.cb(this, values);
        this.img = final.img;
        return this;
    }

    resize(width: number, height: number): Image {
        this.img = this.img?.resize(width, height);
        if (!this.img) throw new Error("Image is empty");
        return this;
    }
}

export default Image;