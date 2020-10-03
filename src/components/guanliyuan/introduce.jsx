import React, { Component } from 'react'
import { Card } from 'antd';
import Axios from 'axios';
import { Button,message,Modal,Form,Input } from 'antd';
import { FormOutlined,DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import '../../assets/globel.css'
const { TextArea } = Input;
export default class Introduce extends Component {
    EditformRef=React.createRef();
    constructor(props){
        super(props)
        this.state={
            data:{},
            Editvisible: false,
        }
    }
    getData(){
        const that=this
        Axios({
            url:'http://118.178.125.139:8060/admin/introduce/find',
            method:'get',
            headers: {
                   'token': window.sessionStorage.getItem('token'),
                 }
           }).then(function(response){
             that.setState({
                 data: response.data.extended.Introduce
             })
           console.log(that.state.data);
           })
           .catch(function(error){

           })
    }
// 编辑功能
EditItem=()=>{   
  const that=this
            setTimeout(()=>{
                that.EditformRef.current.setFieldsValue({
                    "EditItemTitle":that.state.data.introduce_title,
                  "EditItemContent":that.state.data.introduce_destination
                         })
            },100)   
         that.setState({
             Editvisible:true
         })
         
      
  }
  //编辑表单提交函数
  EditonFinish=values=>{
    const that=this
    Axios({
      url:`http://118.178.125.139:8060/admin/introduce/update?id=${that.state.data.iid}&introduce_destination=${values.EditItemContent}&introduce_title=${values.EditItemTitle}`,
      method:'post',
      headers: {
             'token': window.sessionStorage.getItem('token'),
           }
     }).then(function(response){
   //表单重置
   that.EditformRef.current.resetFields();
   that.setState({
     Editvisible: false,
   });
   that.getData();
      message.success('修改成功!!!')
      
     })
     .catch(function(error){
       message.error('修改失败...')
       console.log(error)
     })
    
  }
  //取消编辑
  editCancel=()=>{
     //表单重置
     this.EditformRef.current.resetFields();
     message.info('已取消该操作') 
     this.setState({
       Editvisible: false,
     });
     
  }
//删除
delItem(){
    const that=this
    Modal.confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该课程简介, 是否继续?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
      
        Axios({
          url:`http://118.178.125.139:8060/admin/introduce/deleteById?id=${that.state.data.iid}`,
          method:'delete',
          headers: {
                 'token': window.sessionStorage.getItem('token'),
               }
     
         }).then(function(response){
           message.success('删除成功!!!')
           that.getData((that.state.page - 1), that.state.pageSize);
         })
         .catch(function(error){
           console.log(error)
           message.error('删除失败...')
         })
      },
      onCancel(){
      message.info('已取消该操作')  
      }
    });
  }
componentDidMount(){
    this.getData()
}    
    
    render() {
        const that=this
        return (
            <div>
            <Card title={that.state.data.introduce_title} bordered={false} style={{ width: 1000 }} hoverable="true">
          <p>{that.state.data.introduce_destination}</p>
           <Button type="primary" shape="circle" icon={<FormOutlined />} className="actBtn" onClick={()=>{
               that.EditItem()
           }} />
             {/* 编辑公告的模态框 */}
             <Modal
          title="编辑公告"
          visible={that.state.Editvisible}
          width={800}
          footer={[]}
          closable={false}


        >
          <Form
            onFinish={that.EditonFinish}
            ref={that.EditformRef}
          >
               

            <Form.Item name="EditItemTitle" rules={[
              {
                required: true,
                message: '课程简介标题' 
              }
            ]}
              label='标题'
            >
              <Input  value={that.state.data.EditItemTitle}/>
            </Form.Item>
            <Form.Item name="EditItemContent" rules={[
              {
                required: true,
                message: '请输简介信息'
              }
            ]}
              label='简介'
            >
              <TextArea value={that.state.data.EditItem}  autoSize />
              </Form.Item>
            <Form.Item>
              <Button onClick={that.editCancel} type="default" className="mod">取消</Button>
              <Button type="primary" htmlType="submit" className="mod">提交</Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* 结束 */}
           <Button type="primary" shape="circle" icon={<DeleteOutlined />} danger onClick={()=>{
                that.delItem()}}/>
            </Card>
            </div>
        )
    }

}