import { HttpResponse } from 'fts-core'

import {
  RemoveBgOptions,
  removeBackgroundFromImageUrl
} from './remove-bg'

import { convertResult } from './convert-result'

/**
 * Removes the background from an image using a smart deep learning algorithm.
 *
 * @param url - URL of the image to process.

 * @param json - By default, the resulting binary image is returned directly. If you'd like to debug your calls or view
 * extra metadata, set `json` to `true` to instead return a JSON object describing the operation with the image result stored
 * in the `base64img` property as a base64-encoded string.
 *
 * @param size - Maximum output image resolution:
 *
 * 'preview' / 'small' / 'regular' (default) = Resize image to 0.25 megapixels (e.g. 625×400 pixels)
 *
 * 'full' / '4k' = Use original image resolution, up to 25 megapixels (e.g. 6250x4000) with formats ZIP or JPG, or up to 10 megapixels (e.g. 4000x2500) with PNG),
 *
 * For backwards-compatibility this parameter also accepts the values 'medium' (up to 1.5 megapixels) and 'hd' (up to 4 megapixels).
 *
 * @param type - Helps the API a little by telling the type of image you want to extract the background from.
 *
 * @param format - Result image format: 'auto' = Use PNG format if transparent regions exists, otherwise use JPG format (default),
 * 'png' = PNG format with alpha transparency,
 * 'jpg' = JPG format, no transparency,
 * 'zip' = ZIP format, contains color image and alpha matte image, supports transparency.
 *
 * @param scale - Scales the subject relative to the total image size.
 *
 * Can be any value from '10%' to '100%', or 'original' (default).
 *
 * Scaling the subject implies 'position=center' (unless specified otherwise).
 *
 * @param position - Positions the subject within the image canvas.
 * Can be 'original' (default unless 'scale' is given),
 * 'center' (default when 'scale' is given)
 * or a value from '0%' to '100%' (both horizontal and vertical) or two values (horizontal, vertical).
 *
 * @param roi - Region of interest: Only contents of this rectangular region can be detected as foreground.
 *
 * Everything outside is considered background and will be removed.
 *
 * The rectangle is defined as two x/y coordinates in the format '<x1> <y1> <x2> <y2>'.
 *
 * The coordinates can be in absolute pixels (suffix 'px') or relative to the width/height of the image (suffix '%').
 *
 * By default, the whole image is the region of interest ('0% 0% 100% 100%').
 *
 * @param crop - Whether to crop off all empty regions (default: false).
 *
 * @param crop_margin - Adds a margin around the cropped subject (default: 0).
 *
 * Can be an absolute value (e.g. '30px') or relative to the subject size (e.g. '10%').
 *
 * Can be a single value (all sides), two values (top/bottom and left/right) or four values (top, right, bottom, left).
 *
 * This parameter only has an effect when 'crop=true'.
 *
 * The maximum margin that can be added on each side is 50% of the subject dimensions or 500 pixels.
 *
 * @param bg_color - Adds a solid color background.
 *
 * Can be a hex color code (e.g. 81d4fa, fff) or a color name (e.g. green).
 *
 * For semi-transparency, 4-/8-digit hex codes are also supported (e.g. 81d4fa77).
 *
 * (If this parameter is present, the other bg_ parameters must be empty.)
 *
 * @param bg_image_url - Adds a background image from a URL.
 *
 * The image is centered and resized to fill the canvas while preserving the aspect ratio,
 * unless it already has the exact same dimensions as the foreground image.
 *
 * (If this parameter is present, the other 'bg_' parameters must be empty.)
 */
export async function removeBgUrl(
  url: string,
  json: boolean = false,
  size: 'preview' | 'small' | 'regular' | 'medium' | 'full' | 'hd' | '4k' = 'regular',
  type: 'auto' | 'person' | 'product' | 'car' = 'auto',
  format: 'auto' | 'png' | 'jpg' | 'zip' = 'auto',
  scale: string = 'original',
  position?: string,
  roi?: string,
  crop: boolean = false,
  crop_margin?: string,
  bg_color?: string,
  bg_image_url?: string
): Promise<HttpResponse> {
  const result = await removeBackgroundFromImageUrl({
    url,
    size,
    type,
    format,
    scale,
    position,
    roi,
    crop,
    crop_margin,
    bg_color,
    bg_image_url
  })

  return convertResult(result, json)
}
