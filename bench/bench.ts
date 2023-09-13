import * as si_core from "../pkg/si_img.js";
import si from "https://deno.land/x/sideno/mod.ts";

let img = await fetch("https://res.cloudinary.com/zype/image/upload/w_1200,h_650/CodeWithR/Template.png");
let bytes = new Uint8Array(await img.arrayBuffer());
let font = await fetch("https://github.com/Zype-Z/ShareImage.js/raw/main/assets/fonts/sirin-stencil.ttf");
let f_bytes = new Uint8Array(await font.arrayBuffer());

Deno.bench("si_new", {group: "si", baseline: true}, async () => {
    let font = await new si_core.SiFont("", f_bytes);
    let img = await new si_core.SiImage("", font, bytes);
    img.text("Hello, World!", 64, 480, 254, undefined);
    let _ = img.as_bytes;
})

Deno.bench("si_old", {group: "si"}, async () => {
    let font = new si.Font(f_bytes, "sirin", "Sirin Stencil");
    let img = new si.Image(bytes);

    img.title.font = await font.export();
    img.title.text = "Hello, World!";

    let _ = await img.export("buffer");
})