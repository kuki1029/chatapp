import { useForm } from '@mantine/form'
import { Stack, TextInput, PasswordInput, Checkbox, Anchor, Group } from '@mantine/core'
import { upperFirst, useToggle } from '@mantine/hooks'
import { MutationFunction } from '@apollo/client'
import { LoginMutationVariables, LoginMutation } from '../../__generated__/graphql'
import { Button } from '../../components/Button'

interface Iprops {
  login: MutationFunction<LoginMutation, LoginMutationVariables>
  loading: boolean | undefined
}

export const AuthForm = ({ login, loading }: Iprops) => {
  const [type, toggle] = useToggle(['login', 'register'])
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

  const submitForm = async () => {
    await login({ variables: { email: form.values.email, password: form.values.password } })
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
        <Button text={upperFirst(type)} type="submit" loading={loading} />
      </Group>
    </form>
  )
}
