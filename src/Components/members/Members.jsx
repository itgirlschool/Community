import React from 'react';
import './../members/Members.scss'


function Members(props) {


    return (
        <div className="all-members">
            <div className="member-name">{props.lastName} {props.firstName} </div>
            <div className='member-id'>{props.id}</div>
        </div>
    )

}

export default Members;