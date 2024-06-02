import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from './redux/store.js'
import { persistor } from './redux/store.js'
import { Provider } from 'react-redux'
import { Home, SignUp, SignIn, ChatPage, NoChatSelected } from './pages/index.js'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketContextProvider } from './context/SocketContext.jsx'

const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/signin',
      element: <SignIn />
    },
    {
      path: '/chats/:id',
      element: <ChatPage />
    },
    {
      path: '/chats',
      element: <NoChatSelected />
    },
  ]
}])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContextProvider>
          <RouterProvider router={router} />
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
