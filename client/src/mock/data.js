export const conversations = [
  { id: 1, name: 'Sara Ahmed', lastMessage: 'Are you coming?', time: '10:42 PM', unread: 3 },
  { id: 2, name: 'Study Group', lastMessage: 'Omar: sent the notes', time: '9:15 PM', unread: 0 },
  { id: 3, name: 'Karim Hassan', lastMessage: 'See you tomorrow', time: '8:30 PM', unread: 1 },
  { id: 4, name: 'Networks Team', lastMessage: 'Server is up', time: '7:05 PM', unread: 0 },
  { id: 5, name: 'Mona Ali', lastMessage: 'Thanks!', time: 'Yesterday', unread: 0 },
  { id: 6, name: 'Youssef', lastMessage: 'Check the repo', time: 'Yesterday', unread: 2 },
  { id: 7, name: 'Nour', lastMessage: 'Sounds good', time: 'Mon', unread: 0 },
  { id: 8, name: 'Hana', lastMessage: 'Lol', time: 'Sun', unread: 0 },
]

export const messages = {
  1: [
    { id: 'm1', from: 'them', text: 'Hey! Did you finish the project?', time: '10:30 PM' },
    { id: 'm2', from: 'me', text: 'Almost, working on the frontend now', time: '10:31 PM', status: 'delivered' },
    { id: 'm3', from: 'them', text: 'Nice. Send me a screenshot when it is ready', time: '10:35 PM' },
    { id: 'm4', from: 'me', text: 'Will do', time: '10:36 PM', status: 'delivered' },
    { id: 'm5', from: 'me', text: 'Are you coming tomorrow?', time: '10:37 PM', status: 'sent' },
    { id: 'm6', from: 'me', text: 'Hello?', time: '10:38 PM', status: 'failed' },
    { id: 'm7', from: 'me', text: 'This one is still sending', time: '10:39 PM', status: 'sending' },
  ],
}