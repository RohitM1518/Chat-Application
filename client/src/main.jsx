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
import { SidebarContextProvider } from './context/SidebarContext.jsx'
import { LoadingContextProvider } from './context/LoadingContext.jsx'
import { ResponseContextProvider } from './context/ResponseContext.jsx'
import { ErrorContextProvider } from './context/ErrorContext.jsx'

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
      path: '/chats/group/:groupid',
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
          <SidebarContextProvider>
            <LoadingContextProvider>
              <ResponseContextProvider>
                <ErrorContextProvider>
          <RouterProvider router={router} />
          </ErrorContextProvider>
          </ResponseContextProvider>
          </LoadingContextProvider>
          </SidebarContextProvider>
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
