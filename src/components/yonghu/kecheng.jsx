import React,{Component} from 'react'
import { Breadcrumb,Input,Table,Button,Space,message,Tag} from 'antd';
import '../../assets/globel.css'
import Highlighter from 'react-highlight-words';
import { HomeOutlined, SearchOutlined,CloseCircleOutlined,VideoCameraFilled,FilePptOutlined } from '@ant-design/icons';
import Axios from 'axios';
export default class Kecheng extends Component{
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
     Axios.get(`http://118.178.125.139:8060/guest/case/findAll?page=${p}&size=${s}`)
     .then(function(response){
      const resp=response.data.extended.CaseLibrarys.content;
      that.setState({
        data:resp,
        total:response.data.extended.CaseLibrarys.totalElements
      })
     })  
     .catch(function(error){
      message.info('获取课程列表失败...')
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
      dataIndex: 'cid',
      key: 'cid',
      width: '10%',
      ...this.getColumnSearchProps('cid'),
    },
    {
      title: '课程名称',
      dataIndex: 'case_library_title',
      key: 'case_library_title',
      width: '20%',
      ...this.getColumnSearchProps('case_library_title'),
    },
    {
      title: '详细',
      dataIndex: 'case_library_destination',
      key: 'case_library_destination',
      width: '20%',
      ...this.getColumnSearchProps('case_library_destination'),
    },
    {
      title: '创建时间',
      dataIndex: 'case_library_time',
      key: 'case_library_time',
      ...this.getColumnSearchProps('case_library_time'),
    },
    {
        title: '课程视频',
        key:'case_library_video',
        dataIndex:'case_library_video',
        render:function(case_library_video){
          if(case_library_video!==''){
            return (
            <Button  type="primary" shape="round" icon={<VideoCameraFilled />} size={'middle'}  onClick={()=>{
              window.open(`http://118.178.125.139:8060${case_library_video}`)
            }}>下载</Button>
            )
          
          }
          else{
            
            return (
              <Tag icon={<CloseCircleOutlined />}  color={'volcano'}>暂无资源</Tag>
            
            )
          }
           
           
        }
      },
      {
        title: '课程PPT',
        key:'case_library_text',
        dataIndex:'case_library_text',
        render:function(case_library_text){
          if(case_library_text!==''){
            return (
            <Button  type="primary" shape="round" icon={<FilePptOutlined />} size={'middle'}  onClick={()=>{
              window.open(`http://118.178.125.139:8060${case_library_text}`)
            }}>下载</Button>
            )
          
          }
          else{
            
            return (
              <Tag icon={<CloseCircleOutlined />}  color={'volcano'}>暂无资源</Tag>
            
            )
          }
           
           
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
    pageSizeOptions:[1,2,3,5,10],
    onChange: (current,pageSize) => this.onChange(current,pageSize),
  
}

//结束
        return(
            <div className='neirong'>
     <Breadcrumb>           
    <Breadcrumb.Item><HomeOutlined/></Breadcrumb.Item>
    <Breadcrumb.Item>课程</Breadcrumb.Item>
    <Breadcrumb.Item>课程列表</Breadcrumb.Item>
  </Breadcrumb>
        <Table columns={columns} dataSource={this.state.data} className='table' pagination={paginationProps}  />
            </div>
        )
    }
}
