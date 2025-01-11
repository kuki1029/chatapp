import { Paper, Stack, Title, Group, ActionIcon, Tooltip } from '@mantine/core'
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
      style={{ zIndex: 100, background: colors.bgColor }}
    >
      <Stack {...stackStyle}>
        {/* TODO: Move this to own component */}
        {/* TODO: Add active icon to action button */}
        <Group p={'md'} miw={'100%'} justify="space-between">
          <Tooltip openDelay={300} label="Messages" bg={colors.primary}>
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
          </Tooltip>
          <Tooltip openDelay={300} label="New Chat" bg={colors.primary}>
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
          </Tooltip>
          <Tooltip openDelay={300} label="Add Friend. Work In Progress." bg={colors.primary}>
            <ActionIcon
              size={'lg'}
              radius="md"
              color={colors.primary}
              variant="subtle"
              disabled={true}
            >
              <IconUserSearch size={18} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          {/* TODO: Replace with pic of user profile */}
          <Tooltip openDelay={300} label="Profile. Work In Progress" bg={colors.primary}>
            <ActionIcon
              size={'lg'}
              radius="md"
              color={colors.primary}
              variant="subtle"
              disabled={true}
            >
              <IconUserCircle size={18} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
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
