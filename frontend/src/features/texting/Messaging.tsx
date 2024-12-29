import { Paper, Stack, Text, useComputedColorScheme } from '@mantine/core'
import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ChatMessagesQuery,
  ChatMessagesQueryVariables,
  ChatMessagesDocument,
} from '../../__generated__/graphql'
import { MessageInput } from './MessageInput'
import { CurrentChatProfile } from './CurrentChatProfile'
import { DisplayMessages } from './DisplayMessages'
import { useColorScheme } from '../../utility/useColorScheme'

interface Iprops {
  chatID: string | undefined
}

const stackStyle = {
  align: 'center',
  justify: 'space-between',
  h: '100%',
  gap: '7',
}

export const Messaging = ({ chatID }: Iprops) => {
  const colors = useColorScheme()
  const [getMessages, { data }] = useLazyQuery<ChatMessagesQuery, ChatMessagesQueryVariables>(
    ChatMessagesDocument
  )
  const chatMessages = data?.chatMessages

  useEffect(() => {
    if (chatID) {
      void getMessages({ variables: { chatId: chatID } })
    }
  }, [chatID, getMessages])

  return (
    <Paper
      h="90%"
      shadow="xl"
      miw={'100%'}
      radius="md"
      p="xs"
      style={{ zIndex: 9999, background: colors.bgColor }}
    >
      <Stack {...stackStyle}>
        <CurrentChatProfile />
        {chatID && chatMessages ? (
          <>
            <DisplayMessages messages={chatMessages} />
            <MessageInput chatID={chatID} />
          </>
        ) : (
          <Text h={'50%'}>Choose a chat!</Text>
        )}
      </Stack>
    </Paper>
  )
}
