/**
 * v-watermark
 * 为元素添加水印背景
 * 使用：v-watermark="'版权所有'" 或 v-watermark="{ text: '机密', textColor: 'rgba(0,0,0,0.1)', fontSize: 16, rotate: -20, opacity: 0.5 }"
 */

import type { Directive, DirectiveBinding } from 'vue'

interface WatermarkOptions {
  text: string
  font?: string
  fontSize?: number
  color?: string
  textColor?: string
  rotate?: number
  opacity?: number
}

interface ElType extends HTMLElement {
  __watermarkCanvas__?: HTMLCanvasElement
}

const addWaterMarker = (el: ElType, options: WatermarkOptions): void => {
  const { text, font = 'sans-serif', fontSize = 16, color = 'rgba(180, 180, 180, 0.3)', textColor, rotate = -20, opacity = 1 } = options

  const finalColor = textColor || color
  const finalFont = `${fontSize}px ${font}`

  // 清理旧的 canvas
  if (el.__watermarkCanvas__) {
    el.__watermarkCanvas__.remove()
    el.__watermarkCanvas__ = undefined
  }

  const canvas = document.createElement('canvas')
  el.__watermarkCanvas__ = canvas
  canvas.width = 300
  canvas.height = 200
  canvas.style.display = 'none'

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = opacity
  ctx.font = finalFont
  ctx.fillStyle = finalColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 将坐标系移到中心并旋转
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotate * Math.PI) / 180)
  ctx.fillText(text, 0, 0)

  const dataURL = canvas.toDataURL('image/png')
  el.style.backgroundImage = `url(${dataURL})`
  el.style.backgroundRepeat = 'repeat'
}

const waterMarker: Directive<ElType, string | WatermarkOptions> = {
  mounted(el, binding: DirectiveBinding<string | WatermarkOptions>) {
    const options = typeof binding.value === 'string' ? { text: binding.value } : binding.value
    addWaterMarker(el, options)
  },
  updated(el, binding: DirectiveBinding<string | WatermarkOptions>) {
    const options = typeof binding.value === 'string' ? { text: binding.value } : binding.value
    addWaterMarker(el, options)
  },
  unmounted(el) {
    if (el.__watermarkCanvas__) {
      el.__watermarkCanvas__.remove()
      el.__watermarkCanvas__ = undefined
    }
    el.style.backgroundImage = ''
  },
}

export default waterMarker
