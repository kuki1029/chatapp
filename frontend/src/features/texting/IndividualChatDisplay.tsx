import { useQuery } from '@apollo/client'
import { ScrollArea, LoadingOverlay, NavLink } from '@mantine/core'
import {
  UserChatsQuery,
  UserChatsQueryVariables,
  UserChatsDocument,
} from '../../__generated__/graphql'
import { useState } from 'react'

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
  )
}
