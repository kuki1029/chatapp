import { Paper, Stack, Title, Group, ActionIcon, useComputedColorScheme } from '@mantine/core'
import { useState } from 'react'
import { IconMailPlus, IconUserSearch, IconUserCircle, IconBrandLine } from '@tabler/icons-react'
import { CreateNewChat } from './CreateNewChat'
import { IndividualChatDisplay } from './IndividualChatDisplay'
import { useColorScheme } from '../../utility/useColorScheme'

const stackStyle = {
  h: '100%',
  gap: '7',
}

enum ChatsDisplay {
  CHATS,
  FRIENDS,
  ADD_FRIEND,
  PROFILE,
}

interface Iprops {
  setChatID: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const Chats = ({ setChatID }: Iprops) => {
  const [currentView, setCurrentView] = useState<ChatsDisplay>(ChatsDisplay.CHATS)
  const colors = useColorScheme()

  return (
    <Paper
      h="90%"
      shadow="xl"
      radius="md"
      miw={'100%'}
      style={{ zIndex: 9999, background: colors.bgColor }}
    >
      <Stack {...stackStyle}>
        {/* TODO: Move this to own component */}
        {/* TODO: Add hover tooltips to action icons */}
        {/* TODO: Add active icon to action button */}
        <Group p={'md'} miw={'100%'} justify="space-between">
          <ActionIcon
            size={'lg'}
            radius="md"
            color={colors.primary}
            variant="subtle"
            onClick={() => {
              setCurrentView(ChatsDisplay.CHATS)
            }}
          >
            <IconBrandLine size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size={'lg'}
            radius="md"
            color={colors.primary}
            variant="subtle"
            onClick={() => {
              setCurrentView(ChatsDisplay.FRIENDS)
            }}
          >
            <IconMailPlus size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size={'lg'} radius="md" color={colors.primary} variant="subtle">
            <IconUserSearch size={18} stroke={1.5} />
          </ActionIcon>
          {/* TODO: Replace with pic of user profile */}
          <ActionIcon size={'lg'} radius="md" color={colors.primary} variant="subtle">
            <IconUserCircle size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
        {currentView === ChatsDisplay.CHATS ? (
          <>
            <Title pl={'3%'} order={2} c={colors.primary}>
              Chats
            </Title>
            <IndividualChatDisplay setChatID={setChatID} />
          </>
        ) : (
          <CreateNewChat />
        )}
      </Stack>
    </Paper>
  )
}
