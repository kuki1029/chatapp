import { Center, Button as MantineButton, useMantineTheme, ButtonProps } from '@mantine/core'

// & is intersection
type Iprops = ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string
  }

export const Button: React.FC<Iprops> = ({ text, ...props }) => {
  const theme = useMantineTheme()
  return (
    <Center>
      <MantineButton
        w={'70%'}
        maw={300}
        miw={100}
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
        {...props}
      >
        {text}
      </MantineButton>
    </Center>
  )
}
