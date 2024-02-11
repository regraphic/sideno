import { yellow, green, red } from "https://deno.land/std@0.204.0/fmt/colors.ts";
import { parse } from "https://deno.land/std@0.205.0/flags/mod.ts";
// import Logger from "https://raw.githubusercontent.com/deno-library/logger/d34e9197f4477446b5b80ebc4524804efeef1674/mod.ts";
import Logger from "https://deno.land/x/logger@v1.1.3/mod.ts";
const logger = new Logger();

const flags = parse(Deno.args, {
    boolean: [
        "ignore-pkg-check",
        "bypass-pkg-check",
        "ignore-rs-check",
        "bypass-rs-check"
    ],
    string: [
        "patch_url"
    ]

});

if (flags["bypass-pkg-check"] && flags["ignore-pkg-check"]) {
    logger.error("--bypass-pkg-check and --ignore-pkg-check are mutually exclusive.", new Error("UNSUPPORTED_FLAG_COMBINATION"));
    Deno.exit(1);
}

if (flags["bypass-rs-check"] && flags["ignore-rs-check"]) {
    logger.error("--bypass-rs-check and --ignore-rs-check are mutually exclusive.", new Error("UNSUPPORTED_FLAG_COMBINATION"));
    Deno.exit(1);
}

logger.info("[soc::build] Starting build process")
logger.warn("[soc::build] NOTE: It doesn't check for dependencies. So, watch out for errors!");

try {
    if (await Deno.stat("pkg")) {
        logger.warn("[soc::build] pkg already exists");
        if (flags["bypass-pkg-check"]) {
            logger.info("[soc::build] Bypassing existing pkg");
            await Deno.remove("pkg", {recursive: true});
        } else if (flags["ignore-pkg-check"]) {
            logger.info("[soc::build] Skipping pkg check");
        } else {
            logger.error("[soc::build] pkg already exists. Doing nothing.", new Error("PKG_ALREADY_EXISTS"));
            Deno.exit(1);
        }
    }
    if (await Deno.stat("rs")) {
        logger.warn("[soc::build] rs already exists");
        if (flags["bypass-rs-check"]) {
            logger.info("[soc::build] Bypassing existing rs");
            await Deno.remove("rs", {recursive: true});
        } else if (flags["ignore-rs-check"]) {
            logger.info("[soc::build] Skipping rs check");
        } else {
            logger.error("[soc::build] rs already exists. Doing nothing.", new Error("RS_ALREADY_EXISTS"));
            Deno.exit(1);
        }
    }
} catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
    }
}

logger.info("[soc::git] Cloning si-rs");

const git_clone = new Deno.Command("git", {
    args: ["clone", "https://github.com/regraphic/si-rs", "rs"],
});

var { code, stderr } = (!flags["ignore-rs-check"]) ? await git_clone.output() : {code: 0, stderr: new Uint8Array([])};


if ((code !== 0)) {
    logger.error("[soc::git] Failed to clone si-rs.", new Error("GIT_CLONE_FAILED"));
    logger.error(new TextDecoder().decode(stderr));
    Deno.exit(1);
} else {
    logger.info("[soc::git] Successfully cloned si-rs");
    if (flags["patch_url"]) {
        logger.info("[soc::git] Applying patch");
        const patch_buf = await (await fetch(flags["patch_url"])).arrayBuffer();
        await Deno.writeFile("patch.diff", new Uint8Array(patch_buf));
        const git_clone = new Deno.Command("git", {
            args: ["apply", "../patch.diff"],
            cwd: "rs"
        });
        
        var { code, stderr } = await git_clone.output();
        if ((code !== 0)) {
            logger.error("[soc::git] Failed to apply patch.", new Error("GIT_PATCH_FAILED"));
            logger.error(new TextDecoder().decode(stderr));
            Deno.exit(1);
        } else {
            logger.info("[soc::git] Successfully applied patch");
        }
        await Deno.remove("patch.diff");
    }
}

logger.info("[soc::wasm-pack] Building si-rs");

let wasm_pack_build = new Deno.Command("wasm-pack", {
    args: ["build", "--target", "deno", "--no-default-features", "--features", "async"],
    cwd: "rs"
});

var { code, stdout, stderr } = (!flags["ignore-pkg-check"]) ? await wasm_pack_build.output() : {code: 0, stdout: new Uint8Array([]), stderr: new Uint8Array([])};

if ((code !== 0)) {
    logger.error("[soc::wasm-pack] Failed to build si-rs.", new Error("WASM_BUILD_FAILED"));
    logger.error(new TextDecoder().decode(stderr));
    Deno.exit(1);
} else {
    logger.info("[soc::wasm-pack] Successfully built si-rs");
}

logger.info("[soc::clean] Finishing up");

try {
    if (!flags["ignore-rs-check"]) {
        await Deno.rename("rs/pkg", "pkg");
        await Deno.remove("rs", {recursive: true});
    }
    if (!flags["ignore-pkg-check"]) {
        await Deno.remove("pkg/README.md", {recursive: true});
        await Deno.remove("pkg/.gitignore", {recursive: true});
    }
    
    const _old = await Deno.readTextFile("pkg/si_img.js");
    let _new = _old.split("\n");
    for (let i = 0; i < _old.split("\n").length; i++) {
        const line = _old.split("\n")[i];
        const previous = _old.split("\n")[i - 1];
        if (line.includes("let wasmCode = '';")) {
            _new[i] = "";
        }
        if (line.includes("}") && previous.includes("throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);")) {
            _new[i] = "";
        }
        if (line.includes("switch (wasm_url.protocol) {")) {
            _new[i] = "";
        }
        if (line.includes("case 'file:':")) {
            _new[i] = "";
        }
        if (line.includes("wasmCode = await Deno.readFile(wasm_url);")) {
            _new[i] = "";
        }
        if (line.includes("break") && !previous.includes("const code = arg.charCodeAt(offset);")) {
            _new[i] = "";
        }
        if (line.includes("case 'https:':")) {
            _new[i] = "";
        }
        if (line.includes("case 'http:':")) {
            _new[i] = "";
        }
        if (line.includes("wasmCode = await (await fetch(wasm_url)).arrayBuffer();")) {
            _new[i] = "";
        }
        if (line.includes("break")) {
            _new[i] = "";
        }
        if (line.includes("default:")) {
            _new[i] = "";
        }
        if (line.includes("throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);")) {
            _new[i] = "";
        }
        if (line.includes("wasmCode = await WebAssembly.instantiate(wasmCode, imports);")) {
            _new[i] = "";
        }
        if (line.includes("const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;")) {
            _new[i] = "";
        }
        if (line.includes("wasm = wasmInstance.exports;")) {
            _new[i] = "";
        }
    }
    await Deno.writeTextFile("pkg/si_img.js", _new.join("\n") + "\n" + await Deno.readTextFile("scripts/patch/new.js"));
} catch (err) {
    logger.error("[soc::clean] Failed to clean up.", err);
}

logger.info("[soc::clean] Completed");

logger.info("[soc::build] Completed");
