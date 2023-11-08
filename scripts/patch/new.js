const response = await fetch(wasm_url);
if (!response.ok) {
    throw new Error(`Failed to fetch WebAssembly module: ${response.statusText}`);
}

const { instance } = await WebAssembly.instantiateStreaming(response, imports);
const wasm = instance.exports;
