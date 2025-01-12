import { TextInput, Button, Container, Text, useMantineTheme } from '@mantine/core'
import {
  CreateChatWithEmailDocument,
  CreateChatWithEmailMutation,
  CreateChatWithEmailMutationVariables,
  UserChatsDocument,
} from '../../__generated__/graphql'
import { useState } from 'react'
import { useMutation } from '@apollo/client'

// TODO: Temp component for now until I add friends list
export const CreateNewChat = () => {
  const theme = useMantineTheme()
  const [email, setEmail] = useState('')
  const [createChat, { loading }] = useMutation<
    CreateChatWithEmailMutation,
    CreateChatWithEmailMutationVariables
  >(CreateChatWithEmailDocument, {
    onError: (error) => {
      console.log(error)
    },
    refetchQueries: [{ query: UserChatsDocument }],
  })

  const onSubmitButton = () => {
    void createChat({ variables: { email } })
    setEmail('')
  }

  return (
    <Container p={30}>
      <Text size="sm">
        Temporary option to add messages by their email. This will be replaced by a friends list.
      </Text>
      <TextInput
        label={'Enter their email:'}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      ></TextInput>
      <Button
        onClick={onSubmitButton}
        loading={loading}
        maw={300}
        miw={100}
        fullWidth
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
        {' '}
        Add Friend
      </Button>
    </Container>
  )
}
