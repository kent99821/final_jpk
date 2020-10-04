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
    DownloadOutlined,
    CloseCircleOutlined,
    InboxOutlined,

} from '@ant-design/icons';
import Axios from 'axios';
const { Dragger } = Upload;
export default class Onlinetest extends Component {
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
            fileList: [],
            uploading: false,
           //编辑表单数据
            EditfileList:[],
            Edituploading:false,

        };
    }

    //添加表单提交函数
    onFinish = values => {
        const that = this
        const { fileList } = that.state;
        const formData = new FormData();
        formData.append('onlineTest_destination', values.content);
        formData.append('onlineTest_title', values.title);
        fileList.forEach(file => {
            formData.append('testfile', file);
        });
        that.setState({
            uploading: true,
        });
        Axios.post('http://118.178.125.139:8060/admin/onlineTest/add', formData,
            {
                headers: {

                    'token': window.sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }

            }).then(function (response) {
                message.success('添加成功!!!')
                that.setState({
                    Addvisible: false,
                    fileList: [],
                    uploading: false,
                })
                that.getData((that.state.page - 1), that.state.pageSize);
                //表单重置
                that.AddformRef.current.resetFields();
            })
            .catch(function (error) {
                message.error('添加测评信息失败...')
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
            fileList:[]
        });

    };
    // 编辑功能
    EditItem = (oid) => {
        const that = this

        //id查询回复信息渲染到表单
        Axios({
            url: `http://118.178.125.139:8060/admin/onlineTest/findById?id=${oid}`,
            method: 'get',
            headers: {
                'token': window.sessionStorage.getItem('token'),
            }
        }).then(function (response) {

            const res = response.data.extended.OnlineTest

            that.setState({
                Editvisible: true
            })
            setTimeout(()=>{
                that.EditformRef.current.setFieldsValue({
                    "EditItemTitle": res.onlineTest_title,
                    "EditItemContent": res.onlineTest_destination,
                    "EditItemId":oid
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
        const { EditfileList } = that.state;
        const EditformData = new FormData();
        EditformData.append('onlineTest_destination', values.EditItemContent);
        EditformData.append('onlineTest_title', values.EditItemTitle);
        EditformData.append('id',values.EditItemId)
        EditfileList.forEach(file => {
            EditformData.append('testfile', file);
        });
        that.setState({
            Edituploading: true,
        });
        Axios.post('http://118.178.125.139:8060/admin/onlineTest/update', EditformData,
            {
                headers: {

                    'token': window.sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }

            }).then(function (response) {
                message.success('修改成功!!!')
                that.setState({
                    Editvisible: false,
                    EditfileList: [],
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
            EditfileList:[]
        });

    }
    //删除
    delItem(oid) {
        const that = this
        Modal.confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined />,
            content: '此操作将永久删除该测评, 是否继续?',
            okText: '确认',
            cancelText: '取消',
            onOk() {

                Axios({
                    url: `http://118.178.125.139:8060/admin/onlineTest/deleteById?id=${oid}`,
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

        Axios.get(`http://118.178.125.139:8060/admin/onlineTest/findAll?page=${p}&size=${s}`,
            {
                headers: {
                    'token': window.sessionStorage.getItem('token')
                }
            }
        )
            .then(function (response) {
                that.setState({
                    data: response.data.extended.OnlineTests.content
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
        const { uploading, fileList,EditfileList} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        const Editprops = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.EditfileList.indexOf(file);
                    const newFileList = state.EditfileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        EditfileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                 EditfileList: [...state.EditfileList, file],
                }));
                return false;
            },
        EditfileList,
        };
        //表单头项目
        const columns = [
            {
                title: '测评ID',
                dataIndex: 'oid',
                key: 'oid',
                width: '10%',
                ...this.getColumnSearchProps('oid'),
            },
            {
                title: '测评标题',
                dataIndex: 'onlineTest_title',
                key: 'onlineTest_title',
                width: '20%',
                ...this.getColumnSearchProps('onlineTest_title'),
            },
            {
                title: '详细介绍',
                dataIndex: 'onlineTest_destination',
                key: 'onlineTest_destination',
                width: '30%',
                ...this.getColumnSearchProps('onlineTest_destination'),
            },

            {
                title: '创建时间',
                dataIndex: 'onlineTest_time',
                key: 'onlineTest_time',
                width: '10%',
                ...this.getColumnSearchProps('onlineTest_time'),
            },
            {
                title: '试题',
                dataIndex: 'onlineTest_url',
                key: 'onlineTest_url',
                width: '10%',
                render: function (onlineTest_url) {
                    if (onlineTest_url !== '') {
                        return (
                            <Tag color="#87d068" icon={<DownloadOutlined />} onClick={() => {
                                window.open(`http://118.178.125.139:8060${onlineTest_url}`)
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
                key: 'oid',
                width: '20%',
                dataIndex: 'oid',
                render: (oid) => {

                    const that = this
                    return (
                        <div>
                            <Button icon={<EditOutlined />} type="default" className='actBtn' onClick={() => {
                                that.EditItem(oid)
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
                                    <Form.Item name="EditItemId" label="评测ID"  className="edID">
                                     <Input disabled='true'/>
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
                                        label='试题说明'
                                    >
                                        <Input  />
                                    </Form.Item>
                                  
                    
                        <Form.Item name="Editfile" >
                            <Dragger {...Editprops}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">点击或拉取文件到此区域上传</p>
                                <p className="ant-upload-hint">文件数量限制:1</p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={that.editCancel} type="default" className="mod">取消</Button>
                            <Button type="primary" htmlType="submit" className="mod"
                                disabled={that.state.EditfileList.length !== 1}
                                loading={that.state.Edituploading}
                            >提交</Button>
                        </Form.Item>
                                </Form>
                            </Modal>
                            {/* 结束 */}
                            <Button icon={<DeleteOutlined />} danger className='actBtn' onClick={() => {
                                that.delItem(oid)
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
                    <Breadcrumb.Item>测评信息管理</Breadcrumb.Item>
                    <Breadcrumb.Item>测评列表</Breadcrumb.Item>
                </Breadcrumb>
                {/* 添加测评 */}
                <Button type='primary' icon={<PlusOutlined />} onClick={this.AddshowModal}>添加</Button>
                <Modal
                    title="添加测评信息"
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
                                message: '请输入测评标题'
                            }
                        ]}
                            label='标题'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="content" rules={[
                            {
                                required: true,
                                message: '请输入详细信息'
                            }
                        ]}
                            label='试题说明'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="file" >
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">点击或拉取文件到此区域上传</p>
                                <p className="ant-upload-hint">文件数量限制:1</p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.AddCancel} type="default" className="mod">取消</Button>
                            <Button type="primary" htmlType="submit" className="mod"
                                disabled={fileList.length !== 1}
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
