/** 默认主题设置 */
export const themeSettings: App.Theme.ThemeSetting = {
  themeScheme: 'light',
  grayscale: false,
  colourWeakness: false,
  themeColor: '#059669', // 清新翡翠绿
  recommendColor: false,
  otherColor: {
    info: '#3b82f6', // 柔和蓝
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  isInfoFollowPrimary: false,
  watermark: {
    visible: false,
    text: '清新优雅',
    enableUserName: false,
    enableTime: false,
    timeFormat: 'YYYY-MM-DD HH:mm',
  },
  tokens: {
    light: {
      colors: {
        container: 'rgb(255, 255, 255)',
        layout: 'rgb(249, 250, 251)', // 略微更亮的灰色
        inverted: 'rgb(15, 23, 42)',
        'base-text': 'rgb(31, 41, 55)',
      },
      boxShadow: {
        header: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sider: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        tab: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
    dark: {
      colors: {
        container: 'rgb(30, 41, 59)',
        layout: 'rgb(15, 23, 42)',
        'base-text': 'rgb(241, 245, 249)',
      },
    },
  },
}

/**
 * 覆盖主题设置
 *
 * 发布新版本时，可使用 `overrideThemeSettings` 覆盖部分主题设置
 */
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {}
