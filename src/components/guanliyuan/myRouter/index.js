import React,{Fragment} from 'react'
import {Route,Redirect} from 'react-router-dom'
class MyRoute extends React.Component{
    render(){
        let{path,component:Com}=this.props;
        return(
            <Fragment>
                {
   sessionStorage.getItem('token')?<Route path={this.props.path} component={Com}/>:<Redirect to='/login'/>                 
                }
            </Fragment>
        )
    }
}
export default MyRoute;