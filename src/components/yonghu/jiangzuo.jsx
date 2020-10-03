import React,{Component} from 'react'
import { Breadcrumb,Input,Table,Button,Space,message} from 'antd';
import '../../assets/globel.css'
import Highlighter from 'react-highlight-words';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import Axios from 'axios';
export default class Jiangzuo extends Component{
  constructor(props)
  { 
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      data:[],
      page:1,
      pageSize:10,
      total:0,
    };
  }
  getData(p,s){
    const that =this;
     Axios.get(`http://118.178.125.139:8060/guest/lecture/findAll?page=${p}&size=${s}`)
     .then(function(response){
      const resp=response.data.extended.Lectures.content;
      that.setState({
        data:resp,
        total:response.data.extended.Lectures.totalElements
      })
     })  
     .catch(function(error){
      message.info('获取讲座列表失败...')
     }) 
  }
  onChange(current,pageSize){
    this.setState({
      page:current,
      pageSize:pageSize
    })
  }
      componentDidMount(){
     this.getData((this.state.page-1),this.state.pageSize);
      }
      // componentDidUpdate(){
      //  this.getData((this.state.page-1),this.state.pageSize)
      // }
componentWillUnmount = () => {
  this.setState = (state,callback)=>{
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
   render(){
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
      title: '讲座课题',
      dataIndex: 'lecture_title',
      key: 'lecture_title',
      width: '20%',
      ...this.getColumnSearchProps('lecture_title'),
    },
    {
      title: '介绍',
      dataIndex: 'lecture_destination',
      key: 'lecture_destination',
      width: '50%',
      ...this.getColumnSearchProps('lecture_destination'),
    },
    {
      title: '开始时间',
      dataIndex: 'lecture_time',
      key: 'lecture_time',
      width:'20%',
      ...this.getColumnSearchProps('lecture_time'),
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
    pageSizeOptions:[1,2,3,5,10],
    onChange: (current,pageSize) => this.onChange(current,pageSize),
  
}

//结束
        return(
            <div className='neirong'>
     <Breadcrumb>           
    <Breadcrumb.Item><HomeOutlined/></Breadcrumb.Item>
    <Breadcrumb.Item>讲座</Breadcrumb.Item>
    <Breadcrumb.Item>讲座列表</Breadcrumb.Item>
  </Breadcrumb>
        <Table columns={columns} dataSource={this.state.data} className='table' pagination={paginationProps}  />
            </div>
        )
    }
}
