import { Group, Text, Avatar, ActionIcon, Indicator } from '@mantine/core'
import { IconVideoPlus } from '@tabler/icons-react'
import { useColorScheme } from '../../utility/useColorScheme'

export const CurrentChatProfile = () => {
  const colors = useColorScheme()

  return (
    <Group w={'100%'} justify="space-between">
      <Group style={{ gap: '0.5rem' }}>
        <Indicator color="green" size={8}>
          <Avatar color={colors.buttons} radius="sm" variant="light">
            KV
          </Avatar>
        </Indicator>
        <div style={{ flex: 1, margin: '-2' }}>
          <Text size="sm" fw={500} c={colors.primary}>
            Kunal Varkekar
          </Text>

          <Text c="dimmed" size="xs">
            Last Seen: Now
          </Text>
        </div>
      </Group>

      <ActionIcon size={28} radius="md" color={colors.buttons} variant="filled">
        <IconVideoPlus size={18} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}
