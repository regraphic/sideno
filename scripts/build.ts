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

await Deno.stdout.write(new TextEncoder().encode("\r" + green("Cleanup done!") + "\n"));

console.log(green("Building Completed!"))