export const conversations = [
  { id: 1, name: 'Sara', lastMessage: 'See you there', time: '10:42 PM', unread: 3 },
  { id: 2, name: 'Study Group', lastMessage: 'Omar: sent the notes', time: '9:15 PM', unread: 0, isGroup: true },
]

export const messages = {
  1: [
    { id: 'm1', from: 'them', text: 'Hey!', time: '10:40 PM' },
    { id: 'm2', from: 'me', text: 'Hi Sara', time: '10:41 PM', status: 'sent' },
    { id: 'm3', from: 'me', text: 'Are you coming?', time: '10:42 PM', status: 'sending' },
  ],
}