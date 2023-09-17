/* tslint:disable */
/* eslint-disable */
/**
* Represents a font used for text rendering.
*/
export class SiFont {
  free(): void;
/**
* Creates a new SiFont from a vector of font data.
* @param {Uint8Array} vec
*/
  constructor(vec: Uint8Array);
/**
* Creates a new SiFont from a vector of font data.
* @param {Uint8Array} vec
* @returns {SiFont}
*/
  static from_vec(vec: Uint8Array): SiFont;
/**
* Creates a new SiFont from font data fetched from a network URL asynchronously.
*
* # Arguments
*
* * `url` - The URL from which to fetch the font data.
* @param {string} url
* @returns {Promise<SiFont>}
*/
  static from_network_async(url: string): Promise<SiFont>;
/**
* Placeholder method for when blocking feature is not enabled.
* @param {string} url
*/
  static from_network(url: string): void;
}
/**
* Represents an image with text rendering capabilities.
*/
export class SiImage {
  free(): void;
/**
* Creates a new SiImage from a vector of image data and a SiFont.
*
* # Arguments
*
* * `src` - The vector of image data.
* * `font` - The SiFont used for text rendering on the image.
* @param {Uint8Array} src
* @param {SiFont} font
*/
  constructor(src: Uint8Array, font: SiFont);
/**
* Creates a new SiImage from a vector of image data.
* @param {Uint8Array} vec
* @param {SiFont} font
* @returns {SiImage}
*/
  static from_vec(vec: Uint8Array, font: SiFont): SiImage;
/**
* Creates a new SiImage from image data fetched from a network URL asynchronously.
*
* # Arguments
*
* * `image_url` - The URL from which to fetch the image data.
* * `font` - The SiFont used for text rendering on the image.
* @param {string} image_url
* @param {SiFont} font
* @returns {Promise<SiImage>}
*/
  static from_network_async(image_url: string, font: SiFont): Promise<SiImage>;
/**
* Placeholder method for when blocking feature is not enabled.
* @param {string} image_url
* @param {SiFont} font
*/
  static from_network(image_url: string, font: SiFont): void;
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
* @param {string} text
* @param {number} text_scale
* @param {number} pos_x
* @param {number} pos_y
* @param {string | undefined} color
* @returns {SiImage}
*/
  text(text: string, text_scale: number, pos_x: number, pos_y: number, color?: string): SiImage;
/**
* Gets the image data as bytes in PNG format.
* @returns {Uint8Array}
*/
  to_bytes(): Uint8Array;
/**
* Sets the font for text rendering on the image.
*
* # Arguments
*
* * `font` - The SiFont to set as the font.
*/
  font: SiFont;
/**
* Gets the height of the image.
*/
  readonly height: number;
/**
* Gets the width of the image.
*/
  readonly width: number;
}
