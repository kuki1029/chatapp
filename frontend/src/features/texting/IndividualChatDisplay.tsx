import { useQuery } from '@apollo/client'
import { ScrollArea, LoadingOverlay, NavLink, Avatar, Text, Box } from '@mantine/core'
import {
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
  NewUserChatDocument,
} from '../../__generated__/graphql'
import { useEffect, useState } from 'react'
import { upperFirst } from '@mantine/hooks'
import './chat.css'

interface Iprops {
  setChatID: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const IndividualChatDisplay = ({ setChatID }: Iprops) => {
  const [active, setActive] = useState(-1)
  const { data, loading, subscribeToMore } = useQuery<UserChatsQuery, UserChatsQueryVariables>(
    UserChatsDocument,
    {
      onError: (error) => {
        console.log(error)
        open()
      },
    }
  )

  useEffect(() => {
    if (data && !loading) {
      subscribeToMore({
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
              console.log(a.lastMsgTime, b.lastMsgTime)
              console.log(new Date(b.lastMsgTime).getTime() - new Date(a.lastMsgTime).getTime())

              // Sort by lastMsgTime (most recent first) for chats with messages
              if (b.lastMsgTime && a.lastMsgTime) {
                console.log('AAA')
                return new Date(b.lastMsgTime).getTime() - new Date(a.lastMsgTime).getTime()
              }
              return 0 // When they are null
            })
          console.log(newData)
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
                console.log(`Clicked on ${chat.id}`)
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
