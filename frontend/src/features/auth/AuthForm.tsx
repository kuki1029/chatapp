import { useForm } from '@mantine/form'
import { Stack, TextInput, PasswordInput, Anchor, Group } from '@mantine/core'
import { upperFirst, useToggle } from '@mantine/hooks'
import { MutationFunction } from '@apollo/client'
import {
  LoginMutationVariables,
  LoginMutation,
  SignupMutation,
  SignupMutationVariables,
} from '../../__generated__/graphql'
import { Button } from '../../components/Button'

interface Iprops {
  login: MutationFunction<LoginMutation, LoginMutationVariables>
  signup: MutationFunction<SignupMutation, SignupMutationVariables>
  loading: boolean | undefined
  success: boolean | undefined
  signupSuccess: boolean | undefined
}

export const AuthForm = ({ login, signup, loading, success, signupSuccess }: Iprops) => {
  const [type, toggle] = useToggle(['login', 'register'])
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  })

  const submitForm = async () => {
    if (type === 'login') {
      await login({ variables: { email: form.values.email, password: form.values.password } })
      if (!success) {
        form.setErrors({
          password: 'Incorrect email or password',
          email: 'Incorrect email or password',
        })
      }
    } else if (type === 'register') {
      if (form.values.name.length === 0) {
        form.setErrors({ name: 'Must enter name' })
      } else {
        await signup({
          variables: {
            name: form.values.name,
            email: form.values.email,
            password: form.values.password,
          },
        })
        if (!signupSuccess) {
          form.setErrors({
            password: 'Incorrect password or email already used.',
            email: 'Incorrect password or email already used.',
          })
        }
      }
    }
  }

  //  Login with email form
  return (
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
            error={form.errors.name}
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
          error={form.errors.email}
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
          error={form.errors.password}
          radius="md"
        />
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
        <Button text={upperFirst(type)} type="submit" loading={loading} />
      </Group>
    </form>
  )
}
