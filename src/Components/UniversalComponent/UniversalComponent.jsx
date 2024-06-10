import React from 'react';
import '../UniversalComponent/UniversalComponent.scss';


function UniversalComponent(props) {
    return (
        <div className='all-title'>
            <div className='title-name'> {props.name}</div>
        </div>
    )
}

export default UniversalComponent;




