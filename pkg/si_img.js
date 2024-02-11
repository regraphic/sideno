

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);

        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_24(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures__invoke1_mut__h273cfbc3e0d9a401(arg0, arg1, addHeapObject(arg2));
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_106(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h5388ae7bd9551f38(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

const SiFontFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sifont_free(ptr >>> 0));
/**
* Represents a font used for text rendering.
*/
export class SiFont {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SiFont.prototype);
        obj.__wbg_ptr = ptr;
        SiFontFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SiFontFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sifont_free(ptr);
    }
    /**
    * Creates a new SiFont from a vector of font data.
    * @param {Uint8Array} vec
    */
    constructor(vec) {
        const ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sifont_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * Creates a new SiFont from a vector of font data.
    * @param {Uint8Array} vec
    * @returns {SiFont}
    */
    static from_vec(vec) {
        const ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sifont_from_vec(ptr0, len0);
        return SiFont.__wrap(ret);
    }
    /**
    * Creates a new SiFont from font data fetched from a network URL asynchronously.
    *
    * # Arguments
    *
    * * `url` - The URL from which to fetch the font data.
    * @param {string} url
    * @returns {Promise<SiFont>}
    */
    static from_network_async(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sifont_from_network_async(ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Placeholder method for when blocking feature is not enabled.
    * @param {string} url
    */
    static from_network(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.sifont_from_network(ptr0, len0);
    }
}

const SiImageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_siimage_free(ptr >>> 0));
/**
* Represents an image with text rendering capabilities.
*/
export class SiImage {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SiImage.prototype);
        obj.__wbg_ptr = ptr;
        SiImageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SiImageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_siimage_free(ptr);
    }
    /**
    * Creates a new SiImage from a vector of image data.
    *
    * # Arguments
    *
    * * `src` - The vector of image data.
    * @param {Uint8Array} src
    */
    constructor(src) {
        const ptr0 = passArray8ToWasm0(src, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.siimage_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * Creates a new SiImage from a vector of image data.
    * @param {Uint8Array} vec
    * @returns {SiImage}
    */
    static from_vec(vec) {
        const ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.siimage_from_vec(ptr0, len0);
        return SiImage.__wrap(ret);
    }
    /**
    * Creates a new SiImage from image data fetched from a network URL asynchronously.
    *
    * # Arguments
    *
    * * `image_url` - The URL from which to fetch the image data.
    * @param {string} image_url
    * @returns {Promise<SiImage>}
    */
    static from_network_async(image_url) {
        const ptr0 = passStringToWasm0(image_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.siimage_from_network_async(ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Placeholder method for when blocking feature is not enabled.
    * @param {string} image_url
    */
    static from_network(image_url) {
        const ptr0 = passStringToWasm0(image_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.siimage_from_network(ptr0, len0);
    }
    /**
    * Renders text onto the image.
    *
    * # Arguments
    *
    * * `text` - The text to render on the image.
    * * `text_scale` - The scale of the rendered text.
    * * `pos_x` - The X-coordinate position for rendering.
    * * `pos_y` - The Y-coordinate position for rendering.
    * * `color` - The color of the rendered text in hexadecimal format (e.g., "#RRGGBB").
    * * `using_font` - The SiFont used for text rendering on the image.
    *
    * # Returns
    *
    * A mutable instance of the main image, with the text rendered on it.
    * @param {string} text
    * @param {number} text_scale
    * @param {number} pos_x
    * @param {number} pos_y
    * @param {string | undefined} color
    * @param {SiFont} using_font
    * @param {TextOptions} options
    * @returns {SiImage}
    */
    text(text, text_scale, pos_x, pos_y, color, using_font, options) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(color) ? 0 : passStringToWasm0(color, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        _assertClass(using_font, SiFont);
        _assertClass(options, TextOptions);
        const ret = wasm.siimage_text(ptr, ptr0, len0, text_scale, pos_x, pos_y, ptr1, len1, using_font.__wbg_ptr, options.__wbg_ptr);
        return SiImage.__wrap(ret);
    }
    /**
    * Renders some image into the image
    *
    * # Arguments
    *
    * * `image` - The SiImage to render.
    * * `pos_x` - The X-coordinate position for rendering.
    * * `pos_y` - The Y-coordinate position for rendering.
    *
    * # Returns
    *
    * A mutable instance of the main image, with overlay of the provided one
    * @param {SiImage} image
    * @param {bigint} pos_x
    * @param {bigint} pos_y
    * @returns {SiImage}
    */
    image(image, pos_x, pos_y) {
        const ptr = this.__destroy_into_raw();
        _assertClass(image, SiImage);
        const ret = wasm.siimage_image(ptr, image.__wbg_ptr, pos_x, pos_y);
        return SiImage.__wrap(ret);
    }
    /**
    * Gets the image data as bytes in PNG format.
    *
    * # Returns
    *
    * The image data as bytes in PNG format
    * @returns {Uint8Array}
    */
    to_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.siimage_to_bytes(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Gets the height of the image.
    *
    * # Returns
    *
    * The height of the image
    * @returns {number}
    */
    get height() {
        const ret = wasm.siimage_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Gets the width of the image.
    *
    * # Returns
    *
    * The width of the image
    * @returns {number}
    */
    get width() {
        const ret = wasm.siimage_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Resizes the image
    *
    * # Arguments
    *
    * * `width` - The new width of the image
    * * `height` - The new height of the image
    *
    * # Returns
    *
    * A mutable instance of the main image, with the resized image
    * @param {number} width
    * @param {number} height
    * @returns {SiImage}
    */
    resize(width, height) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.siimage_resize(ptr, width, height);
        return SiImage.__wrap(ret);
    }
}

const TextOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_textoptions_free(ptr >>> 0));
/**
*/
export class TextOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TextOptions.prototype);
        obj.__wbg_ptr = ptr;
        TextOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TextOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_textoptions_free(ptr);
    }
    /**
    * @returns {number}
    */
    get letter_spacing() {
        const ret = wasm.__wbg_get_textoptions_letter_spacing(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set letter_spacing(arg0) {
        wasm.__wbg_set_textoptions_letter_spacing(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get space_width() {
        const ret = wasm.__wbg_get_textoptions_space_width(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set space_width(arg0) {
        wasm.__wbg_set_textoptions_space_width(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {TextOptions}
    */
    static default() {
        const ret = wasm.textoptions_default();
        return TextOptions.__wrap(ret);
    }
}

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbg_siimage_new: function(arg0) {
            const ret = SiImage.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_sifont_new: function(arg0) {
            const ret = SiFont.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_cb_drop: function(arg0) {
            const obj = takeObject(arg0).original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            const ret = false;
            return ret;
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_string_new: function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbg_fetch_27eb4c0a08a9ca04: function(arg0) {
            const ret = fetch(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_queueMicrotask_f61ee94ee663068b: function(arg0) {
            queueMicrotask(getObject(arg0));
        },
        __wbg_queueMicrotask_f82fc5d1e8f816ae: function(arg0) {
            const ret = getObject(arg0).queueMicrotask;
            return addHeapObject(ret);
        },
        __wbindgen_is_function: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'function';
            return ret;
        },
        __wbg_signal_8fbb4942ce477464: function(arg0) {
            const ret = getObject(arg0).signal;
            return addHeapObject(ret);
        },
        __wbg_new_92cc7d259297256c: function() { return handleError(function () {
            const ret = new AbortController();
            return addHeapObject(ret);
        }, arguments) },
        __wbg_abort_510372063dd66b29: function(arg0) {
            getObject(arg0).abort();
        },
        __wbg_new_4db22fd5d40c5665: function() { return handleError(function () {
            const ret = new Headers();
            return addHeapObject(ret);
        }, arguments) },
        __wbg_append_b2e8ed692fc5eb6e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments) },
        __wbg_newwithstrandinit_11fbc38beb4c26b0: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) },
        __wbindgen_string_get: function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len1;
            getInt32Memory0()[arg0 / 4 + 0] = ptr1;
        },
        __wbg_instanceof_Response_b5451a06784a2404: function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof Response;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_url_e319aee56d26ddf1: function(arg0, arg1) {
            const ret = getObject(arg1).url;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len1;
            getInt32Memory0()[arg0 / 4 + 0] = ptr1;
        },
        __wbg_status_bea567d1049f0b6a: function(arg0) {
            const ret = getObject(arg0).status;
            return ret;
        },
        __wbg_headers_96d9457941f08a33: function(arg0) {
            const ret = getObject(arg0).headers;
            return addHeapObject(ret);
        },
        __wbg_arrayBuffer_eb2005809be09726: function() { return handleError(function (arg0) {
            const ret = getObject(arg0).arrayBuffer();
            return addHeapObject(ret);
        }, arguments) },
        __wbg_fetch_10edd7d7da150227: function(arg0, arg1) {
            const ret = getObject(arg0).fetch(getObject(arg1));
            return addHeapObject(ret);
        },
        __wbg_newnoargs_cfecb3965268594c: function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbindgen_is_object: function(arg0) {
            const val = getObject(arg0);
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg_next_586204376d2ed373: function(arg0) {
            const ret = getObject(arg0).next;
            return addHeapObject(ret);
        },
        __wbg_next_b2d3366343a208b3: function() { return handleError(function (arg0) {
            const ret = getObject(arg0).next();
            return addHeapObject(ret);
        }, arguments) },
        __wbg_done_90b14d6f6eacc42f: function(arg0) {
            const ret = getObject(arg0).done;
            return ret;
        },
        __wbg_value_3158be908c80a75e: function(arg0) {
            const ret = getObject(arg0).value;
            return addHeapObject(ret);
        },
        __wbg_iterator_40027cdd598da26b: function() {
            const ret = Symbol.iterator;
            return addHeapObject(ret);
        },
        __wbg_get_3fddfed2c83f434c: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(getObject(arg0), getObject(arg1));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_call_3f093dd26d5569f8: function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_new_632630b5cec17f21: function() {
            const ret = new Object();
            return addHeapObject(ret);
        },
        __wbg_call_67f2111acd2dfdb6: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_has_ad45eb020184f624: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.has(getObject(arg0), getObject(arg1));
            return ret;
        }, arguments) },
        __wbg_set_961700853a212a39: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments) },
        __wbg_buffer_b914fb8b50ebbc3e: function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        },
        __wbg_stringify_865daa6fb8c83d5a: function() { return handleError(function (arg0) {
            const ret = JSON.stringify(getObject(arg0));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_new_70828a4353259d4b: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wbg_adapter_106(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return addHeapObject(ret);
            } finally {
                state0.a = state0.b = 0;
            }
        },
        __wbg_resolve_5da6faf2c96fd1d5: function(arg0) {
            const ret = Promise.resolve(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_then_f9e58f5a50f43eae: function(arg0, arg1) {
            const ret = getObject(arg0).then(getObject(arg1));
            return addHeapObject(ret);
        },
        __wbg_then_20a5920e447d1cb1: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        },
        __wbg_self_05040bd9523805b9: function() { return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments) },
        __wbg_window_adc720039f2cb14f: function() { return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments) },
        __wbg_globalThis_622105db80c1457d: function() { return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments) },
        __wbg_global_f56b013ed9bcf359: function() { return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments) },
        __wbindgen_is_undefined: function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        },
        __wbg_newwithbyteoffsetandlength_0de9ee56e9f6ee6e: function(arg0, arg1, arg2) {
            const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_new_b1f2d6842d615181: function(arg0) {
            const ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_set_7d988c98e6ced92d: function(arg0, arg1, arg2) {
            getObject(arg0).set(getObject(arg1), arg2 >>> 0);
        },
        __wbg_length_21c4b0ae73cba59d: function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        },
        __wbindgen_debug_string: function(arg0, arg1) {
            const ret = debugString(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len1;
            getInt32Memory0()[arg0 / 4 + 0] = ptr1;
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_memory: function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        },
        __wbindgen_closure_wrapper1805: function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 713, __wbg_adapter_24);
            return addHeapObject(ret);
        },
    },

};

const wasm_url = new URL('si_img_bg.wasm', import.meta.url);

















const response = await fetch(wasm_url);
if (!response.ok) {
    throw new Error(`Failed to fetch WebAssembly module: ${response.statusText}`);
}

const { instance } = await WebAssembly.instantiateStreaming(response, imports);
const wasm = instance.exports;
