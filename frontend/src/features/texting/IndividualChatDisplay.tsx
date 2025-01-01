import { useQuery } from '@apollo/client'
import { ScrollArea, LoadingOverlay, NavLink, Avatar, Text, Box } from '@mantine/core'
import {
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
} from '../../__generated__/graphql'
import { useState } from 'react'
import { upperFirst } from '@mantine/hooks'
import './chat.css'

interface Iprops {
  setChatID: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const IndividualChatDisplay = ({ setChatID }: Iprops) => {
  const [active, setActive] = useState(-1)
  const { data } = useQuery<UserChatsQuery, UserChatsQueryVariables>(UserChatsDocument, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })
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
