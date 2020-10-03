import React,{Component} from 'react'
import {Card,Breadcrumb, message} from 'antd'
import Axios from 'axios';
import '../../assets/globel.css'
import { HomeOutlined} from '@ant-design/icons';
export default class Jianjie extends Component{
    constructor(props)
    { 
      super(props);
      this.state = {
        Introduce:{}
      };
    }
    getData(){
    const that=this;
    Axios.get('http://118.178.125.139:8060/guest/introduce/find')
    .then(function(response){
        that.setState({
            Introduce:response.data.extended.Introduce
        })
        
    })
    .catch(function(error){
        message.info('获取课程简介失败...')
    })
    }
    componentDidMount(){
        this.getData();
    }
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
      }
    render(){
        
        return(
            <div className='neirong'>
            <Breadcrumb>           
           <Breadcrumb.Item><HomeOutlined/></Breadcrumb.Item>
           <Breadcrumb.Item>课程简介</Breadcrumb.Item>
           <Breadcrumb.Item>简介信息</Breadcrumb.Item>
         </Breadcrumb>
         <Card title={this.state.Introduce.introduce_title}  style={{ width:'90vw'}} headStyle={{fontSize:'2vw'}}>
        <h2 style={{textAlign:'justify'}}>{this.state.Introduce.introduce_destination}</h2>
         </Card>
            </div>
        )
    }
}