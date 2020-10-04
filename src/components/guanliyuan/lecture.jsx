import React, { Component } from 'react'
import { Breadcrumb, Input, Table, Button, Space, message, Modal, Form} from 'antd';
import '../../assets/globel.css'
import Highlighter from 'react-highlight-words';
import { HomeOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import Axios from 'axios';
const { TextArea } = Input;
export default class Lecture extends Component {
  AddformRef = React.createRef();
  EditformRef=React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      Addvisible: false,
      Editvisible: false,
     

    };
  }

  //添加表单提交函数
  onFinish = values=> {
    const that=this
    Axios({
       url:`http://118.178.125.139:8060/admin/lecture/add?lecture_destination=${values.content}&lecture_title=${values.title}`,
       method:'post',
       headers: {
              'token': window.sessionStorage.getItem('token'),
            }
  
      }).then(function (response) {
        message.success('添加成功!!!')
        that.setState({
          Addvisible: false,
        })
        that.getData((that.state.page - 1), that.state.pageSize);
        //表单重置
that.AddformRef.current.resetFields();
      })
      .catch(function (error) {
        message.error('添加公告失败...')
        console.log(error)
      })

  }
  //添加按钮触发的模态框
  AddshowModal = () => {
    this.setState({
      Addvisible: true,
    });
  };
//取消添加
  AddCancel = () => {
    //表单重置
    this.AddformRef.current.resetFields();
    this.setState({
      Addvisible: false,
    });

  };
  // 编辑功能
 EditItem=(lid)=>{   
    const that=this
    
    //id查询回复信息渲染到表单
     Axios({
       url:`http://118.178.125.139:8060/admin/lecture/findById?id=${lid}`,
       method:'get',
       headers: {
              'token': window.sessionStorage.getItem('token'),
            }
      }).then(function(response){
        
        const res=response.data.extended.Lecture
        console.log(res)
    
       that.setState({
        Editvisible:true
       })
       that.EditformRef.current.setFieldsValue({
          "EditItemTitle":res.lecture_title,
        "EditItemId" :res.lid,
        "EditItemContent":res.lecture_destination
       })
      })
      .catch(function(error){
        console.log(error)
      }) 
  }
  //编辑表单提交函数
  EditonFinish=values=>{
    const that=this
    Axios({
      url:`http://118.178.125.139:8060/admin/lecture/update?id=${values.EditItemId}&lecture_destination=${values.EditItemContent}&lecture_title=${values.EditItemTitle}`,
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
   that.getData((that.state.page - 1), that.state.pageSize);
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
 delItem(lid){
    const that=this
    Modal.confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该讲座信息, 是否继续?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
      
        Axios({
          url:`http://118.178.125.139:8060/admin/lecture/deleteById?id=${lid}`,
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
  //加载页面数据函数
  getData(p, s) {
    const that = this;
  
    Axios.get(`http://118.178.125.139:8060/admin/lecture/findAll?page=${p}&size=${s}`,
      {
        headers: {
          'token': window.sessionStorage.getItem('token')
        }
      }
    )
     .then(function(response){
        that.setState({
            data:response.data.extended.Lectures.content
        })    
     })
  }
  //分页器change函数
  onChange(current, pageSize) {
    this.setState({
      page: current,
      pageSize: pageSize
    })
  }
  componentDidMount() {
    this.getData((this.state.page - 1), this.state.pageSize);
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  }
  //table表单
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };


  //表单结束
  render() {
    //表单头项目
    const columns = [
      {
        title: '#ID',
        dataIndex: 'lid',
        key: 'lid',
        width: '10%',
        ...this.getColumnSearchProps('lid'),
      },
      {
        title: '讲座主题',
        dataIndex: 'lecture_title',
        key: 'lecture_title',
        width: '25%',
        ...this.getColumnSearchProps('lecture_title'),
      },
      {
        title: '介绍',
        dataIndex: 'lecture_destination',
        key: 'lecture_destination',
        width: '40%',
        ...this.getColumnSearchProps('lecture_destination'),
      },
      {
        title: '开讲时间',
        dataIndex: 'lecture_time',
        key: 'lecture_time',
        width: '10%',
        ...this.getColumnSearchProps('lecture_time'),
      },
      {
        title: '操作',
        key: 'lid',
        width: '15%',
        dataIndex: 'lid',
        render: (lid)=>{
          const that=this
          return (
            <div>
              <Button icon={<EditOutlined />} type="default" className='actBtn' onClick={()=>{
                that.EditItem(lid)}}></Button>
            {/* 编辑信息的模态框 */}
            <Modal
          title="编辑讲座信息"
          visible={that.state.Editvisible}
          width={800}
          footer={[]}
          closable={false}


        >
          <Form
            onFinish={that.EditonFinish}
            ref={that.EditformRef}
          >
                <Form.Item name="EditItemId" 
              label='讲座信息ID'
              className="edID"
            >
              <Input disabled={true} />
            </Form.Item>

            <Form.Item name="EditItemTitle" rules={[
              {
                required: true,
                message: '请输入讲座主题题' 
              }
            ]}
              label='主题'
            >
              <Input />
            </Form.Item>
            <Form.Item name="EditItemContent" rules={[
              {
                required: true,
                message: '请输详细信息'
              }
            ]}
              label='介绍'
            >
              <TextArea  autoSize />
              </Form.Item>
            <Form.Item>
              <Button onClick={that.editCancel} type="default" className="mod">取消</Button>
              <Button type="primary" htmlType="submit" className="mod">提交</Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* 结束 */}
              <Button icon={<DeleteOutlined />} danger className='actBtn' onClick={()=>{
                that.delItem(lid)}}></Button>
            </div>
          )

        }
      },

    ];
    //结束
    //分页器

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => `共${this.state.total}条`,
      pageSize: this.state.pageSize,
      current: this.state.page,
      total: this.state.total,
      pageSizeOptions: [1, 2, 3, 5, 10],
      onChange: (current, pageSize) => this.onChange(current, pageSize),

    }

    //结束
    return (
      <div className='neirong'>
        <Breadcrumb>
          <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
          <Breadcrumb.Item>讲座信息管理</Breadcrumb.Item>
          <Breadcrumb.Item>信息列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 添加信息 */}
        <Button type='primary' icon={<PlusOutlined />} onClick={this.AddshowModal}>添加</Button>
        <Modal
          title="添加讲座信息"
          visible={this.state.Addvisible}
          width={800}
          footer={[]}
          closable={false}


        >
          <Form
            onFinish={this.onFinish}
            ref={this.AddformRef}

          >
            <Form.Item name="title" rules={[
              {
                required: true,
                message: '请输入讲座主题'
              }
            ]}
              label='主题'
            >
        <Input/>
            </Form.Item>
            <Form.Item name="content" rules={[
              {
                required: true,
                message: '请输入讲座信息'
              }
            ]}
              label='介绍'
            >
              <TextArea  autoSize />
              </Form.Item>
            <Form.Item>
              <Button onClick={this.AddCancel} type="default" className="mod">取消</Button>
              <Button type="primary" htmlType="submit" className="mod">提交</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table columns={columns} dataSource={this.state.data} className='table' pagination={paginationProps}/>
      </div>
    )
  }
}
