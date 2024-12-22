import { Button } from '../components/Button'
import { useMutation } from '@apollo/client'
import { LogoutMutation, LogoutMutationVariables } from '../__generated__/graphql'
import { LOGOUT } from '../features/auth/auth.gql'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'

interface Iprops {
  refetchLoginStatus: () => void
}

export const ChatScreen = ({ refetchLoginStatus }: Iprops) => {
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
      <Button text="Logout" loading={loading} onClick={logoutLogic} />
    </div>
  )
}
