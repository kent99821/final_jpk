import React, { Component } from 'react'
import { Button, Layout, Menu } from 'antd';
import {  
  TeamOutlined, 
  VideoCameraOutlined,
  LogoutOutlined,
  PullRequestOutlined,
  QuestionCircleOutlined,
  NotificationOutlined,
  ReadOutlined,
  ContactsOutlined,
  UngroupOutlined ,
  GlobalOutlined


} from '@ant-design/icons';
import '../../assets/houtai.css'
import Welcome from './welcome'
import Answer from './answer'
import Question from './question'
import Notice from './notice'
import OnlineTest from './onlinetest'
import Practice from './practice'
import Introduce from './introduce'
import OnlineClass from './onlineclass'
import Lecture from './lecture'
import Case from './case'
import {Switch,Redirect,Link} from 'react-router-dom'
import MyRoute from './myRouter'
const { Header, Content,  Sider } = Layout;
export default class admin extends Component {
    state = {
        collapsed: false,
      };
    
      toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      };
      logout=()=>{
        
        window.sessionStorage.clear();
        this.props.history.push('/home/main')

      }
    render() {
        return (
        
            <Layout className='houtaihome'>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={broken => {
                
              }}
              onCollapse={(collapsed, type) => {
                
              }}
            >
              <div className="logo"/>
              <Menu theme="dark" mode="inline" >
            
                <Menu.Item key="1" icon={<PullRequestOutlined />}>
                <Link to={{pathname:'/admin/answer'}}>互动交流回复管理</Link>  
                </Menu.Item>
                <Menu.Item key="2" icon={<QuestionCircleOutlined />}>
                <Link to={{pathname:'/admin/question'}}>互动交流问题管理</Link>  
                </Menu.Item>
                <Menu.Item key="3" icon={<NotificationOutlined />}>
                <Link to={{pathname:'/admin/notice'}}>公告信息管理</Link>  
                </Menu.Item>
                <Menu.Item key="4" icon={<GlobalOutlined />}>
                 <Link to={{pathname:'/admin/onlinetest'}}>在线测评管理</Link>  
                </Menu.Item>
                <Menu.Item key="5" icon={<ContactsOutlined />}>
                 <Link to={{pathname:'/admin/practice'}}>实践教学管理</Link>  
                </Menu.Item>
                <Menu.Item key="6" icon={<UngroupOutlined />}>
                <Link to={{pathname:'/admin/introduce'}}>简介信息管理</Link>  
                </Menu.Item>
                <Menu.Item key="7" icon={<VideoCameraOutlined />}>
                  <Link to={{pathname:'/admin/onlineclass'}}>网络课管理</Link>  
                </Menu.Item>
                <Menu.Item key="8" icon={<TeamOutlined />}>
                <Link to={{pathname:'/admin/lecture'}}>讲座信息管理</Link>  
                </Menu.Item>
                <Menu.Item key="9" icon={<ReadOutlined />}>
                <Link to={{pathname:'/admin/case'}}>课程管理</Link>  
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header className="site-layout-sub-header-background" style={{ padding: 0 }} >
              <h2 className='glxt'>管理系统</h2>
              <Button type='primary' className='logout' onClick={this.logout} danger><LogoutOutlined />登出</Button>
              </Header>
              <Content style={{ margin: '10px 10px 0' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
      <Switch>
  <MyRoute path='/admin/welcome' component={Welcome}></MyRoute>
  <MyRoute path='/admin/answer' component={Answer}></MyRoute>
  <MyRoute path='/admin/question' component={Question}></MyRoute>
  <MyRoute path='/admin/notice' component={Notice}></MyRoute>
  <MyRoute path='/admin/onlinetest' component={OnlineTest}></MyRoute>
  <MyRoute path='/admin/practice' component={Practice}></MyRoute>
  <MyRoute path='/admin/introduce' component={Introduce}></MyRoute>
  <MyRoute path='/admin/onlineclass' component={OnlineClass}></MyRoute>
  <MyRoute path='/admin/lecture' component={Lecture}></MyRoute>
  <MyRoute path='/admin/case' component={Case}></MyRoute>
  <Redirect path='/admin/' to='/admin/welcome'/>
  </Switch>
                </div>
              </Content>
            </Layout>
          </Layout>  
    
        )
    }

}