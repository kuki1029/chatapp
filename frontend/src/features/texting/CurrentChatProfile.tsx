import { Group, Text, Avatar, ActionIcon, Indicator } from '@mantine/core'
import { IconVideoPlus } from '@tabler/icons-react'
import { useColorScheme } from '../../utility/useColorScheme'
import { upperFirst } from '@mantine/hooks'

interface Iprops {
  chatUsers: {
    name: string
    avatar?: string | null | undefined
  }[]
  status: string
}

export const CurrentChatProfile = ({ chatUsers, status }: Iprops) => {
  const colors = useColorScheme()
  const { name, avatar } = chatUsers[0] //TODO: Do a map when adding group chats

  return (
    <Group w={'100%'} justify="space-between">
      <Group style={{ gap: '0.5rem' }}>
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
