import React, { Component } from 'react'
import '../../assets/houtai.css'
import wu_logo from '../../assets/wu.jpg'
import chen_logo from '../../assets/chen.jpg'
import lai_logo from '../../assets/lai.jpg'
export default class Welcome extends Component {
    render() {

        return (
            <div>
             <h1 className='welcomeHeader'>你好 管理员</h1>
             <div className='avatar3_box'>
                    <img src={wu_logo} className='login_logo' alt='login_logo' />
                    <h2>wu</h2>
                </div>
                <div className='avatar2_box'>
                <img src={chen_logo}  className='login_logo' alt="chen_logo"/>
                <h2>chen</h2>
                </div>
                <div className='avatar4_box'>
                <img src={lai_logo}  className='login_logo' alt="lai_logo"/>
                <h2>lai</h2>
                </div>
                   
            </div>
        )
    }

}