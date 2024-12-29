import { Group, Text, Avatar, useMantineTheme, ActionIcon, Indicator } from '@mantine/core'
import { IconVideoPlus } from '@tabler/icons-react'
import { useColorScheme } from '../../utility/useColorScheme'

export const CurrentChatProfile = () => {
  const theme = useMantineTheme()
  const colors = useColorScheme()

  return (
    <Group w={'100%'} justify="space-between">
      <Group style={{ gap: '0.5rem' }}>
        <Indicator color="green" size={7}>
          <Avatar color={colors.buttons} radius="sm">
            KV
          </Avatar>
        </Indicator>
        <div style={{ flex: 1, margin: '-2' }}>
          <Text size="sm" fw={500}>
            Kunal Varkekar
          </Text>

          <Text c="dimmed" size="xs">
            Last Seen: Now
          </Text>
        </div>
      </Group>

      <ActionIcon size={32} radius="md" color={colors.buttons} variant="filled">
        <IconVideoPlus size={18} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}
