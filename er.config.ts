import { defineConfig } from 'elegant-router'

export default defineConfig({
  /** 根路由重定向 */
  rootRedirect: '/home',
  /** 404 路由组件（对应 views/(builtin)/404） */
  notFoundRouteComponent: '404',
  /** 生成内置路由（Root/NotFound）的定义数据，纳入 routes.ts 白盒管理 */
  generateBuiltinRoutes: true,
  /** 生成的路由类型声明文件路径 */
  dts: 'src/typings/elegant-router.d.ts',
  /** vue-router 类型声明文件路径 */
  vueRouterDts: 'src/typings/typed-router.d.ts',
  /** (builtin) 分组下的页面与 NotFound 不使用 base 布局（login/iframe/错误页等均无布局） */
  getRouteLayout: (node) => (node.filePath.includes('(builtin)') || node.name === 'NotFound' ? 'blank' : 'base'),
  /** 仅生成基础 meta，其余 meta 在生成文件上手改（重新生成只补缺失属性，不覆盖） */
  getRouteMeta: (node) => ({ title: node.name }),
})
