import { Center, Button as MantineButton, useMantineTheme } from '@mantine/core'

interface Iprops {
  text: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button = ({ text, onClick }: Iprops) => {
  const theme = useMantineTheme()

  return (
    <Center>
      <MantineButton
        w={'70%'}
        maw={300}
        fullWidth
        color="primary"
        variant="outline"
        m="4"
        styles={{
          root: {
            borderWidth: '1px',
            borderColor: theme.colors['primary'][1],
          },
        }}
        my={16}
        onClick={onClick}
      >
        {text}
      </MantineButton>
    </Center>
  )
}
