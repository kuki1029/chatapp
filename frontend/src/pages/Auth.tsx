import { Divider, Paper, Title, Center, Container, Modal } from '@mantine/core'
import { AuthForm } from '../features/auth/AuthForm.tsx'
import { useMutation } from '@apollo/client'
import {
  LoginMutation,
  LoginMutationVariables,
  LoginDocument,
  SignupDocument,
  SignupMutation,
  SignupMutationVariables,
} from '../__generated__/graphql'
import { useNavigate } from 'react-router-dom'

interface Iprops {
  refetchLoginStatus: () => void
}

export const Auth = ({ refetchLoginStatus }: Iprops) => {
  const navigate = useNavigate()
  const [login, { loading, error, data }] = useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    {
      onError: (error) => {
        console.log(error) //TODO: Handle error properly with notification and others too
      },
      onCompleted: (data) => {
        if (data.login) {
          refetchLoginStatus()
          navigate('/')
        } else {
          navigate('/login')
        }
      },
    }
  )
  const [signup, { loading: signupLoading, error: signupError, data: signupData }] = useMutation<
    SignupMutation,
    SignupMutationVariables
  >(SignupDocument, {
    onError: (error) => {
      console.log(error) //TODO: Handle error properly with notification and others too
    },
    onCompleted: (data) => {
      if (data.signup) {
        refetchLoginStatus()
        navigate('/')
      } else {
        navigate('/login')
      }
    },
  })

  return (
    <Center h={'100vh'}>
      <Container>
        <Title style={{ textAlign: 'center' }} order={1}>
          CHATIQUE
        </Title>
        {/* Error modal */}
        <Modal opened={!!error} onClose={() => {}} withCloseButton={false}>
          The backend is currently shut down to save costs. Please reach out to test the demo.
        </Modal>
        <Paper radius="md" p="xl" withBorder shadow="lg">
          {/* Login/Signup Form */}
          <AuthForm
            login={login}
            signup={signup}
            loading={loading || signupLoading}
            success={!!data?.login}
            signupSuccess={!!signupData?.signup}
          />
        </Paper>
      </Container>
    </Center>
  )
}
