import { useQuery } from '@apollo/client'
import { ScrollArea, LoadingOverlay, NavLink, Avatar, Text, Box } from '@mantine/core'
import {
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
  NewUserChatDocument,
} from '../../__generated__/graphql'
import { useEffect, useRef, useState, useContext } from 'react'
import { upperFirst } from '@mantine/hooks'
import './chat.css'
import { UserIdContext } from '../auth/UserIDContext'

interface Iprops {
  setChatID: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const IndividualChatDisplay = ({ setChatID }: Iprops) => {
  const userID = useContext(UserIdContext)
  const [active, setActive] = useState(-1)
  const currentSub = useRef<(() => void) | null>(null)
  const activeRef = useRef<number>(active)
  console.log('here')
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
  console.log(data)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  //TODO: CLEAN UP THIS
  useEffect(() => {
    if (data && !loading && !currentSub.current) {
      currentSub.current = subscribeToMore({
        document: NewUserChatDocument,
        updateQuery: (prev, { subscriptionData }) => {
          const newIndex = prev.userChats.findIndex((chat) => {
            return chat.id === subscriptionData.data.newUserChat?.id
          })
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
          const active = activeRef.current
          if (!(active === -1)) {
            // Logic to change the selected chat if the order changes.
            if (userID && userID === subscriptionData.data.newUserChat?.userID) {
              setActive(0)
            } else if (newIndex === active) {
              setActive(0)
            } else if (newIndex > active) {
              setActive(active + 1)
            }
          }

          return Object.assign({}, prev, {
            userChats: newData,
          })
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading])

  return (
    <ScrollArea miw={'100%'} scrollbars="y" scrollHideDelay={0}>
      {data ? (
        data.userChats.map((chat, index) => {
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
              active={index === active}
              onClick={() => {
                setActive(index)
                setChatID(chat.id)
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
