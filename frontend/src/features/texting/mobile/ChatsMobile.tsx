import { NavLink, ScrollArea, Text, Box, Avatar, LoadingOverlay } from '@mantine/core'
import { upperFirst } from '@mantine/hooks'
import {
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
  NewUserChatDocument,
} from '../../../__generated__/graphql'
import { useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'

interface Iprops {
  setChat: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const ChatsMobile = ({ setChat }: Iprops) => {
  const currentSub = useRef<(() => void) | null>(null)
  const { data, loading, subscribeToMore } = useQuery<UserChatsQuery, UserChatsQueryVariables>(
    UserChatsDocument,
    {
      onError: (error) => {
        console.log(error)
        open()
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  //TODO: CLEAN UP THIS
  useEffect(() => {
    if (data && !loading && !currentSub.current) {
      currentSub.current = subscribeToMore({
        document: NewUserChatDocument,
        updateQuery: (prev, { subscriptionData }) => {
          const newData = prev.userChats
            .map((chat) => {
              if (chat.id === subscriptionData.data.newUserChat?.id) {
                return {
                  ...chat,
                  lastMsg: subscriptionData.data.newUserChat.lastMsg,
                  lastMsgTime: subscriptionData.data.newUserChat.lastMsgTime,
                }
              }
              return chat
            })
            .sort((a, b) => {
              if (a.lastMsgTime === '' && b.lastMsgTime === '') return 0
              if (a.lastMsgTime === '') return -1 // `a` has no messages, place it higher
              if (b.lastMsgTime === '') return 1 // `b` has no messages, place it higher

              // Sort by lastMsgTime (most recent first) for chats with messages
              if (b.lastMsgTime && a.lastMsgTime) {
                return new Date(b.lastMsgTime).getTime() - new Date(a.lastMsgTime).getTime()
              }
              return 0 // When they are null
            })
          return Object.assign({}, prev, {
            userChats: newData,
          })
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading])

  return (
    <ScrollArea h="100%" miw={'100%'} scrollbars="y" scrollHideDelay={0} p={3}>
      {data ? (
        data.userChats.map((chat) => {
          return (
            <NavLink
              key={chat.id}
              styles={{
                label: { backgroundColor: 'red', textOverflow: 'ellipsis' },
                root: {},
              }}
              label={
                <Box w={'100%'}>
                  <Text truncate="end" maw="100%">
                    {chat.users.map((user) => upperFirst(user.name)).join(', ')}
                  </Text>
                </Box>
              }
              description={
                <Text c="dimmed" size="xs" truncate="end">
                  {chat.lastMsg}
                </Text>
              }
              onClick={() => {
                setChat(chat.id)
              }}
              variant="filled"
              autoContrast
              color="dark"
              leftSection={<Avatar>{chat.users[0].avatar}</Avatar>}
            />
          )
        })
      ) : (
        <LoadingOverlay />
      )}
    </ScrollArea>
  )
}
