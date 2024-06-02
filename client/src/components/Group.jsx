import React from 'react'

const Group = ({ group }) => {
    return (
        <div>
            <div className="avatar-group -space-x-10 rtl:space-x-reverse">
                <div className="avatar">
                    <div className="w-12">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <div className="avatar">
                    <div className="w-12">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <div className="avatar placeholder">
                    <div className="w-12 text-neutral-content">
                        <span>+99</span>
                    </div>
                </div>
            </div>
            <h2>{group?.name}</h2>
        </div>
    )
}

export default Group