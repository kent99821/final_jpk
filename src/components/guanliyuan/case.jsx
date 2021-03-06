import React, { Component } from 'react'
import { Breadcrumb, Input, Table, Button, Space, message, Modal, Form, Tag, Upload } from 'antd';
import '../../assets/globel.css'
import Highlighter from 'react-highlight-words';
import {
    HomeOutlined,
    SearchOutlined,
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    FilePptOutlined,
    CloseCircleOutlined,
    DesktopOutlined,
    UploadOutlined

} from '@ant-design/icons';
import Axios from 'axios';
export default class Case extends Component {
    AddformRef = React.createRef();
    EditformRef = React.createRef();
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
            PPTfileList:[],
            VideofileList:[],
            uploading: false,
           //编辑表单数据
            EditPPTfileList:[],
            EditVideofileList:[],
            Edituploading:false,

        };
    }

    //添加表单提交函数
    onFinish = values => {
        const that = this
        const { PPTfileList,VideofileList } = that.state;
        const formData = new FormData();
        formData.append('case_library_destination', values.content);
        formData.append('case_library_title', values.title);
            formData.append('casePPT', PPTfileList[0]);
            formData.append('caseVideo',VideofileList[0]);
        
        that.setState({
            uploading: true,
        });
        Axios.post('http://118.178.125.139:8060/admin/case/add', formData,
            {
                headers: {

                    'token': window.sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }

            }).then(function (response) {
                message.success('添加成功!!!')
                that.setState({
                    Addvisible: false,
                    PPTfileList: [],
                    VideofileList:[],
                    uploading: false,
                })
                that.getData((that.state.page - 1), that.state.pageSize);
                //表单重置
                that.AddformRef.current.resetFields();
            })
            .catch(function (error) {
                message.error('添加课程信息失败...')
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
            uploading: false,
            PPTfileList: [],
            VideofileList:[],
        });

    };
    // 编辑功能
    EditItem = (cid) => {
        const that = this

        //id查询回复信息渲染到表单
        Axios({
            url: `http://118.178.125.139:8060/admin/case/findById?id=${cid}`,
            method: 'get',
            headers: {
                'token': window.sessionStorage.getItem('token'),
            }
        }).then(function (response) {

            const res = response.data.extended.CaseLibrary
console.log(res)
            that.setState({
                Editvisible: true
            })
            setTimeout(()=>{
                that.EditformRef.current.setFieldsValue({
                    "EditItemTitle": res.case_library_title,
                    "EditItemContent": res.case_library_destination,
                    "EditItemId":cid
                },100)
            })
        })
            .catch(function (error) {
                console.log(error)
            })
    }
    //编辑表单提交函数
    EditonFinish = values => {
        const that = this
        const { EditPPTfileList,EditVideofileList } = that.state;
        const EditformData = new FormData();
        EditformData.append('case_library_destination', values.EditItemContent);
        EditformData.append('case_library_title', values.EditItemTitle);
        EditformData.append('id',values.EditItemId)
        EditformData.append('casePPT', EditPPTfileList[0]);
        EditformData.append('caseVideo',EditVideofileList[0])
       
        that.setState({
            Edituploading: true,
        });
        Axios.post('http://118.178.125.139:8060/admin/case/update', EditformData,
            {
                headers: {

                    'token': window.sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }

            }).then(function (response) {
                message.success('修改成功!!!')
                that.setState({
                    Editvisible: false,
                    EditPPTfileList:[],
                    EditVideofileList:[],
                    Edituploading: false,
                })
                that.getData((that.state.page - 1), that.state.pageSize);
                //表单重置
                that.EditformRef.current.resetFields();
            })
            .catch(function (error) {
                message.error('添加测评信息失败...')
                console.log(error)
            })
    }
    //取消编辑
    editCancel = () => {
        //表单重置
        this.EditformRef.current.resetFields();
        message.info('已取消该操作')
        this.setState({
            Editvisible: false,
            EditPPTfileList:[],
            EditVideofileList:[],
        });

    }
    //删除
    delItem(cid) {
        const that = this
        Modal.confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined />,
            content: '此操作将永久删除该课程, 是否继续?',
            okText: '确认',
            cancelText: '取消',
            onOk() {

                Axios({
                    url: `http://118.178.125.139:8060/admin/case/deleteById?id=${cid}`,
                    method: 'delete',
                    headers: {
                        'token': window.sessionStorage.getItem('token'),
                    }

                }).then(function (response) {
                    message.success('删除成功!!!')
                    that.getData((that.state.page - 1), that.state.pageSize);
                })
                    .catch(function (error) {
                        console.log(error)
                        message.error('删除失败...')
                    })
            },
            onCancel() {
                message.info('已取消该操作')
            }
        });
    }
    //加载页面数据函数
    getData(p, s) {
        const that = this;

        Axios.get(`http://118.178.125.139:8060/admin/case/findAll?page=${p}&size=${s}`,
            {
                headers: {
                    'token': window.sessionStorage.getItem('token')
                }
            }
        )
            .then(function (response) {
              
                that.setState({
                    data: response.data.extended.CaseLibrarys.content
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
        const { uploading, PPTfileList,VideofileList} = this.state;
      //上传ppt文件属性
        const PPTprops = {
            onRemove: file => {
              this.setState(state => {
                const index = state.PPTfileList.indexOf(file);
                const newFileList = state.PPTfileList.slice();
                newFileList.splice(index, 1);
                return {
                  PPTfileList: newFileList,
                };
              });
            },
            beforeUpload: file => {
              this.setState(state => ({
                PPTfileList: [...state.PPTfileList, file],
              }));
              return false;
            },
            PPTfileList,
          };
    //上传视频文件属性
    const Videoprops = {
        onRemove: file => {
          this.setState(state => {
            const index = state.VideofileList.indexOf(file);
            const newFileList = state.VideofileList.slice();
            newFileList.splice(index, 1);
            return {
              VideofileList: newFileList,
            };
          });
        },
        beforeUpload: file => {
          this.setState(state => ({
            VideofileList: [...state.VideofileList, file],
          }));
          return false;
        },
        VideofileList,
      };
        //表单头项目
        const columns = [
            {
                title: '课程ID',
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
                title: '详细介绍',
                dataIndex: 'case_library_destination',
                key: 'case_library_destination',
                width: '30%',
                ...this.getColumnSearchProps('case_library_destination'),
            },

            {
                title: '创建时间',
                dataIndex: 'case_library_time',
                key: 'case_library_time',
                width: '10%',
                ...this.getColumnSearchProps('case_library_time'),
            },
            {
                title: '课程PPT',
                dataIndex: 'case_library_text',
                key: 'case_library_text',
                width: '10%',
                render: function (case_library_text) {
                    if (case_library_text !== '') {
                        return (
                            <Tag color="#87d068" icon={<FilePptOutlined />} onClick={() => {
                                window.open(`http://118.178.125.139:8060${case_library_text}`)
                            }}>下载</Tag>
                        )

                    }
                    else {

                        return (
                            <Tag icon={<CloseCircleOutlined />} color={'volcano'}>暂无资源</Tag>

                        )
                    }


                }
            },
            {
                title: '课程视频',
                dataIndex: 'case_library_video',
                key: 'case_library_video',
                width: '10%',
                render: function (case_library_video) {
                    if (case_library_video !== '') {
                        return (
                            <Tag color="#2db7f5" icon={<DesktopOutlined />} onClick={() => {
                                window.open(`http://118.178.125.139:8060${case_library_video}`)
                            }}>下载</Tag>
                        )

                    }
                    else {

                        return (
                            <Tag icon={<CloseCircleOutlined />} color={'volcano'}>暂无资源</Tag>

                        )
                    }


                }
            },
            {
                title: '操作',
                key: 'cid',
                width: '10%',
                dataIndex: 'cid',
                render: (cid) => {
                    
                    const that = this
                    const { Edituploading, EditPPTfileList,EditVideofileList} = that.state;
                     //上传ppt文件属性
        const EditPPTprops = {
            onRemove: file => {
              that.setState(state => {
                const index = state.EditPPTfileList.indexOf(file);
                const newFileList = state.EditPPTfileList.slice();
                newFileList.splice(index, 1);
                return {
                  EditPPTfileList: newFileList,
                };
              });
            },
            beforeUpload: file => {
              that.setState(state => ({
                EditPPTfileList: [...state.EditPPTfileList, file],
              }));
              return false;
            },
            EditPPTfileList,
          };
    //上传视频文件属性
    const EditVideoprops = {
        onRemove: file => {
          that.setState(state => {
            const index = state.EditVideofileList.indexOf(file);
            const newFileList = state.EditVideofileList.slice();
            newFileList.splice(index, 1);
            return {
              EditVideofileList: newFileList,
            };
          });
        },
        beforeUpload: file => {
          that.setState(state => ({
            EditVideofileList: [...state.EditVideofileList, file],
          }));
          return false;
        },
        EditVideofileList,
      };
                    return (
                        <div>
                            <Button icon={<EditOutlined />} type="default" className='actBtn' onClick={() => {
                                that.EditItem(cid)
                            }}></Button>
                            {/* 编辑信息的模态框 */}
                            <Modal
                                title="编辑测评"
                                visible={that.state.Editvisible}
                                width={800}
                                footer={[]}
                                closable={false}


                            >
                                <Form
                                    onFinish={that.EditonFinish}
                                    ref={that.EditformRef}
                                >
                                    <Form.Item name="EditItemId" label="评测ID" className="edID">
                                     <Input disabled='true' />
                                    </Form.Item>

                                    <Form.Item name="EditItemTitle" rules={[
                                        {
                                            required: true,
                                            message: '请输入试题标题'
                                        }
                                    ]}
                                        label='标题'
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="EditItemContent"
                                       rules={[
                                        {
                                            required: true,
                                            message: '请输入详细说明'
                                        }
                                    ]}
                                       label='试题说明'
                                    >
                                        <Input  />
                                    </Form.Item>
                                  
                    
                                    <Form.Item name="EditPPTfile"  label="课程PPT">
                        <Upload {...EditPPTprops} accept=".ppt,.pptx">
          <Button icon={<UploadOutlined />}>选取PPT</Button>
        </Upload>
                        </Form.Item>
                        <Form.Item name="EditVideofile"  label="课程视频">
                        <Upload {...EditVideoprops} accept=".mp4,.avi,.mpg,.mlv,.mpe,.mpeg">
          <Button icon={<UploadOutlined />}>选取视频</Button>
        </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={that.editCancel} type="default" className="mod">取消</Button>
                            <Button type="primary" htmlType="submit" className="mod"
                                disabled={EditPPTfileList.length !== 1||EditVideofileList.length!==1}
                                loading={Edituploading}
                            >提交</Button>
                        </Form.Item>
                                </Form>
                            </Modal>
                            {/* 结束 */}
                            <Button icon={<DeleteOutlined />} danger className='actBtn' onClick={() => {
                                that.delItem(cid)
                            }}></Button>
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
                    <Breadcrumb.Item>课程信息管理</Breadcrumb.Item>
                    <Breadcrumb.Item>信息列表</Breadcrumb.Item>
                </Breadcrumb>
                {/* 添加信息 */}
                <Button type='primary' icon={<PlusOutlined />} onClick={this.AddshowModal}>添加</Button>
                <Modal
                    title="添加课程信息"
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
                                message: '请输入课程名称'
                            }
                        ]}
                            label='课程名称'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="content" rules={[
                            {
                                required: true,
                                message: '请输入详细信息'
                            }
                        ]}
                            label='详细介绍'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="PPTfile"  label="课程PPT">
                        <Upload {...PPTprops} accept=".ppt,.pptx">
          <Button icon={<UploadOutlined />}>选取PPT</Button>
        </Upload>
                        </Form.Item>
                        <Form.Item name="Videofile"  label="课程视频">
                        <Upload {...Videoprops} accept=".mp4,.avi,.mpg,.mlv,.mpe,.mpeg">
          <Button icon={<UploadOutlined />}>选取视频</Button>
        </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.AddCancel} type="default" className="mod">取消</Button>
                            <Button type="primary" htmlType="submit" className="mod"
                                disabled={PPTfileList.length !==1 || VideofileList.length !==1}
                                loading={uploading}
                            >提交</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Table columns={columns} dataSource={this.state.data} className='table' pagination={paginationProps} />
            </div>
        )
    }
}
