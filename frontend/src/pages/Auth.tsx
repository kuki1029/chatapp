import { Divider, Group, Paper, Title, Center, Container, Modal } from '@mantine/core'
import { GoogleButton } from '../utility/GoogleButton.tsx'
import { AuthForm } from '../features/auth/AuthForm.tsx'
import { useMutation } from '@apollo/client'
import { LoginMutation, LoginMutationVariables, LoginDocument } from '../__generated__/graphql'
import { useNavigate } from 'react-router-dom'

interface Iprops {
  refetchLoginStatus: () => void
}
// TODO: Add error when wrong password
export const Auth = ({ refetchLoginStatus }: Iprops) => {
  const navigate = useNavigate()
  const [login, { loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    {
      onError: (error) => {
        console.log(error)
      },
      onCompleted: (data) => {
        if (data.login) {
          refetchLoginStatus()
          navigate('/')
        }
      },
    }
  )

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
          <Group grow mb="md" mt="md">
            {/* Google login */}
            <GoogleButton radius="xl">Work In Progress</GoogleButton>
          </Group>
          <Divider label="Or continue with email" labelPosition="center" my="lg" />
          {/* Login/Signup Form */}
          <AuthForm login={login} loading={loading} />
        </Paper>
      </Container>
    </Center>
  )
}
