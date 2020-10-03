import React,{Component} from 'react'
import '../../../assets/globel.css'
import bg from '../../../assets/bg.jpg'
export default class Bg extends Component{
   
      render(){
       
        return(
            <div>
                <img src={bg} alt='bg'  className='bgImg'/>
            </div>
        )
      }
 
}