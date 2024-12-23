interface Message {
  sender: string
  message: string
  time: string
}

export const data: Message[] = [
  { sender: '1', message: "Hey! How's it going?", time: '12/04/2024 10:00 AM' },
  { sender: '2', message: "Hi! I'm good, how about you?", time: '12/04/2024 10:01 AM' },
  { sender: '1', message: 'Pretty good, just working on a project.', time: '12/04/2024 10:02 AM' },
  { sender: '2', message: 'Nice! What kind of project is it?', time: '12/04/2024 10:03 AM' },
  {
    sender: '1',
    message: "It's a chatting app. Just creating some mock data.",
    time: '12/04/2024 10:04 AM',
  },
  { sender: '2', message: 'Oh, cool! Need any help with it?', time: '12/04/2024 10:05 AM' },
  {
    sender: '1',
    message: "Thanks! Not right now, but I'll let you know.",
    time: '12/04/2024 10:06 AM',
  },
  {
    sender: '2',
    message: 'Alright, just let me know. Sounds like a fun project.',
    time: '12/04/2024 10:07 AM',
  },
  {
    sender: '1',
    message: "Yeah, it's coming together. I'll share it soon!",
    time: '12/04/2024 10:08 AM',
  },
  { sender: '2', message: 'Looking forward to it! Good luck.', time: '12/04/2024 10:09 AM' },
]
