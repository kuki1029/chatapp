import { Center, Container, Text, Paper } from '@mantine/core'

export const Error = () => {
  return (
    <Center h={'100vh'}>
      <Container>
        <Paper radius="md" p="xl" withBorder shadow="lg">
          <Text
            size="xl"
            fw={900}
            variant="gradient"
            gradient={{ from: 'rgba(0, 0, 0, 1)', to: 'rgba(170, 0, 255, 1)', deg: 0 }}
          >
            Unfortunately the backend is currently shut down to save costs. Please reach out if
            you'd like to see a demo.
          </Text>
        </Paper>
      </Container>
    </Center>
  )
}
