/* tslint:disable */
/* eslint-disable */
/**
* Represents a font used for text rendering.
*/
export class SiFont {
  free(): void;
/**
* Constructor for SiFont, asynchronously loading font data from a URL or using provided bytes.
*
* # Arguments
*
* * `src` - The URL of the font file.
* * `src_bytes` - Optional bytes of the font file.
*
* # Returns
*
* A `SiFont` instance containing the loaded font.
* @param {string} src
* @param {Uint8Array | undefined} src_bytes
*/
  constructor(src: string, src_bytes?: Uint8Array);
}
/**
* Represents an image with text rendering capabilities.
*/
export class SiImage {
  free(): void;
/**
* Constructor for SiImage, asynchronously loading an image from a URL or using provided bytes.
*
* # Arguments
*
* * `image_url` - The URL of the image file.
* * `font` - A `SiFont` instance for text rendering.
* * `image_bytes` - Optional bytes of the image file.
*
* # Returns
*
* A `SiImage` instance containing the loaded image and font.
* @param {string} image_url
* @param {SiFont} font
* @param {Uint8Array | undefined} image_bytes
*/
  constructor(image_url: string, font: SiFont, image_bytes?: Uint8Array);
/**
* Render text onto the image.
*
* # Arguments
*
* * `text` - The text to render.
* * `text_scale` - The scale factor for the text.
* * `pos_x` - The X-coordinate for text placement.
* * `pos_y` - The Y-coordinate for text placement.
* * `color` - Optional text color in hexadecimal format (e.g., "#RRGGBB").
*
* # Returns
*
* A new `SiImage` instance with the rendered text.
* @param {string} text
* @param {number} text_scale
* @param {number} pos_x
* @param {number} pos_y
* @param {string | undefined} color
* @returns {SiImage}
*/
  text(text: string, text_scale: number, pos_x: number, pos_y: number, color?: string): SiImage;
/**
* Get the image data as bytes in PNG format.
*
* # Returns
*
* A `Vec<u8>` containing the image data.
*/
  readonly as_bytes: Uint8Array;
/**
* Set the font for text rendering.
*
* # Arguments
*
* * `font` - A `SiFont` instance for text rendering.
*
* # Returns
*
* A new `SiImage` instance with the updated font.
*/
  font: SiFont;
/**
* Get the height of the image.
*/
  readonly height: number;
/**
* Get the width of the image.
*/
  readonly width: number;
}
