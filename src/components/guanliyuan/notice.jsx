import React, { Component } from 'react'
import { Breadcrumb, Input, Table, Button, Space, message, Modal, Form} from 'antd';
import '../../assets/globel.css'
import Highlighter from 'react-highlight-words';
import { HomeOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import Axios from 'axios';
const { TextArea } = Input;
export default class Notice extends Component {
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
       url:`http://118.178.125.139:8060/admin/notice/add?notice_destination=${values.content}&notice_title=${values.title}`,
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
 EditItem=(nid)=>{   
    const that=this
    
    //id查询回复信息渲染到表单
     Axios({
       url:`http://118.178.125.139:8060/admin/notice/findById?id=${nid}`,
       method:'get',
       headers: {
              'token': window.sessionStorage.getItem('token'),
            }
      }).then(function(response){
        
        const res=response.data.extended.notice
        console.log(res)
    
       that.setState({
        Editvisible:true
       })
       that.EditformRef.current.setFieldsValue({
          "EditItemTitle":res.notice_title,
        "EditItemId" :res.nid,
        "EditItemContent":res.notice_destination
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
      url:`http://118.178.125.139:8060/admin/notice/update?id=${values.EditItemId}&notice_destination=${values.EditItemContent}&notice_title=${values.EditItemTitle}`,
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
 delItem(nid){
    const that=this
    Modal.confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该公告, 是否继续?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
      
        Axios({
          url:`http://118.178.125.139:8060/admin/notice/deleteById?id=${nid}`,
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
  
    Axios.get(`http://118.178.125.139:8060/admin/notice/findAll?page=${p}&size=${s}`,
      {
        headers: {
          'token': window.sessionStorage.getItem('token')
        }
      }
    )
     .then(function(response){
        that.setState({
            data:response.data.extended.notices.content
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
        title: '公告ID',
        dataIndex: 'nid',
        key: 'nid',
        width: '10%',
        ...this.getColumnSearchProps('nid'),
      },
      {
        title: '标题',
        dataIndex: 'notice_title',
        key: 'notice_title',
        width: '20%',
        ...this.getColumnSearchProps('notice_title'),
      },
      {
        title: '公告内容',
        dataIndex: 'notice_destination',
        key: 'notice_destination',
        width: '40%',
        ...this.getColumnSearchProps('notice_destination'),
      },
      {
        title: '创建时间',
        dataIndex: 'notice_time',
        key: 'notice_time',
        width: '10%',
        ...this.getColumnSearchProps('notice_time'),
      },
      {
        title: '操作',
        key: 'nid',
        width: '20%',
        dataIndex: 'nid',
        render: (nid)=>{
          const that=this
          return (
            <div>
              <Button icon={<EditOutlined />} type="default" className='actBtn' onClick={()=>{
                that.EditItem(nid)}}></Button>
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
                <Form.Item name="EditItemId" 
              label='公告信息ID'
              className="edID"
            >
              <Input disabled={true}  />
            </Form.Item>

            <Form.Item name="EditItemTitle" rules={[
              {
                required: true,
                message: '请输入公告题目' 
              }
            ]}
              label='标题'
            >
              <Input />
            </Form.Item>
            <Form.Item name="EditItemContent" rules={[
              {
                required: true,
                message: '请输公告信息'
              }
            ]}
              label='公告'
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
                that.delItem(nid)}}></Button>
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
          <Breadcrumb.Item>问题信息管理</Breadcrumb.Item>
          <Breadcrumb.Item>信息列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 添加公告 */}
        <Button type='primary' icon={<PlusOutlined />} onClick={this.AddshowModal}>添加</Button>
        <Modal
          title="添加公告"
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
                message: '请输入公告题目'
              }
            ]}
              label='标题'
            >
        <Input/>
            </Form.Item>
            <Form.Item name="content" rules={[
              {
                required: true,
                message: '请输入公告信息'
              }
            ]}
              label='公告'
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
