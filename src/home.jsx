import React, { Component } from 'react'
import Bg from './components/yonghu/bg/bg'
import {Route,Switch,Link} from 'react-router-dom'
import { Menu } from 'antd';
import Main from './components/yonghu/main';
import Hudong from './components/yonghu/hudong';
import Zaixian from './components/yonghu/zaixian'
import Shijian from './components/yonghu/shijian'
import Jianjie from './components/yonghu/jianjie'
import  Wangluo from './components/yonghu/wangluo'
import Jiangzuo from './components/yonghu/jiangzuo'
import Kecheng from './components/yonghu/kecheng'
import Gonggao from './components/yonghu/gonggao'

export default class Home extends Component {
  state = {
    current: 'main',
  };
  handleClick = e => {
    this.setState({ current: e.key });
  };
 
render() {
  const { current } = this.state;
  return (
    <div>
      <div>
       <header>
       <Bg/>   
        </header>         
        <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
         <Menu.Item key="main"><Link to={{pathname:'/home/main'}}>首页</Link></Menu.Item>
        <Menu.Item key="hd"><Link to={{pathname:'/home/hudong'}}>互动交流</Link></Menu.Item>
        <Menu.Item key="zx"><Link to={{pathname:'/home/zaixian'}}>在线测评</Link> </Menu.Item>
        <Menu.Item key="sj"><Link to={{pathname:'/home/shijian'}}>实践教学</Link></Menu.Item>
        <Menu.Item key="jj"><Link to={{pathname:'/home/jianjie'}}>简介信息</Link></Menu.Item>
        <Menu.Item key="wl"><Link to={{pathname:'/home/wangluo'}}>网络课</Link></Menu.Item>
        <Menu.Item key="jz"><Link to={{pathname:'/home/jiangzuo'}}>讲座</Link></Menu.Item>
        <Menu.Item key="kc"><Link to={{pathname:'/home/kecheng'}}>课程</Link></Menu.Item>
        <Menu.Item key="gg"><Link to={{pathname:'/home/gonggao'}}>公告</Link></Menu.Item>
        <Menu.Item key="gl"><Link to={{pathname:'/login'}}>管理员入口</Link></Menu.Item>
        <Menu.Item key="gw"><a href="https://www.gdou.edu.cn/">广东海洋大学官方网站</a></Menu.Item>
      </Menu>
     
        <Switch>
        <Route path='/home/main' component={Main}></Route>
  <Route path='/home/hudong' component={Hudong}></Route>
  <Route path='/home/zaixian' component={Zaixian}></Route>
  <Route path='/home/shijian' component={Shijian}></Route>
  <Route path='/home/jianjie' component={Jianjie}></Route>
  <Route path='/home/wangluo' component={Wangluo}></Route>
  <Route path='/home/jiangzuo' component={Jiangzuo}></Route>
  <Route path='/home/kecheng' component={Kecheng}></Route>
  <Route path='/home/gonggao' component={Gonggao}></Route>  
        </Switch>
    
      </div>
    </div>
  )
}
}