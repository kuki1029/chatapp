import { Button } from '../components/Button'
import { useMutation } from '@apollo/client'
import { LogoutMutation, LogoutMutationVariables } from '../__generated__/graphql'
import { LOGOUT } from '../features/auth/auth.gql'
import { useNavigate } from 'react-router-dom'

export const ChatScreen = ({ refetch }: { refetch: () => void }) => {
  const [logout, { loading, error }] = useMutation<LogoutMutation, LogoutMutationVariables>(LOGOUT)
  const navigate = useNavigate()
  // TODO: Add loading state to button directly
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error. Refresh page</p>
  }
  // TODO: Can add useeffect to deal with data and see if error on BE with loggingout.

  const logoutLogic = async () => {
    await logout()
    refetch()
    navigate('/login')
  }

  return (
    <div>
      <Button text="Logout" onClick={() => void logoutLogic()} />
    </div>
  )
}
