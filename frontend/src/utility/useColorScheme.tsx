import { useComputedColorScheme } from '@mantine/core'

export const useColorScheme = () => {
  const computedColorScheme = useComputedColorScheme()

  return {
    bgColor: computedColorScheme === 'light' ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.8)',
    buttons: computedColorScheme === 'light' ? 'black' : '#CC5500',
  }
}
