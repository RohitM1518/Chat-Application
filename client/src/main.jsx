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
import { ChatContextProvider } from './context/ChatContext.jsx'
import AuthLayout from './components/AuthLayout.jsx'
const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    {
      path: '/',
      element: 
      <AuthLayout authentication={false}>
      <Home />
      </AuthLayout>
    },
    {
      path: '/signup',
      element: 
      <AuthLayout authentication={false}>
      <SignUp />
      </AuthLayout>
    },
    {
      path: '/signin',
      element: 
      <AuthLayout authentication={false}>
      <SignIn />
      </AuthLayout>
    },
    {
      path: '/chats/:id',
      element: 
      <AuthLayout>
      <ChatPage />
      </AuthLayout>
    },
    {
      path: '/chats/group/:groupid',
      element: 
      <AuthLayout>
      <ChatPage />
      </AuthLayout>
    },
    {
      path: '/chats',
      element: 
      <AuthLayout>
      <NoChatSelected />
      </AuthLayout>
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
                <ChatContextProvider>
          <RouterProvider router={router} />
          </ChatContextProvider>
          </ErrorContextProvider>
          </ResponseContextProvider>
          </LoadingContextProvider>
          </SidebarContextProvider>
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
