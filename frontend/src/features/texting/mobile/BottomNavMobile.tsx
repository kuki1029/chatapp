import { ActionIcon, Group, Tooltip } from '@mantine/core'
import { IconBrandLine, IconMailPlus, IconUserSearch, IconUserCircle } from '@tabler/icons-react'
import { useColorScheme } from '../../../utility/useColorScheme'

export const BottomNavMobile = () => {
  const colors = useColorScheme()

  return (
    <Group p={'md'} miw={'100%'} justify="space-between">
      {/* TODO: Move this to own component */}
      {/* TODO: Add active icon to action button */}
      <Tooltip openDelay={300} label="Messages" bg={colors.primary}>
        <ActionIcon
          size={'xl'}
          radius="md"
          color={colors.primary}
          variant="subtle"
          // onClick={() => {
          //   setCurrentView(ChatsDisplay.CHATS)
          // }}
        >
          <IconBrandLine size={28} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      <Tooltip openDelay={300} label="New Chat" bg={colors.primary}>
        <ActionIcon
          size={'xl'}
          radius="md"
          color={colors.primary}
          variant="subtle"
          // onClick={() => {
          //   setCurrentView(ChatsDisplay.FRIENDS)
          // }}
        >
          <IconMailPlus size={18} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      <Tooltip openDelay={300} label="Add Friend. Work In Progress." bg={colors.primary}>
        <ActionIcon size={'xl'} radius="md" color={colors.primary} variant="subtle" disabled={true}>
          <IconUserSearch size={18} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      {/* TODO: Replace with pic of user profile */}
      <Tooltip openDelay={300} label="Profile. Work In Progress" bg={colors.primary}>
        <ActionIcon size={'xl'} radius="md" color={colors.primary} variant="subtle" disabled={true}>
          <IconUserCircle size={18} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}
