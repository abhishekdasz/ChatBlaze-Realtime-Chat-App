import { ChatContextProvider } from '@/context/chatContext'
import { UserProvider } from '@/context/contextAuth'
import '@/styles/globals.scss'


export default function App({ Component, pageProps }) {
  return (
  <UserProvider>
    <ChatContextProvider>
      <Component {...pageProps} />
    </ChatContextProvider>
  </UserProvider>
  )

}
