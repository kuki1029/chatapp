import { Group, Text, Avatar, useMantineTheme, ActionIcon, Indicator } from '@mantine/core'
import { IconVideoPlus } from '@tabler/icons-react'

export const CurrentChatProfile = () => {
  const theme = useMantineTheme()

  return (
    <Group w={'100%'} justify="space-between">
      <Group style={{ gap: '0.5rem' }}>
        <Indicator color="green" size={7}>
          <Avatar color="blue" radius="sm">
            KV
          </Avatar>
        </Indicator>
        <div style={{ flex: 1, margin: '-2' }}>
          <Text size="sm" fw={500}>
            Kunal Varkekar
          </Text>

          <Text c="dimmed" size="xs">
            Typing...
          </Text>
        </div>
      </Group>

      <ActionIcon size={32} radius="md" color={theme.colors['primary'][1]} variant="filled">
        <IconVideoPlus size={18} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}
