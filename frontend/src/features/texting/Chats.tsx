import {
  Paper,
  ScrollArea,
  Stack,
  NavLink,
  useMantineTheme,
  Title,
  LoadingOverlay,
  Group,
  ActionIcon,
} from '@mantine/core'
import {
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
} from '../../__generated__/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { IconMailPlus, IconUserSearch, IconUserCircle, IconBrandLine } from '@tabler/icons-react'
import { CreateNewChat } from './CreateNewChat'

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
  const [active, setActive] = useState(-1)
  const theme = useMantineTheme()
  const { data } = useQuery<UserChatsQuery, UserChatsQueryVariables>(UserChatsDocument, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })

  return (
    <Paper h="90%" shadow="xl" radius="md" miw={'100%'}>
      <Stack {...stackStyle}>
        {/* TODO: Move this to own component */}
        {/* TODO: Add hover tooltips to action icons */}

        <Group p={'xs'} miw={'100%'}>
          <ActionIcon
            size={'lg'}
            radius="md"
            color={theme.colors['primary'][1]}
            variant="filled"
            onClick={() => {
              setCurrentView(ChatsDisplay.CHATS)
            }}
          >
            <IconBrandLine size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size={'lg'}
            radius="md"
            color={theme.colors['primary'][1]}
            variant="filled"
            onClick={() => {
              setCurrentView(ChatsDisplay.FRIENDS)
            }}
          >
            <IconMailPlus size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size={'lg'} radius="md" color={theme.colors['primary'][1]} variant="filled">
            <IconUserSearch size={18} stroke={1.5} />
          </ActionIcon>
          {/* TODO: Replace with pic of user profile */}
          <ActionIcon size={'lg'} radius="md" color={theme.colors['primary'][1]} variant="filled">
            <IconUserCircle size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
        {currentView === ChatsDisplay.CHATS ? (
          <>
            <Title pl={'3%'} order={2}>
              Chats
            </Title>
            <ScrollArea miw={'100%'} scrollHideDelay={0}>
              {data ? (
                data.userChats.map((chat, index) => (
                  <NavLink
                    key={chat.id}
                    label={`Chat ID: ${chat.id}`}
                    active={index === active}
                    description={`Members are ${chat.membersNames.toString()}`}
                    onClick={() => {
                      setActive(index)
                      setChatID(chat.id)
                    }}
                    variant="light"
                    color="primary"
                  />
                ))
              ) : (
                <LoadingOverlay />
              )}
            </ScrollArea>
          </>
        ) : (
          <CreateNewChat />
        )}
      </Stack>
    </Paper>
  )
}
