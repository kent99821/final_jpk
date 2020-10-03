import React,{Component} from 'react'
import { Breadcrumb,Input,Table,Button,Space,message} from 'antd';
import '../../assets/globel.css'
import Highlighter from 'react-highlight-words';
import { HomeOutlined, SearchOutlined} from '@ant-design/icons';
import Axios from 'axios';
export default class Zaixian extends Component{
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
    
     Axios.get(`http://118.178.125.139:8060/guest/interactionQuestion/findAll?page=${p}&size=${s}`)
     .then(function(response){
      const resp=response.data.extended.InteractionQuestions.content;
      const datass=[]
      for(var i=0;i<resp.length;i++)
      {
        var  datas={
          'qid':'',
          'interactionQuestion_title':'',
          'interactionAnswers':[],
          'interactionQuestion_time':''
        }
        datas.qid=resp[i].qid;
        datas.interactionQuestion_title=resp[i].interactionQuestion_title;
        datas.interactionQuestion_time=resp[i].interactionQuestion_time;
        
          for(var j=0;j<resp[i].interactionAnswers.length;j++)
          {
            datas.interactionAnswers.push(`回答${j+1}：`+resp[i].interactionAnswers[j].answer+" ")
          }
        
        datass.push(datas)
        
      }
      
      that.setState({
        data:datass,
        total:response.data.extended.InteractionQuestions.totalElements
      })
     })  
     .catch(function(error){
      message.error('获取问题列表失败...')
      console.log(error)
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
      dataIndex: 'qid',
      key: 'qid',
      width: '10%',
      ...this.getColumnSearchProps('qid'),
    },
    {
      title: '问题描述',
      dataIndex: 'interactionQuestion_title',
      key: 'interactionQuestion_title',
      width: '20%',
      ...this.getColumnSearchProps('interactionQuestion_title'),
    },
    {
      title: '问题回答',
      dataIndex: 'interactionAnswers',
      key: 'interactionAnswers',
      width:'60%',
      ...this.getColumnSearchProps('interactionAnswers'),
      
    },
    {
        title: '创建时间',
        dataIndex: 'interactionQuestion_time',
        key: 'interactionQuestion_time',
        width:'10%',
        ...this.getColumnSearchProps('interactionQuestion_time'),
       
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
    <Breadcrumb.Item>互动交流</Breadcrumb.Item>
    <Breadcrumb.Item>问题交流列表</Breadcrumb.Item>
  </Breadcrumb>
        <Table columns={columns} dataSource={this.state.data} className='table' pagination={paginationProps}  />
            </div>
        )
    }
}
