/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './content/**/*.md'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400'
            },
            'a code': {
              color: theme('colors.blue.600')
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                color: theme('colors.gray.100')
              }
            }
          }
        },
        invert: {
          css: {
            code: {
              backgroundColor: theme('colors.gray.800')
            },
            'a code': {
              color: theme('colors.blue.400')
            }
          }
        }
      })
    }
  },
  plugins: []
}
