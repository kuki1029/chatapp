import { TextInput, ActionIcon, useMantineTheme } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { SendMessageButton } from './SendMessageButton'
import { useColorScheme } from '../../utility/useColorScheme'

interface Iprops {
  chatID: string
}

export const MessageInput = ({ chatID }: Iprops) => {
  const [msg, setMsg] = useState<string>('')
  const theme = useMantineTheme()
  const color = useColorScheme()

  return (
    <TextInput
      radius="md"
      size="md"
      w={'100%'}
      onChange={(e) => {
        setMsg(e.target.value)
      }}
      value={msg}
      placeholder="Write a message..."
      rightSectionWidth={42}
      leftSection={
        <ActionIcon size={28} radius="md" color={color.buttons} variant="filled">
          <IconPlus size={18} stroke={1.5} />
        </ActionIcon>
      }
      rightSection={<SendMessageButton msg={msg} setMsg={setMsg} chatID={chatID} />}
    />
  )
}
