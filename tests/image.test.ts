import { Image, Font } from "../mod.ts";
import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";


Deno.test("image", async (t) => {
    const font = new Font("https://github.com/Zype-Z/ShareImage.js/raw/main/assets/fonts/sirin-stencil.ttf");
    const img = new Image("https://res.cloudinary.com/zype/image/upload/regraphic");
    await img.init();
    await font.init()
    await img.text("Hello, World!", 64, 480, 254, font);
    await img.text("Hello, Tagline!", 64, 480, 300, font);
    await t.step("height and width", () => {
        assertEquals(img.width, 1280);
        assertEquals(img.height, 669);
    })
    await t.step("buffer", async () => {
        const file = await Deno.readFile("tests/test.png");
        assertEquals(img.as_bytes, file)
    })
})