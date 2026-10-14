/**
 * 色板编号
 *
 * 主色编号为 500
 */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

/** 色板 */
export type ColorPalette = {
  /** 颜色十六进制值 */
  hex: string
  /**
   * 颜色编号
   *
   * - 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
   */
  number: ColorPaletteNumber
}

/** 色板家族 */
export type ColorPaletteFamily = {
  /** 色板家族名称 */
  name: string
  /** 色板列表 */
  palettes: ColorPalette[]
}

/** 带差值的色板 */
export type ColorPaletteWithDelta = ColorPalette & {
  delta: number
}

/** 带最近色板的色板家族 */
export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  nearestPalette: ColorPaletteWithDelta
  nearestLightnessPalette: ColorPaletteWithDelta
}

/** 色板匹配结果 */
export type ColorPaletteMatch = ColorPaletteFamily & {
  /** 色板的颜色映射 */
  colorMap: Map<ColorPaletteNumber, ColorPalette>
  /**
   * 色板主色
   *
   * 编号为 500
   */
  main: ColorPalette
  /** 色板的匹配颜色 */
  match: ColorPalette
}

/**
 * 色板颜色索引
 *
 * 从左到右颜色由浅到深，6 为主色
 */
export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
