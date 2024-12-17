import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Title,
  TextInput,
  Center,
  Container,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { upperFirst, useToggle } from '@mantine/hooks'
import { useMutation } from '@apollo/client'
import { GoogleButton } from '../utility/GoogleButton.tsx'
import { LOGIN } from '../features/auth/auth.gql.ts'
import { LoginMutation, LoginMutationVariables } from '../__generated__/graphql.ts'

export const Auth = () => {
  const [type, toggle] = useToggle(['login', 'register'])
  const theme = useMantineTheme()
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  })

  const [login, { data, loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(
    LOGIN,
    {
      onError: (error) => {
        console.log(error)
      },
    }
  )

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])

  if (loading) {
    return <p>Loading...</p> //TODO: Add better loading pages
  } else if (error) {
    return <p>Some error happened</p> //TODO: Better error page
  }

  const submitForm = async () => {
    console.log(form.values)
    await login({ variables: { email: form.values.email, password: form.values.password } })
  }

  return (
    <Center h={'100vh'}>
      <Container>
        <Title style={{ textAlign: 'center' }} order={1}>
          CHATIQUE
        </Title>
        {/* Google login */}
        <Paper radius="md" p="xl" withBorder shadow="lg">
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
          </Group>
          <Divider label="Or continue with email" labelPosition="center" my="lg" />
          {/* Login with email */}
          <form
            onSubmit={form.onSubmit(async () => {
              await submitForm()
            })}
          >
            <Stack>
              {type === 'register' && (
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) => {
                    form.setFieldValue('name', event.currentTarget.value)
                  }}
                  radius="md"
                />
              )}

              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) => {
                  form.setFieldValue('email', event.currentTarget.value)
                }}
                error={form.errors.email && 'Invalid email'}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => {
                  form.setFieldValue('password', event.currentTarget.value)
                }}
                error={form.errors.password && 'Password should include at least 6 characters'}
                radius="md"
              />

              {type === 'register' && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) => {
                    form.setFieldValue('terms', event.currentTarget.checked)
                  }}
                />
              )}
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => {
                  toggle()
                }}
                size="xs"
              >
                {type === 'register'
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button
                type="submit"
                radius="xl"
                color="primary"
                variant="outline"
                m="4"
                styles={{
                  root: {
                    borderWidth: '1px',
                    borderColor: theme.colors['primary'][1],
                  },
                }}
                my={16}
              >
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </Center>
  )
}
