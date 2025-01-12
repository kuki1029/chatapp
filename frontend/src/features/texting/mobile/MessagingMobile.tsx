import { Stack, Text } from '@mantine/core'
import {
  ChatMessagesQuery,
  ChatMessagesQueryVariables,
  ChatMessagesDocument,
  NewMessageDocument,
} from '../../../__generated__/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'
import { CurrentChatProfile } from '../CurrentChatProfile'
import { DisplayMessagesMobile } from './DisplayMessagesMobile'
import { MessageInput } from '../MessageInput'

interface Iprops {
  chatID: string | undefined
  setChat: React.Dispatch<React.SetStateAction<string | undefined>>
}

const stackStyle = {
  align: 'center',
  justify: 'space-between',
  gap: '7',
  h: '100vh',
  p: '7',
}

export const MessagingMobile = ({ chatID, setChat }: Iprops) => {
  const [getMessages, { data, subscribeToMore }] = useLazyQuery<
    ChatMessagesQuery,
    ChatMessagesQueryVariables
  >(ChatMessagesDocument, {})
  const chatMessages = data?.chatMessages
  const chatInfo = data?.currentChatInfo
  // Handle unsubbing ourselves
  const currentSubscription = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (chatID) {
      void getMessages({ variables: { chatID } })
      if (currentSubscription.current) {
        // This unsubs the current subscription
        currentSubscription.current()
      }
      currentSubscription.current = subscribeToMoreCallback(chatID)
    }

    return () => {
      if (currentSubscription.current) {
        currentSubscription.current()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatID, getMessages])

  const subscribeToMoreCallback = (chatID: string) => {
    return subscribeToMore({
      document: NewMessageDocument,
      variables: { chatId: chatID },
      updateQuery: (prev, { subscriptionData }) => {
        const newMsg = subscriptionData.data.newMessage
        return Object.assign({}, prev, {
          chatMessages: [...prev.chatMessages, newMsg],
        })
      },
    })
  }

  return (
    <>
      <Stack {...stackStyle}>
        {chatID && chatMessages && chatInfo ? (
          <>
            <CurrentChatProfile chatUsers={chatInfo} status="now" setChat={setChat} />
            <DisplayMessagesMobile messages={chatMessages} />
            <MessageInput chatID={chatID} />
          </>
        ) : (
          <Text h={'50%'}>Choose a chat!</Text>
          // TODO: Use a diff element above
        )}
      </Stack>
    </>
  )
}
