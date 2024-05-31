import React from 'react'
import { UserList } from '../components'
import Chat from '../components/Chat'

const Main = () => {
  return (
    <div className=' flex h-screen'>
      <div>
        <UserList />
      </div>
      <div>
        <Chat />
      </div>
    </div>
  )
}

export default Main