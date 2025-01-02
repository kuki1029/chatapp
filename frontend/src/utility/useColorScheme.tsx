import { useComputedColorScheme } from '@mantine/core'

export const useColorScheme = () => {
  const computedColorScheme = useComputedColorScheme()

  const lightMode = computedColorScheme === 'light'

  return {
    bgColor: lightMode ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.8)',
    buttons: lightMode ? 'black' : '#CC5500',
    primary: lightMode ? 'black' : 'white',
    input: lightMode ? '' : '#1f1f1f', //Blank on purpose
    chatBox: lightMode ? 'black' : '#1f1f1f',
    errorGradient: lightMode ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)',
  }
}
