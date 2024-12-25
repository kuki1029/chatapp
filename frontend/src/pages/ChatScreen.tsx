import { Button } from '../components/Button'
import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { LogoutMutation, LogoutMutationVariables } from '../__generated__/graphql'
import { LOGOUT } from '../features/auth/auth.gql'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import {
  Modal,
  Paper,
  Stack,
  Center,
  NavLink,
  TextInput,
  Text,
  ActionIcon,
  useMantineTheme,
  Flex,
  Group,
  Avatar,
  ScrollArea,
} from '@mantine/core'
import { IconArrowRight, IconPlus, IconVideoPlus } from '@tabler/icons-react'
import { ChatBubble } from '../features/texting/ChatBubble'
import { data } from '../features/texting/data'
import { useState } from 'react'
import {
  CreateChatWithEmailMutation,
  CreateChatWithEmailMutationVariables,
} from '../__generated__/graphql'
import { CREATE_CHAT_WITH_EMAIL } from '../features/texting/chat.gql'
import { UserChatsQuery, UserChatsQueryVariables } from '../__generated__/graphql'
import { GET_USER_CHATS } from '../features/texting/chat.gql'
import { ChatMessagesQuery, ChatMessagesQueryVariables } from '../__generated__/graphql'
import { GET_CHAT_MESSAGES } from '../features/texting/chat.gql'

interface Iprops {
  refetchLoginStatus: () => void
}

export const ChatScreen = ({ refetchLoginStatus }: Iprops) => {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const { data: data1 } = useQuery<UserChatsQuery, UserChatsQueryVariables>(GET_USER_CHATS, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })
  const [getMessages, { data: data2 }] = useLazyQuery<
    ChatMessagesQuery,
    ChatMessagesQueryVariables
  >(GET_CHAT_MESSAGES, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })
  const [logout, { loading }] = useMutation<LogoutMutation, LogoutMutationVariables>(LOGOUT, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })
  const [createChat, { loading: loadingCreateChat }] = useMutation<
    CreateChatWithEmailMutation,
    CreateChatWithEmailMutationVariables
  >(CREATE_CHAT_WITH_EMAIL, {
    onError: (error) => {
      console.log(error)
      open()
    },
  })
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const logoutLogic = async (): Promise<void> => {
    await logout()
    refetchLoginStatus()
    navigate('/login')
  }

  const emailSub = async () => {
    await createChat({ variables: { email } })
  }
  console.log(data2?.chatMessages)

  return (
    <div>
      <Flex h="100%" gap="md" justify="flex-end" align="flex-end" direction="row">
        <Center
          h="100vh"
          style={{
            maxWidth: '40%',
            minHeight: '100%',
            margin: '0 auto',
          }}
        >
          {/* Temp stuff for chat access */}
          <Paper h="90%" shadow="xl" radius="md" p="sm" bg={'white'}>
            <TextInput
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value)
              }}
              label="email temp"
              placeholder="email"
            />
            <Button text="new chat" onClick={emailSub} loading={loadingCreateChat}></Button>
            {data1 ? (
              data1.userChats.map((i) => (
                <NavLink
                  key={i.id}
                  label={`Chat ID: ${i.id}`}
                  description={`Members are ${i.membersID.toString()}`}
                  onClick={async () => {
                    await getMessages({ variables: { chatId: i.id } })
                    console.log('A')
                  }}
                />
              ))
            ) : (
              <p>Loading</p>
            )}
          </Paper>
        </Center>
        <Modal opened={opened} onClose={close} withCloseButton={false}>
          There was an error. Please refresh the page.
        </Modal>
        <Center
          h="100vh"
          style={{
            maxWidth: '40%',
            minHeight: '100%',
            margin: '0 auto',
          }}
        >
          <Paper h="90%" shadow="xl" radius="md" p="sm" bg={'white'}>
            <Stack
              bg="var(--mantine-color-body)"
              align="center"
              justify="space-between"
              h="100%"
              style={{
                margin: '1',
              }}
            >
              <Group w={'100%'} justify="space-between">
                <Group style={{ gap: '0.5rem' }}>
                  <Avatar color="blue" radius="sm">
                    KV
                  </Avatar>
                  <div style={{ flex: 1, margin: '-2' }}>
                    <Text size="sm" fw={500}>
                      Kunal Varkekar
                    </Text>

                    <Text c="dimmed" size="xs">
                      Typing...
                    </Text>
                  </div>
                </Group>

                <ActionIcon
                  size={32}
                  radius="md"
                  color={theme.colors['primary'][1]}
                  variant="filled"
                >
                  <IconVideoPlus size={18} stroke={1.5} />
                </ActionIcon>
              </Group>
              <ScrollArea>
                <Flex gap="md" justify="center" align="flex-end" direction="column" wrap="nowrap">
                  {data.map((i) => {
                    return (
                      <ChatBubble
                        message={i.message}
                        sender={i.sender === '1' ? 'me' : 'other'}
                        time={i.time}
                      />
                    )
                  })}
                </Flex>
              </ScrollArea>

              <TextInput
                radius="md"
                size="md"
                w={'100%'}
                placeholder="Write a message..."
                rightSectionWidth={42}
                leftSection={
                  <ActionIcon
                    size={28}
                    radius="md"
                    color={theme.colors['primary'][1]}
                    variant="filled"
                  >
                    <IconPlus size={18} stroke={1.5} />
                  </ActionIcon>
                }
                rightSection={
                  <ActionIcon
                    size={32}
                    radius="md"
                    color={theme.colors['primary'][1]}
                    variant="filled"
                  >
                    <IconArrowRight size={18} stroke={1.5} />
                  </ActionIcon>
                }
              />
            </Stack>
          </Paper>
        </Center>
      </Flex>
      <Button text="Logout" loading={loading} onClick={logoutLogic} />
    </div>
  )
}
