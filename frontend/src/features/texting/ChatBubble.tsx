import React from 'react'
import { Container, Text } from '@mantine/core'
import { useColorScheme } from '../../utility/useColorScheme'

interface ChatBubbleProps {
  message: string
  sender: 'me' | 'other'
  time: string
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender, time }) => {
  const colors = useColorScheme()

  if (sender === 'me') {
    return (
      <Container
        bg={'#ffffff'}
        style={{
          borderRadius: '6px 6px 1px 6px',
          marginLeft: 'auto',
          marginRight: 0,
          paddingTop: '0.5rem',
          paddingBottom: '0.3rem',
        }}
      >
        <Text size="sm" c="secondary" fw={200}>
          {message}
        </Text>
        <Text ta={'right'} c="dimmed" style={{ fontSize: '0.5rem' }}>
          {time}
        </Text>
      </Container>
    )
  } else {
    return (
      <Container
        bg={colors.chatBox}
        style={{
          borderRadius: '6px 6px 6px 1px',
          marginLeft: 0,
          marginRight: 'auto',
          paddingTop: '0.5rem',
          paddingBottom: '0.3rem',
        }}
      >
        <Text size="sm" c={'white'} fw={200}>
          {message}
        </Text>
        <Text ta={'left'} c="dimmed" style={{ fontSize: '0.5rem' }}>
          {time}
        </Text>
      </Container>
    )
  }
}
