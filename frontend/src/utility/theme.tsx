import { createTheme, virtualColor } from '@mantine/core'

// Mantin forces 10 shades so we force it to the colors we want
export const theme = createTheme({
  colors: {
    white: [
      '#ffffff',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
    ],
    primary: virtualColor({
      name: 'primary',
      dark: 'dark-0',
      light: 'white',
    }),
  },
  headings: { fontFamily: 'sans-serif' },
})
