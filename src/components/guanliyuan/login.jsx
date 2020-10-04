import React, { Component } from 'react'
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Login_logo from '../../assets/logo.svg'
import Axios from 'axios';

export default class Login extends React.Component {
    formRef = React.createRef();
    onFinish =values => {
        Axios.post(`http://118.178.125.139:8060/adminLogin?password=${values.password}&username=${values.username}`)
            .then((resp) => {
                window.sessionStorage.setItem('token', resp.data.extended.token);

                this.props.history.push('/admin')
                message.success('登录成功!!!')
            })
            .catch((erro) => {
                message.error('登录失败...')
            })
    };

    onReset = () => {
        this.formRef.current.resetFields();
      };

      componentDidMount() {
  
     if(window.sessionStorage.getItem('token')!==null)
     {
         message.info("您已经登入管理系统!!!")
        this.props.history.push('/admin')
     }
    }

    render() {

        return (
            <div className="login_container">
                <div className='avatar_box'>
                    <img src={Login_logo} className='login_logo' alt='login_logo' />
                </div>
                <Card className='login_box' title='管理员'>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        ref={this.formRef}
                        >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '长度在3-5',
                                    min:3,
                                    max:5
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button sub">
                                登录
              </Button>
                            <Button htmlType="button" onClick={this.onReset} className="login-form-button res">
                                重置
            </Button>
                        </Form.Item>
                    </Form>


                </Card>
            </div>
        )
    }

}

