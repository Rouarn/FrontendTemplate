import { localStg } from '@/utils/storage'
import { overrideThemeSettings, themeSettings } from '@/theme/settings'
import { themeVars } from '@/theme/vars'
import { addColorAlpha, getColorPalette, getPaletteColorByNumber, getRgb } from '@/utils/color'
import { defu } from 'defu'
import type { GlobalThemeOverrides } from 'naive-ui'

/** 初始化主题设置 */
export function initThemeSettings() {
  const isProd = import.meta.env.VITE_USER_NODE_ENV === 'production'

  //如果是开发模式，主题设置将不会被缓存，通过更新‘ src/theme/settings ’中的‘ themessettings ’。这是更新主题设置
  //注意：必须返回默认配置的深拷贝，否则 ref 会直接持有并污染模块单例，
  //导致 resetStore 拿到的仍是被改脏的同一对象，主题色无法还原
  if (!isProd) return JSON.parse(JSON.stringify(themeSettings)) as App.Theme.ThemeSetting

  //如果是生产模式，主题设置将缓存在localStorage中
  //如果想在发布新版本时更新主题设置，请更新src/theme/settings.ts中的overridethemessettings

  const localSettings = localStg.get('themeSettings')

  let settings = defu(localSettings, themeSettings)

  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME

  if (!isOverride) {
    settings = defu(overrideThemeSettings, settings)

    localStg.set('overrideThemeFlag', BUILD_TIME)
  }

  return JSON.parse(JSON.stringify(settings)) as App.Theme.ThemeSetting
}

type NaiveColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active'
type NaiveColorKey = `${App.Theme.ThemeColorKey}Color${NaiveColorScene}`
type NaiveThemeColor = Partial<Record<NaiveColorKey, string>>
interface NaiveColorAction {
  scene: NaiveColorScene
  handler: (color: string) => string
}

/**
 * 获取 Naive 主题色
 *
 * @param colors 主题色集合
 * @param [recommended=false] 是否使用推荐色，默认 `false`
 */
function getNaiveThemeColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorActions: NaiveColorAction[] = [
    { scene: '', handler: (color) => color },
    { scene: 'Suppl', handler: (color) => color },
    { scene: 'Hover', handler: (color) => getPaletteColorByNumber(color, 500, recommended) },
    { scene: 'Pressed', handler: (color) => getPaletteColorByNumber(color, 700, recommended) },
    { scene: 'Active', handler: (color) => addColorAlpha(color, 0.1) },
  ]

  const themeColors: NaiveThemeColor = {}

  const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][]

  colorEntries.forEach((color) => {
    colorActions.forEach((action) => {
      const [colorType, colorValue] = color
      const colorKey: NaiveColorKey = `${colorType}Color${action.scene}`
      themeColors[colorKey] = action.handler(colorValue)
    })
  })

  return themeColors
}

/**
 * 获取 Naive UI 主题配置
 *
 * @param colors 主题色集合
 */
export function getNaiveTheme(colors: App.Theme.ThemeColor, settings: App.Theme.ThemeSetting) {
  const { primary: colorLoading } = colors

  const theme: GlobalThemeOverrides = {
    common: {
      ...getNaiveThemeColors(colors, settings.recommendColor),
      borderRadius: '8px',
      borderRadiusSmall: '4px',
      fontWeight: '400',
      fontWeightStrong: '600',
    },
    LoadingBar: {
      colorLoading,
    },
    Tag: {
      borderRadius: '4px',
    },
    Card: {
      borderRadius: '12px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    Button: {
      borderRadiusMedium: '8px',
      fontWeight: '500',
    },
    Input: {
      borderRadius: '8px',
    },
    Select: {
      borderRadius: '8px',
    },
  }

  return theme
}

/**
 * 创建主题调色板颜色
 *
 * @param colors 主题色集合
 * @param [recommended=false] 是否使用推荐色，默认 `false`
 */
function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor

  colorKeys.forEach((key) => {
    const colorMap = getColorPalette(colors[key], recommended)

    colorPaletteVar[key] = colorMap.get(500)!

    colorMap.forEach((hex, number) => {
      colorPaletteVar[`${key}-${number}`] = hex
    })
  })

  return colorPaletteVar
}

/**
 * 根据主题设置生成主题 Token 的 CSS 变量
 *
 * @param colors 主题色集合
 * @param tokens 主题设置的 tokens
 * @param [recommended=false] 是否使用推荐色，默认 `false`
 */
export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting['tokens'],
  recommended = false,
) {
  const paletteColors = createThemePaletteColors(colors, recommended)

  const { light, dark } = tokens || themeSettings.tokens

  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      ...light.colors,
    },
    boxShadow: {
      ...light.boxShadow,
    },
  }

  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...themeTokens.colors,
      ...dark?.colors,
    },
    boxShadow: {
      ...themeTokens.boxShadow,
      ...dark?.boxShadow,
    },
  }

  return {
    themeTokens,
    darkThemeTokens,
  }
}

/**
 * 根据 tokens 生成 CSS 变量字符串
 *
 * @param tokens 主题基础 tokens
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  const styles: string[] = []

  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '')
  }

  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '')
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      let cssVarsKey = removeVarPrefix(tokenValue)
      let cssValue = tokens[key]?.[tokenKey] ?? ''

      if (key === 'colors') {
        cssVarsKey = removeRgbPrefix(cssVarsKey)
        const { r, g, b } = getRgb(cssValue)
        cssValue = `${r} ${g} ${b}`
      }

      styles.push(`${cssVarsKey}: ${cssValue}`)
    }
  }

  const styleStr = styles.join(';')

  return styleStr
}
/**
 * 将主题变量添加到全局
 *
 * @param tokens 亮色主题 tokens
 */
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVarStr = getCssVarByTokens(tokens)
  const darkCssVarStr = getCssVarByTokens(darkTokens)

  const css = `
    :root {
      ${cssVarStr}
    }
  `

  const darkCss = `
    html.dark {
      ${darkCssVarStr}
    }
  `

  const styleId = 'theme-vars'

  const style = document.querySelector(`#${styleId}`) || document.createElement('style')

  style.id = styleId

  style.textContent = css + darkCss

  document.head.appendChild(style)
}

/**
 * 切换辅助色彩模式
 *
 * @param grayscaleMode 灰度模式
 * @param colourWeakness 色弱模式
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
  const htmlElement = document.documentElement
  htmlElement.style.filter = [
    grayscaleMode ? 'grayscale(100%)' : '',
    colourWeakness ? 'invert(80%)' : '',
  ]
    .filter(Boolean)
    .join(' ')
}
