import { LoadingOverlay } from '@mantine/core'

interface Iprops {
  visible: boolean | undefined
}

export const Loading = ({ visible }: Iprops) => {
  return (
    <div>
      <LoadingOverlay visible={visible} zIndex={1000} />
    </div>
  )
}
