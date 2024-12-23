import React from 'react'
import { Container, Text } from '@mantine/core'

interface ChatBubbleProps {
  message: string
  sender: 'me' | 'other'
  time: string
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender, time }) => {
  if (sender === 'me') {
    return (
      <Container
        bg={'#fddfd3'}
        style={{
          borderRadius: '6px 6px 1px 6px',
          marginLeft: 'auto',
          marginRight: 0,
          paddingTop: '0.5rem',
          paddingBottom: '0.3rem',
        }}
      >
        <Text size="sm" fw={200}>
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
        bg={'#d3d8fd'}
        style={{
          borderRadius: '6px 6px 6px 1px',
          marginLeft: 0,
          marginRight: 'auto',
          paddingTop: '0.5rem',
          paddingBottom: '0.3rem',
        }}
      >
        <Text size="sm" fw={200}>
          {message}
        </Text>
        <Text ta={'left'} c="dimmed" style={{ fontSize: '0.5rem' }}>
          {time}
        </Text>
      </Container>
    )
  }
}
