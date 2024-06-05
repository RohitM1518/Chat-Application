import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMessageContext } from '../context/MessageContext'

const Group = ({ group }) => {
    const currentUser = useSelector(state=>state?.user?.currentUser)
    const [lastMessage,setLastMessage] = useState(null)
    const {messages} = useMessageContext()

    console.log("Group ",group)
    useEffect(()=>{
        if(group?.lastMessage){
            setLastMessage(group.lastMessage)
        }
    },[group,messages])
    return (
        <div className=' border-2 flex justify-start items-center p-1 rounded-lg border-blue-400 gap-5' >
            <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                <div className="avatar">
                    <div className="w-12">
                        <img src={group.participants[0].avatar} />
                    </div>
                </div>
                <div className="avatar">
                    <div className="w-12">
                        <img src={group.participants[0].avatar} />
                    </div>
                </div>
                <div className="avatar placeholder">
                    <div className="w-12 text-neutral-content bg-slate-300">
                        +<span>{group.participants.length - 2}</span>
                    </div>
                </div>
            </div>
            <div>
            <div>
            <h2 className=' text-white text-lg font-semibold block'>{group?.name}</h2>
            </div>
            {lastMessage && <div>
          <h3 className=' text-white text-sm opacity-65'>{lastMessage?.sender?._id == currentUser?._id?"You: ":lastMessage?.sender?.fullName+": "}{lastMessage?.content}</h3>
        </div>}
            </div>
        </div>
    )
}

export default Group