import { ScrollArea, Flex } from '@mantine/core'
import { ChatBubble } from './ChatBubble'
import { ChatMessagesQuery } from '../../__generated__/graphql'
import { useContext, useEffect, useRef } from 'react'
import { UserIdContext } from '../auth/UserIDContext'

interface Iprops {
  messages: ChatMessagesQuery['chatMessages']
}

export const DisplayMessages = ({ messages }: Iprops) => {
  const userID = useContext(UserIdContext)
  const scrollView = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollView.current) {
      scrollView.current.scrollTo({ top: scrollView.current.scrollHeight })
    }
  })

  return (
    <ScrollArea viewportRef={scrollView}>
      <Flex gap="md" justify="center" align="flex-end" direction="column" wrap="nowrap">
        {messages.map((msg) => {
          const date = new Date(parseInt(msg.time)) //TODO: Research if better way to get this time or store in BE
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`
          return (
            <ChatBubble
              key={msg.id}
              message={msg.content}
              sender={msg.senderId === userID ? 'me' : 'other'} //TODO: Fix senderId to senderID
              time={formattedDate}
            />
          )
        })}
      </Flex>
    </ScrollArea>
  )
}
