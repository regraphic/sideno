import { Image, Font } from "../mod.ts";

let font = new Font("https://github.com/Zype-Z/ShareImage.js/raw/main/assets/fonts/sirin-stencil.ttf");
let img = new Image("https://res.cloudinary.com/zype/image/upload/regraphic");
await img.init();

await img.text("Hello, World!", 64, 480, 254, font);

console.info("Dimensions:", (img.width + "x" + img.height));
