import { ScrollArea, Stack } from '@mantine/core'
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
    <ScrollArea
      offsetScrollbars
      miw={'100%'}
      viewportRef={scrollView}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      styles={{
        viewport: {
          height: 'auto',
        },
      }}
    >
      <Stack align="center" justify="flex-end" gap="xs">
        {/* Spacer to push content down */}
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
      </Stack>
    </ScrollArea>
  )
}
