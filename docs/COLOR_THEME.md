# 颜色主题规范

> 纯 CSS 变量驱动的颜色系统，适用于任何项目。
> 不依赖任何组件库，可直接用于原生 HTML/CSS 或任意框架。

---

## 语义色

```yaml
primary: '#059669' # 翡翠绿 Emerald 600 — 品牌主色
info: '#3b82f6' # 柔和蓝 Blue 500
success: '#10b981' # 翡翠绿 Emerald 500
warning: '#f59e0b' # 琥珀 Amber 500
error: '#ef4444' # 红 Red 500
```

### 调色板（每色 11 阶：50 → 950）

CSS 变量格式：`rgb(var(--{color}-{step}-color))`

```yaml
primary-50: '#ecfdf5'
primary-100: '#d1fae5'
primary-200: '#a7f3d0'
primary-300: '#6ee7b7'
primary-400: '#34d399'
primary-500: '#10b981' # 默认主色
primary-600: '#059669' # 实际品牌色
primary-700: '#047857'
primary-800: '#065f46'
primary-900: '#064e3b'
primary-950: '#022c22'

info-50: '#eff6ff'
info-500: '#3b82f6'
info-600: '#2563eb'

success-50: '#f0fdf4'
success-500: '#10b981'
success-600: '#059669'

warning-50: '#fffbeb'
warning-500: '#f59e0b'
warning-600: '#d97706'

error-50: '#fef2f2'
error-500: '#ef4444'
error-600: '#dc2626'
```

---

## 背景色（亮/暗模式）

### 浅色模式

```yaml
container: 'rgb(255, 255, 255)' # 卡片/面板 — 纯白
layout: 'rgb(249, 250, 251)' # 页面背景 — 极浅灰 #f9fafb
inverted: 'rgb(15, 23, 42)' # 深色元素 — #0f172a
base-text: 'rgb(31, 41, 55)' # 主文字 — #1f2937
```

### 深色模式

```yaml
container: 'rgb(30, 41, 59)' # 深色容器 — #1e293b
layout: 'rgb(15, 23, 42)' # 深色背景 — #0f172a
inverted: 'rgb(255, 255, 255)' # 白色反色
base-text: 'rgb(241, 245, 249)' # 浅色文字 — #f1f5f9
```

---

## CSS 变量

```css
:root {
  /* 语义色 */
  --primary-color: 5 150 105;
  --info-color: 59 130 246;
  --success-color: 16 185 129;
  --warning-color: 245 158 11;
  --error-color: 239 68 68;

  /* 背景色 */
  --container-bg-color: 255 255 255;
  --layout-bg-color: 249 250 251;
  --inverted-bg-color: 15 23 42;
  --base-text-color: 31 41 55;
}

/* 深色模式 */
html.dark {
  --container-bg-color: 30 41 59;
  --layout-bg-color: 15 23 42;
  --inverted-bg-color: 255 255 255;
  --base-text-color: 241 245 249;
}
```

---

## 中性灰阶（Slate 系列）

```yaml
slate-50: '#f8fafc'
slate-100: '#f1f5f9'
slate-200: '#e2e8f0' # 默认边框
slate-300: '#cbd5e1'
slate-400: '#94a3b8' # 占位符文字
slate-500: '#64748b' # 次要文字
slate-600: '#475569'
slate-700: '#334155'
slate-800: '#1e293b'
slate-900: '#0f172a'
```

---

## 阴影

```yaml
low: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
high: '0 2px 8px 0 rgba(0, 0, 0, 0.08)'
```

---

## 圆角

```yaml
sm: 4px # 标签
md: 8px # 按钮、输入框
lg: 12px # 卡片
xl: 16px # 图标容器
full: 9999px # 圆形（头像）
```

---

## 过渡

```yaml
duration-normal: 300ms
duration-fast: 200ms
timing-function: 'cubic-bezier(0, 0, 0.2, 1)'
```

---

## 使用规则

1. **主色引用**：`color: var(--primary-color)`
2. **功能色引用**：`color: var(--info-color)` 等
3. **文字色**：主要用 `var(--base-text-color)`，次要用 `slate-500`
4. **背景色**：卡片用 `var(--container-bg-color)`，页面用 `var(--layout-bg-color)`
5. **深色模式**：通过 `html.dark` 类切换
6. **调色板变体**：悬停/激活用 `-600` 或 `-700` 阶色值
