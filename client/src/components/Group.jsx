import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMessageContext } from '../context/MessageContext'
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useChatModification } from '../context/ChatModificationContext';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Group = ({ group }) => {
    const currentUser = useSelector(state=>state?.user?.currentUser)
    const [lastMessage,setLastMessage] = useState(null)
    const {setModification }= useChatModification()
    const {messages} = useMessageContext()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleAdd=()=>{
        setModification('add')
        handleClose()
    }
    const handleRemove=()=>{
        setModification('remove')
        handleClose()
    }
    const handleExit=()=>{
        setModification('exit')
        handleClose()
    }
    const handleDelete=()=>{
        setModification('delete')
        handleClose()
    }
    const handleCloseDropDown=()=>{
        setModification('')
        handleClose()
    }
    const handleClose = () => {
      setAnchorEl(null);
    };
    console.log("Group ",group)
    useEffect(()=>{
        if(group?.lastMessage){
            setLastMessage(group.lastMessage)
        }
    },[group,messages])
    return (
        <div className=' border-2 flex justify-start items-center p-1 rounded-lg border-blue-400 gap-5 hover:bg-slate-700' >
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
            <div className=' flex justify-between'>
            <div>
            <h2 className=' text-white text-lg font-semibold block'>{group?.name}</h2>
            </div>
            <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
    <MoreVertIcon color='action' sx={{ fontSize: 27, '&:hover':{ color:'white'},color:'white' }}/>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ color:'black'}}
      >
        <MenuItem onClick={handleAdd} >Add Participant</MenuItem>
        <MenuItem onClick={handleRemove} >Remove Participant</MenuItem>
        <MenuItem onClick={handleExit} >Exit Group</MenuItem>
        <MenuItem onClick={handleDelete} >Delete Group</MenuItem>
        <MenuItem onClick={handleCloseDropDown}  ><CloseIcon /></MenuItem>
      </Menu>
    </div>
            </div>
            {lastMessage && <div>
          <h3 className=' text-white text-sm opacity-65'>{lastMessage?.sender?._id == currentUser?._id?"You: ":lastMessage?.sender?.fullName+": "}{lastMessage?.content}</h3>
        </div>}
            </div>
        </div>
    )
}

export default Group