import { yellow, green, red } from "https://deno.land/std/fmt/colors.ts";

console.log(green("Starting Build Process"))
console.log(yellow("Note: It doesn't check for dependencies. So watch out for errors\n"));

try {
    if (await Deno.stat("pkg")) {
        console.log(red("pkg Already exists. Doing nothing.\n"));
        Deno.exit(0);
    }
    if (await Deno.stat("rs")) {
        console.log(red("rs Already exists. Doing nothing.\n"));
        Deno.exit(0);
    }
} catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
    }
}
await Deno.stdout.write(new TextEncoder().encode(yellow("Cloning the repo")));

let git_clone = new Deno.Command("git", {
    args: ["clone", "https://github.com/regraphic/si-rs", "rs"],
});

var { code, stdout, stderr } = await git_clone.output();


if ((code !== 0)) {
    await Deno.stdout.write(new TextEncoder().encode("\r" + red("Failed to clone si-rs") + "\n"));
    console.log(new TextDecoder().decode(stderr));
} else {
    await Deno.stdout.write(new TextEncoder().encode("\r" + green("Successfully cloned si-rs") + "\n"));
}

await Deno.stdout.write(new TextEncoder().encode(yellow("Building si-rs")));

let wasm_pack_build = new Deno.Command("wasm-pack", {
    args: ["build", "--target", "deno", "--no-default-features", "--features", "async"],
    cwd: "rs"
});

var { code, stdout, stderr } = await wasm_pack_build.output();

if ((code !== 0)) {
    await Deno.stdout.write(new TextEncoder().encode("\r" + red("Failed to build si-rs") + "\n"));
    console.log(new TextDecoder().decode(stderr));
} else {
    await Deno.stdout.write(new TextEncoder().encode("\r" + green("Successfully built si-rs") + "\n"));
}

await Deno.stdout.write(new TextEncoder().encode(yellow("Cleaning up")));

await Deno.rename("rs/pkg", "./pkg");

await Deno.remove("rs", {recursive: true});
await Deno.remove("pkg/README.md", {recursive: true});
await Deno.remove("pkg/.gitignore", {recursive: true});
const old = await Deno.readTextFile("pkg/si_img.js");
const _new = old.replace("const wasm_url = new URL('si_img_bg.wasm', import.meta.url);\nlet wasmCode = '';\nswitch (wasm_url.protocol) {\n    case 'file:':\n    wasmCode = await Deno.readFile(wasm_url);\n    break\n    case 'https:':\n    case 'http:':\n    wasmCode = await (await fetch(wasm_url)).arrayBuffer();\n    break\n    default:\n    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);\n}", "const wasm_url = new URL('si_img_bg.wasm', import.meta.url);\nconst response = await fetch(wasm_url);\nif (!response.ok) {\n    throw new Error(`Failed to fetch WebAssembly module: ${response.statusText}`);\n}\nconst { instance } = await WebAssembly.instantiateStreaming(response, imports);\nconst wasm = instance.exports;\nconst wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;\nconst wasm = wasmInstance.exports;");
await Deno.writeTextFile("pkg/si_img.js", _new);

await Deno.stdout.write(new TextEncoder().encode("\r" + green("Cleanup done!") + "\n"));

console.log(green("Building Completed!"))
