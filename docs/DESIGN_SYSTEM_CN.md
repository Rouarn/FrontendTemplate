# 设计系统规范

> 基于 `frontend-template` 项目的统一主题系统，适用于 AI 编程工具。
> 技术栈：Vue 3 + Naive UI + UnoCSS (presetWind3)

---

## 1. 颜色系统

### 1.1 语义色

```yaml
primary: '#059669' # 翡翠绿 Emerald 600 — 品牌主色
info: '#3b82f6' # 柔和蓝 Blue 500
success: '#10b981' # 翡翠绿 Emerald 500
warning: '#f59e0b' # 琥珀 Amber 500
error: '#ef4444' # 红 Red 500
```

### 1.2 颜色调色板（每种语义色 11 阶）

每种语义色（primary、info、success、warning、error）生成完整调色板：

```
50, 100, 200, 300, 400, 500（主色）, 600, 700, 800, 900, 950
```

CSS 变量格式：`rgb(var(--{color}-{step}-color))` — 仅 RGB 值，不含 `rgb()` 包裹。

主色调色板示例（翡翠绿系）：

```yaml
primary-50: '#ecfdf5'
primary-100: '#d1fae5'
primary-200: '#a7f3d0'
primary-300: '#6ee7b7'
primary-400: '#34d399'
primary-500: '#10b981' # 默认主色
primary-600: '#059669' # 实际主色（匹配 themeColor）
primary-700: '#047857'
primary-800: '#065f46'
primary-900: '#064e3b'
primary-950: '#022c22'
```

### 1.3 主题令牌（浅色模式）

```yaml
container-bg: 'rgb(255, 255, 255)' # 卡片/面板背景 — 纯白
layout-bg: 'rgb(249, 250, 251)' # 页面/布局背景 — 极浅灰 (#f9fafb)
inverted-bg: 'rgb(15, 23, 42)' # 反色元素（深色背景）
base-text: 'rgb(31, 41, 55)' # 主要文字颜色 (#1f2937)
nprogress: （同 primary）
```

### 1.4 主题令牌（深色模式）

```yaml
container-bg: 'rgb(30, 41, 59)' # 深色容器 (#1e293b)
layout-bg: 'rgb(15, 23, 42)' # 深色页面背景 (#0f172a)
base-text: 'rgb(241, 245, 249)' # 浅色文字 (#f1f5f9)
inverted-bg: （继承浅色模式值）
```

### 1.5 中性灰阶

使用 Tailwind 兼容的灰色系处理文字、边框和背景：

```yaml
slate-50: '#f8fafc'
slate-100: '#f1f5f9'
slate-200: '#e2e8f0'
slate-300: '#cbd5e1'
slate-400: '#94a3b8'
slate-500: '#64748b'
slate-600: '#475569'
slate-700: '#334155'
slate-800: '#1e293b'
slate-900: '#0f172a'
```

占位符文字：`#9ca3af`（gray-400）
默认边框：`#e5e7eb`（gray-200，通过 CSS 变量 `--un-default-border-color`）

### 1.6 CSS 变量

```css
:root {
  --primary-color: 5 150 105;
  --primary-50-color: 236 253 245;
  --primary-100-color: 209 250 229;
  /* ... 200-950 ... */
  --info-color: 59 130 246;
  --success-color: 16 185 129;
  --warning-color: 245 158 11;
  --error-color: 239 68 68;
  --container-bg-color: 255 255 255;
  --layout-bg-color: 249 250 251;
  --inverted-bg-color: 15 23 42;
  --base-text-color: 31 41 55;
  --nprogress-color: 5 150 105;
  --header-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --sider-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --tab-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
```

---

## 2. 字体排版

### 2.1 字体族

```css
font-family:
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  'Noto Sans',
  sans-serif,
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji';
```

### 2.2 字重

```yaml
normal: 400
medium: 500 # 按钮、徽章、强调
strong: 600 # 标题、加粗文字
```

### 2.3 字号（推荐）

```yaml
xs: 12px # 徽章、版本标签
sm: 14px # 描述文字、次要文字
base: 16px # 正文
lg: 18px # 功能标题、CTA 文字
xl: 32px # 章节标题
2xl: 36px # CTA 标题
3xl: 48px # Hero 文字（小屏）
4xl: 64px # Hero 文字（大屏）
```

### 2.4 行高

```yaml
body: 1.5 # 基础行高（html）
relaxed: 1.625 # 段落描述
tight: 1.2 # 标题
```

---

## 3. 间距

使用 UnoCSS 默认间距比例（4px 基础单位）：

```yaml
unit: 4px
# 示例：
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
```

项目中的常用模式：

- 内容内边距：`24px`（`p-24px`）
- 章节垂直内边距：`80px`（`py-80px`）
- 卡片内边距：`24px`
- 网格项间距：`24px`-`32px`
- 最大内容宽度：`1200px`（`max-w-1200px`）
- 头部高度：`64px`（`h-16`）

---

## 4. 圆角

```yaml
sm: 4px # 标签、小型元素
md: 8px # 按钮、输入框、选择器（Naive UI 默认）
lg: 12px # 卡片、大按钮
xl: 16px # 图标容器、技术栈项
2xl: 24px # 数据容器
32px: # Hero 图标容器、CTA 区域
full: 9999px # 圆形元素（头像、装饰性图形）
```

Naive UI 组件覆盖：

```yaml
Tag.borderRadius: 4px
Card.borderRadius: 12px
Button.borderRadiusMedium: 8px
Input.borderRadius: 8px
Select.borderRadius: 8px
```

---

## 5. 阴影

```yaml
low: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
high: '0 2px 8px 0 rgba(0, 0, 0, 0.08)'

# 布局专用（默认与 low 相同）：
header: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
sider: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
tab: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
```

卡片阴影模式：

```css
/* 默认状态 */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* 悬停状态 */
box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
```

---

## 6. 过渡与动画

```yaml
duration:
  normal: 300ms # 页面过渡、卡片悬停
  fast: 200ms # 颜色变化、小型交互

timing-function: 'cubic-bezier(0, 0, 0.2, 1)' # ease-out
```

页面过渡类名：

- `fade` — 透明度 0.3s
- `fade-slide` — 透明度 + translateX(±30px) 0.3s
- `fade-bottom` — 透明度 + translateY(±10%) 0.3s
- `fade-scale` — 透明度 + scale(1.2→1) 0.28s
- `zoom-fade` — 透明度 + scale(0.92→1) 0.2s+0.3s
- `zoom-out` — 透明度 + scale(0→1) 0.15s

交互反馈：

- 按钮：`active:scale-95`（按下效果）
- 卡片：`hover:-translate-y-4px`（悬停上浮）
- CTA 按钮：`active:scale-95` + 阴影过渡

---

## 7. 布局模式

### 7.1 页面结构

```
┌─────────────────────────────────────┐
│  GlobalHeader（sticky, z-50）       │  ← shadow-header, bg-container
│  ┌─────┬──────────┬──────────┐     │
│  │Logo │ NMenu    │ Actions  │     │  ← h-64px, max-w-1200px 居中
│  └─────┴──────────┴──────────┘     │
├─────────────────────────────────────┤
│  GlobalContent                      │  ← bg-layout, min-h-screen
│  ┌─────────────────────────────┐   │
│  │  max-w-1200px 居中           │   │  ← px-24px 内边距
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  GlobalFooter                       │
└─────────────────────────────────────┘
```

### 7.2 头部

```yaml
高度: 64px
定位: sticky, top-0, z-50
背景: container 颜色
阴影: header 阴影
最大宽度: 1200px 居中
```

### 7.3 内容区域

```yaml
最大宽度: 1200px
左右内边距: 24px
外边距: 0 auto
背景: layout 颜色
最小高度: 100vh
```

### 7.4 移动端

- 头部折叠为汉堡菜单
- NDrawer（宽度 80%，左侧弹出）用于移动端导航
- 网格：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`（响应式）

---

## 8. 组件模式

### 8.1 卡片

```html
<!-- UnoCSS 快捷类: card-wrapper -->
<div class="rd-8px shadow-low transition-shadow duration-300 ease-out hover:shadow-high">
  <NCard :bordered="false" />
</div>

<!-- Naive UI 覆盖: Card borderRadius 12px, shadow low -->
```

### 8.2 主按钮

```html
<!-- UnoCSS 快捷类: btn-primary -->
<NButton
  type="primary"
  class="h-48px rd-12px px-32px font-bold shadow-low transition-all duration-300 hover:shadow-high active:scale-95"
></NButton>
```

### 8.3 功能卡片模式

```html
<div class="text-center p-8px">
  <div class="p-16px rd-20px transition-colors duration-300" style="background-color: {color}15">
    <SvgIcon :icon="icon" class="size-32px" :style="{ color }" />
  </div>
  <h3 class="text-18px font-bold text-base-text">{{ title }}</h3>
  <p class="mt-12px text-14px text-slate-500 leading-relaxed">{{ description }}</p>
</div>
```

### 8.4 章节标题模式

```html
<div class="text-center mb-64px">
  <h2 class="text-32px font-bold text-base-text">{{ title }}</h2>
  <div class="mt-8px h-4px w-48px bg-primary rd-full mx-auto" />
  <!-- 强调线 -->
  <p class="mt-16px text-16px text-slate-500">{{ subtitle }}</p>
</div>
```

### 8.5 Hero 渐变装饰

```html
<div class="absolute -top-240px -right-240px size-480px rd-full bg-primary/5 blur-3xl" />
<div class="absolute -bottom-240px -left-240px size-480px rd-full bg-blue-500/5 blur-3xl" />
```

### 8.6 数据/高亮框

```html
<div class="text-center p-32px rd-24px bg-primary/5 border border-primary/10 transition-all duration-300 hover:bg-primary/10">
  <div class="text-48px font-bold text-primary tabular-nums">{{ value }}</div>
  <div class="mt-8px text-16px font-medium text-slate-500">{{ label }}</div>
</div>
```

### 8.7 CTA 区域

```html
<div class="bg-primary rd-32px p-64px shadow-high relative overflow-hidden group">
  <!-- 装饰性图形 -->
  <div class="absolute top-0 right-0 size-300px bg-white/10 rd-full blur-3xl transition-transform duration-700 group-hover:scale-125" />
  <!-- 内容 -->
  <h2 class="text-36px font-bold text-white relative z-10">...</h2>
</div>
```

---

## 9. UnoCSS 快捷类

```yaml
# 卡片样式
card-wrapper: 'rd-8px shadow-low transition-shadow duration-300 ease-out hover:shadow-high'
card: 'h-82vh flex flex-col items-center bg-container p-24px rd-12px shadow-low'

# 按钮样式
btn-primary: 'bg-primary text-white rd-8px px-16px py-8px transition-colors duration-200 ease-out hover:bg-primary-600'

# Flex 工具类
flex-center: 'flex justify-center items-center'
flex-x-center: 'flex justify-center'
flex-y-center: 'flex items-center'
flex-col: 'flex flex-col'
flex-col-center: 'flex-center flex-col'
flex-1-hidden: 'flex-1 overflow-hidden'

# 文本工具类
ellipsis-text: 'overflow-hidden whitespace-nowrap text-ellipsis'

# 定位工具类
absolute-center: 'absolute left-0 top-0 flex-center size-full'
fixed-center: 'fixed left-0 top-0 flex-center size-full'
```

---

## 10. 深色模式

- **切换机制**：基于 class（`html.dark`）
- **检测方式**：`usePreferredColorScheme()`（@vueuse/core）
- **主题方案**：`light` | `dark` | `auto`
- **CSS 注入**：主题令牌以 CSS 变量形式注入 `:root` 和 `html.dark`
- **容器**：DarkModeContainer 组件包裹内容区域

深色模式颜色变化：

```yaml
container: 白色 → #1e293b
layout: #f9fafb → #0f172a
base-text: #1f2937 → #f1f5f9
```

---

## 11. 图标系统

- **图标库**：Iconify，通过 `@iconify/vue` 和 `unplugin-icons` 集成
- **图标集**：`@iconify/json`（完整集合）
- **SVG 图标**：自定义 SVG 雪碧图，通过 `vite-plugin-svg-icons` 生成
- **用法**：`<SvgIcon icon="ph:rocket-launch-duotone" />`（Iconify 格式）
- **双色风格**：功能图标优先使用（`:duotone` 后缀）
- **首页图标**：`ph:speedometer-duotone`、`ph:palette-duotone`、`ph:code-duotone`、`ph:devices-duotone`

---

## 12. 滚动条

- 宽度：7px
- 颜色：`rgba(0, 0, 0, 0.5)`
- 样式：thin
- 轨道：透明
- 圆角：与滑块尺寸一致

---

## 13. 无障碍功能

- **灰度模式**: `filter: grayscale(100%)`
- **色弱模式**: `filter: invert(80%)`
- **深色模式**: 通过 `html.dark` 类切换
- **水印**: 可配置覆盖层（文字 / 用户名 / 时间戳）

---

## 14. AI 编码规范

为本项目生成 UI 代码时，请遵循以下规则：

1. **使用 UnoCSS 工具类**（兼容 Tailwind 语法）
2. **使用 Naive UI 组件**（`NButton`、`NCard`、`NInput` 等）
3. **引用主题令牌**: 使用 `text-primary`、`bg-primary`、`text-base-text`、`bg-container`、`bg-layout`
4. **圆角**: 使用 `rd-4px`（sm）、`rd-8px`（md）、`rd-12px`（lg）、`rd-16px`（xl）
5. **阴影**: 卡片使用 `shadow-low`，悬停/弹窗使用 `shadow-high`
6. **过渡**: 默认 `duration-300 ease-out`
7. **深色模式**: 使用 `dark:` 变体前缀（如 `dark:bg-container`）
8. **Flex 布局**: 优先使用快捷类 `flex-center`、`flex-col-center`
9. **颜色**: 悬停/激活状态使用调色板变体（如 `hover:bg-primary-600`）
10. **间距**: 优先使用 4 的倍数（4、8、12、16、24、32）
