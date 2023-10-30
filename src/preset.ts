import Image from "./image.ts";

export class Preset {
    img: Image;
    cb: (img: Image, values: object) => Promise<Image>;

    constructor(img: Image, cb: (img: Image, values: object) => Promise<Image>) {
        this.img = img;
        this.cb = cb;
    }
}

export default Preset;