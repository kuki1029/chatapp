import { useQuery } from '@apollo/client'
import { ScrollArea, LoadingOverlay, NavLink, Avatar } from '@mantine/core'
import {
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
} from '../../__generated__/graphql'
import { useState } from 'react'
import { upperFirst } from '@mantine/hooks'

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
    <ScrollArea miw={'100%'} scrollHideDelay={0}>
      {data ? (
        data.userChats.map((chat, index) => (
          <NavLink
            key={chat.id}
            label={upperFirst(chat.membersNames.toString())}
            description={`Last Message Here. Time. `}
            active={index === active}
            onClick={() => {
              setActive(index)
              setChatID(chat.id)
            }}
            variant="filled"
            autoContrast
            color="dark"
            leftSection={<Avatar>KV</Avatar>}
          />
        ))
      ) : (
        <LoadingOverlay />
      )}
    </ScrollArea>
  )
}
