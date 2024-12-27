import { Button } from '../components/Button'
import { useMutation } from '@apollo/client'
import { LogoutMutation, LogoutMutationVariables } from '../__generated__/graphql'
import { LOGOUT } from '../features/auth/auth.gql'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Center, Flex, Grid } from '@mantine/core'
import { useState } from 'react'
import { Messaging } from '../features/texting/Messaging'
import { Chats } from '../features/texting/Chats'
interface Iprops {
  refetchLoginStatus: () => void
}

const centerStyle = {
  h: '100vh',
  style: {
    minHeight: '100%',
  },
}

export const ChatScreen = ({ refetchLoginStatus }: Iprops) => {
  const [chatID, setChatID] = useState<string | undefined>()

  const [opened, { open, close }] = useDisclosure(false)

  const [logout, { loading }] = useMutation<LogoutMutation, LogoutMutationVariables>(LOGOUT, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })

  const navigate = useNavigate()

  const logoutLogic = async (): Promise<void> => {
    await logout()
    refetchLoginStatus()
    navigate('/login')
  }

  return (
    <div>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        There was an error. Please refresh the page.
      </Modal>
      <Grid h="100%" grow overflow="hidden" pr={'2%'}>
        <Grid.Col span={4}>
          <Center {...centerStyle}>
            <Chats setChatID={setChatID} />
          </Center>
        </Grid.Col>
        <Grid.Col span={8}>
          <Center {...centerStyle}>
            <Messaging chatID={chatID} />
          </Center>
        </Grid.Col>
      </Grid>
      <Button text="Logout" loading={loading} onClick={logoutLogic} />
    </div>
  )
}
