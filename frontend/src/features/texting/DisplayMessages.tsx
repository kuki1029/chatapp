import { ScrollArea, Flex } from '@mantine/core'
import { ChatBubble } from './ChatBubble'
import { ChatMessagesQuery } from '../../__generated__/graphql'
import { useContext, useEffect, useRef } from 'react'
import { UserIdContext } from '../auth/UserIDContext'
import { useSubscription } from '@apollo/client'
import {
  NewMessageDocument,
  NewMessageSubscription,
  NewMessageSubscriptionVariables,
} from '../../__generated__/graphql'
import './chat.css'

interface Iprops {
  messages: ChatMessagesQuery['chatMessages']
}

export const DisplayMessages = ({ messages }: Iprops) => {
  const { data, loading } = useSubscription<
    NewMessageSubscription,
    NewMessageSubscriptionVariables
  >(NewMessageDocument, { variables: { chatId: '2' } })
  const userID = useContext(UserIdContext)
  const scrollView = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollView.current) {
      scrollView.current.scrollTo({ top: scrollView.current.scrollHeight })
    }
  })

  console.log(data, loading)

  return (
    <ScrollArea offsetScrollbars miw={'100%'} viewportRef={scrollView}>
      <Flex gap="7" justify="flex-end" align="flex-end" direction="column" wrap="nowrap">
        {messages.map((msg) => {
          // I could format this in backend but I want to give frontend freedom to change based on timezone
          const date = new Date(parseInt(msg.createdAt))
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
