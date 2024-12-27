import { useMantineTheme, ActionIcon } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { MessageTypes } from '../../__generated__/graphql'
import { useMutation } from '@apollo/client'
import {
  AddMessageMutation,
  AddMessageMutationVariables,
  AddMessageDocument,
  ChatMessagesDocument,
} from '../../__generated__/graphql'

interface Iprops {
  chatID: string
  msg: string
  setMsg: React.Dispatch<React.SetStateAction<string>>
}

//TODO: Either disable button or remove when chat not selected
export const SendMessageButton = ({ chatID, msg, setMsg }: Iprops) => {
  const theme = useMantineTheme()
  const [addMessage, { loading }] = useMutation<AddMessageMutation, AddMessageMutationVariables>(
    AddMessageDocument,
    {
      onError: (error) => {
        console.log(error) //TODO: Handle errors properly
      },
      // Assumes some shape of the object and updates cache instantly to provide
      // quick UI response. Apollo will update the object later after response comes from server
      optimisticResponse: {
        addMessage: {
          __typename: 'Message',
          content: msg,
          id: 'temp-id-2',
          time: '1733130045000', //TODO: Fix time
          type: MessageTypes.Text,
        },
      },
      refetchQueries: [ChatMessagesDocument],
    }
  )

  return (
    <ActionIcon
      size={32}
      radius="md"
      color={theme.colors['primary'][1]}
      variant="filled"
      onClick={async () => {
        const time = '1733130045000'
        await addMessage({
          variables: {
            msg: { type: MessageTypes.Text, content: msg, time, chatId: chatID },
          },
          // update: (cache, data) => {
          //   const data1 = cache.readQuery({ query: ChatMessagesDocument })
          //   if (!data1) {
          //     return
          //   }
          //   data1.chatMessages = [
          //     ...data1.chatMessages,
          //     { ...data.data?.addMessage, __typename: 'Message' },
          //   ]
          //   console.log(data)
          // },
        })
        setMsg('')
      }}
      loading={loading}
    >
      <IconArrowRight size={18} stroke={1.5} />
    </ActionIcon>
  )
}