import { ScrollArea, Flex } from '@mantine/core'
import { ChatBubble } from './ChatBubble'
import { ChatMessagesQuery } from '../../__generated__/graphql'
import { useContext, useEffect, useRef } from 'react'
import { UserIdContext } from '../auth/UserIDContext'
import './chat.css'

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
    <ScrollArea h="100%" miw={'100%'} viewportRef={scrollView}>
      <Flex gap="7" h={'100%'} justify="flex-end" align="flex-end" direction="column" wrap="nowrap">
        {messages.map((msg) => {
          const date = new Date(parseInt(msg.createdAt)) //TODO: Research if better way to get this time or store in BE
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`
          return (
            <ChatBubble
              key={msg.id}
              message={msg.content}
              sender={msg.senderID === userID ? 'me' : 'other'}
              time={formattedDate}
            />
          )
        })}
      </Flex>
    </ScrollArea>
  )
}
