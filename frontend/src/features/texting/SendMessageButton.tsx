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
import { useColorScheme } from '../../utility/useColorScheme'

interface Iprops {
  chatID: string
  msg: string
  setMsg: React.Dispatch<React.SetStateAction<string>>
}

//TODO: Either disable button or remove when chat not selected
export const SendMessageButton = ({ chatID, msg, setMsg }: Iprops) => {
  const color = useColorScheme()
  const [addMessage, { loading }] = useMutation<AddMessageMutation, AddMessageMutationVariables>(
    AddMessageDocument,
    {
      onError: (error) => {
        console.log(error) //TODO: Handle errors properly
      },
      // Assumes some shape of the object and updates cache instantly to provide
      // quick UI response. Apollo will update the object later after response comes from server
      //TODO: Test this when in prod
      optimisticResponse: {
        addMessage: {
          __typename: 'Message',
          content: msg,
          id: 'temp-id',
          time: '1733130045000', //TODO: Fix time
          type: MessageTypes.Text,
        },
      },
      refetchQueries: [ChatMessagesDocument],
    }
  )

  return (
    <ActionIcon
      size={24}
      radius="md"
      color={color.buttons}
      variant="filled"
      onClick={async () => {
        const time = '1733130045000'
        await addMessage({
          variables: {
            msg: { type: MessageTypes.Text, content: msg, time, chatId: chatID },
          },
        })
        setMsg('')
      }}
      loading={loading}
    >
      <IconArrowRight size={18} stroke={1.5} />
    </ActionIcon>
  )
}
