import { Group, Text, Avatar, ActionIcon, Indicator, em } from '@mantine/core'
import { IconVideoPlus, IconArrowLeft } from '@tabler/icons-react'
import { useColorScheme } from '../../utility/useColorScheme'
import { upperFirst, useMediaQuery } from '@mantine/hooks'

interface Iprops {
  chatUsers: {
    name: string
    avatar?: string | null | undefined
  }[]
  status: string
  setChat?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const CurrentChatProfile = ({ chatUsers, status, setChat }: Iprops) => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const colors = useColorScheme()
  const { name, avatar } = chatUsers[0] //TODO: Do a map when adding group chats

  return (
    <Group w={'100%'} justify="space-between">
      <Group style={{ gap: '0.5rem' }}>
        {isMobile && (
          <ActionIcon
            size={24}
            radius="md"
            onClick={() => {
              console.log('ww')

              if (setChat) {
                setChat(undefined)
              }
            }}
            color={colors.buttons}
            variant="transparent"
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
        )}
        <Indicator color="green" size={8}>
          <Avatar color={colors.buttons} radius="sm" variant="light">
            {avatar ? avatar : upperFirst(name[0])}
          </Avatar>
        </Indicator>
        <div style={{ flex: 1, margin: '-2' }}>
          <Text size="sm" fw={500} c={colors.primary}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            Last Seen: {status}
          </Text>
        </div>
      </Group>

      <ActionIcon size={32} radius="md" color={colors.buttons} variant="filled">
        <IconVideoPlus size={18} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}
