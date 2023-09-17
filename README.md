# ShareImage (or SI)

SI (pronounced `ess-eye`) is a Social Share Preview Image Generator.

Don't get it? Well, it's the "thumbnail" of a website, or link, or anything.

## Installation

Installing is easy. It's just the matter of a few commands.

## Node.JS

In Node.JS, you can use the good'ol `shareimage` package. The `v5.*.*` versions of this package support TS and uses `canvas` package (which uses native code).  I'm working on the new `v6` of this one, which would use WASM. This will be available as `@rg.dev/si` as well.

```sh
npm i shareimage
```

Or:

```sh
yarn add shareimage
```

## Deno

In Deno, you can use the `sideno` package. `v1.*.*` versions of this package use the `canvas` package (WASM). This new `v2` uses the `si-img` Rust crate (WASM)!

The `v2` is **~6 times** faster than `v1`!

To use it, simply import it from [deno.land](https://deno.land/x/sideno):

```ts
import si from "https://deno.land/x/sideno/mod.ts"; // LATEST VERSION
```

## Usage

> Note: Please use **v2.0.2** or higher versions, because **v2.0.0** and **v2.0.1** has a critical bug preventing it from even working.

The new `v2` of this package is a written from scratch one, and yes, it's a breaking change.

Here's how to use it *now*:

```ts
import si from "https://deno.land/x/sideno/mod.ts";

let img = new si.Image("IMG_URL_OR_UINT8ARRAY_BUFFER", new si.Font("INITIAL_FONT_URL_OR_UINT8ARRAY_BUFFER")); // Font is now required;
await img.init(); // Required

img
    .text("Hello, Title", 64, 480, 254)
    .text("Hello, tagline", 48, 480, 320);
    // Supports chaining!

let bytes = img.as_bytes;
let duri = img.as_base64;
```

## Docs

Coming soon...

## Building

Building it is easy, it just takes *some* time.

### Requirements

It depends on the [`si-rs`](https://github.com/regraphic/si-rs) project, which is written in Rust. So, you need them:

- Rust `wasm32-unknown-unknown` toolchain (+ Cargo)
- `wasm-pack` CLI (for easy building)
- Some patience

To build it, simply run the `scripts/build.ts` script with Deno:

```ts
deno run -Ar scripts/build.ts
```

Once done, you'll have a `pkg` directory ready. That's all it needs.

## Sponsors

We have been sponsored by **Vercel**, **MacStadium**.  
Vercel gave us free **Pro Plan** access to host the documentation and other websites.  
MacStadium gave us free **Mac Mini Server** to host the API and for builds.

[![Powered By Vercel](https://res.cloudinary.com/zype/image/upload/ShareImage/powered-by-vercel.png)](https://vercel.com/?utm_source=zypeoss&utm_campaign=oss)

<img src="https://res.cloudinary.com/zype/image/upload/ShareImage/MacStadium" height="44" width="212">
