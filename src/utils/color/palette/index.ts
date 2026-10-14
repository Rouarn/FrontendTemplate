import { getHex } from '../shared'
import type { ColorPaletteNumber } from '../types'
import { getAntDColorPalette } from './antd'
import { getRecommendedColorPalette } from './recommend'
import type { AnyColor } from 'colord'

/**
 * 根据提供的颜色获取色板
 *
 * @param color 颜色
 * @param recommended 是否获取推荐色板（提供的颜色可能不是主色）
 */
export function getColorPalette(color: AnyColor, recommended = false) {
  const colorMap = new Map<ColorPaletteNumber, string>()

  if (recommended) {
    const colorPalette = getRecommendedColorPalette(getHex(color))
    colorPalette.palettes.forEach((palette) => {
      colorMap.set(palette.number, palette.hex)
    })
  } else {
    const colors = getAntDColorPalette(color)

    const colorNumbers: ColorPaletteNumber[] = [
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ]

    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index])
    })
  }

  return colorMap
}

/**
 * 按编号获取色板颜色
 *
 * @param color 提供的颜色
 * @param number 色板编号
 * @param recommended 是否获取推荐色板（提供的颜色可能不是主色）
 */
export function getPaletteColorByNumber(
  color: AnyColor,
  number: ColorPaletteNumber,
  recommended = false,
) {
  const colorMap = getColorPalette(color, recommended)

  return colorMap.get(number as ColorPaletteNumber)!
}
