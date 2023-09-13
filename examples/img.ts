import { Image } from "../mod.ts";
import font from "./font.ts";

const img = await new Image("https://res.cloudinary.com/zype/image/upload/w_1280,h_669/regraphic.png", font);
await img.init();
img
    .text("Hello, from", 48, 480, 254)
    .text("ReGraphic", 64, 480, 320, "#00FFFF");

await Deno.writeFile("out.png", img.as_bytes);