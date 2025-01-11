import { ActionIcon } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { MessageTypes } from '../../__generated__/graphql'
import { useMutation } from '@apollo/client'
import {
  AddMessageMutation,
  AddMessageMutationVariables,
  AddMessageDocument,
} from '../../__generated__/graphql'
import { useColorScheme } from '../../utility/useColorScheme'
import { useWindowEvent } from '@mantine/hooks'

interface Iprops {
  chatID: string
  msg: string
  setMsg: React.Dispatch<React.SetStateAction<string>>
}

export const SendMessageButton = ({ chatID, msg, setMsg }: Iprops) => {
  const color = useColorScheme()
  const [addMessage, { loading }] = useMutation<AddMessageMutation, AddMessageMutationVariables>(
    AddMessageDocument,
    {
      onError: (error) => {
        console.log(error) //TODO: Handle errors properly with notifcation
      },
    }
  )

  const sendMessage = async () => {
    await addMessage({
      variables: {
        msg: { type: MessageTypes.Text, content: msg, chatID },
      },
    })
    setMsg('')
  }

  useWindowEvent('keypress', (e) => {
    if (e.key === 'Enter') {
      void sendMessage()
    }
  })

  return (
    <ActionIcon
      size={28}
      radius="md"
      color={color.buttons}
      variant="filled"
      onClick={sendMessage}
      loading={loading}
    >
      <IconArrowRight size={18} stroke={1.5} />
    </ActionIcon>
  )
}
