import { Paper, Stack, Text } from '@mantine/core'
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
  const chatInfo = data?.currentChatInfo

  useEffect(() => {
    if (chatID) {
      void getMessages({ variables: { chatID } })
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
        {chatID && chatMessages && chatInfo ? (
          <>
            <CurrentChatProfile chatUsers={chatInfo} status="now" />
            <DisplayMessages messages={chatMessages} />
            <MessageInput chatID={chatID} />
          </>
        ) : (
          <Text h={'50%'}>Choose a chat!</Text>
          // TODO: Use a diff element above
        )}
      </Stack>
    </Paper>
  )
}
