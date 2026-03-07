import { themeVars } from './src/theme/vars'
import type { PresetUnoTheme, UserConfig } from 'unocss'
import { defineConfig, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

const config = defineConfig<PresetUnoTheme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  theme: {
    ...themeVars,
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    boxShadow: {
      ...themeVars.boxShadow,
      low: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      high: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
    },
    animation: {
      durations: {
        normal: '300ms',
        fast: '200ms',
      },
      timingFns: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-low transition-shadow duration-300 ease-out hover:shadow-high',
    card: 'h-82vh flex flex-col items-center bg-container p-24px rd-12px shadow-low',
    'btn-primary': 'bg-primary text-white rd-8px px-16px py-8px transition-colors duration-200 ease-out hover:bg-primary-600',
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetWind3({ dark: 'class' }),
    {
      name: 'custom-preset',
      shortcuts: [
        {
          'flex-center': 'flex justify-center items-center',
          'flex-x-center': 'flex justify-center',
          'flex-y-center': 'flex items-center',
          'flex-col': 'flex flex-col',
          'flex-col-center': 'flex-center flex-col',
          'flex-col-stretch': 'flex-col items-stretch',
          'i-flex-center': 'inline-flex justify-center items-center',
          'i-flex-x-center': 'inline-flex justify-center',
          'i-flex-y-center': 'inline-flex items-center',
          'i-flex-col': 'flex-col inline-flex',
          'i-flex-col-center': 'flex-col i-flex-center',
          'i-flex-col-stretch': 'i-flex-col items-stretch',
          'flex-1-hidden': 'flex-1 overflow-hidden',
        },
        {
          'absolute-lt': 'absolute left-0 top-0',
          'absolute-lb': 'absolute left-0 bottom-0',
          'absolute-rt': 'absolute right-0 top-0',
          'absolute-rb': 'absolute right-0 bottom-0',
          'absolute-tl': 'absolute-lt',
          'absolute-tr': 'absolute-rt',
          'absolute-bl': 'absolute-lb',
          'absolute-br': 'absolute-rb',
          'absolute-center': 'absolute-lt flex-center size-full',
          'fixed-lt': 'fixed left-0 top-0',
          'fixed-lb': 'fixed left-0 bottom-0',
          'fixed-rt': 'fixed right-0 top-0',
          'fixed-rb': 'fixed right-0 bottom-0',
          'fixed-tl': 'fixed-lt',
          'fixed-tr': 'fixed-rt',
          'fixed-bl': 'fixed-lb',
          'fixed-br': 'fixed-rb',
          'fixed-center': 'fixed-lt flex-center size-full',
        },
        {
          'nowrap-hidden': 'overflow-hidden whitespace-nowrap',
          'ellipsis-text': 'nowrap-hidden text-ellipsis',
        },
      ],
    },
  ],
}) satisfies UserConfig<PresetUnoTheme>

export default config
