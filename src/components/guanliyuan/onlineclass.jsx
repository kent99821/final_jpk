import React, { Component } from 'react'
import { Breadcrumb, Input, Table, Button, Space, message, Modal, Form, Select, Tag } from 'antd';
import '../../assets/globel.css'
import Highlighter from 'react-highlight-words';
import {
    HomeOutlined,
    SearchOutlined,
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    VideoCameraAddOutlined
} from '@ant-design/icons';
import Axios from 'axios';
const { TextArea } = Input;
export default class Onlineclass extends Component {
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
            Urlbefore: "http://",
            Urlafter: ".com",



        };
    }

    //添加表单提交函数
    onFinish = values => {
        const that = this
        const URL = that.state.Urlbefore + values.CURL + that.state.Urlafter
        Axios({
            url: `http://118.178.125.139:8060/admin/onlineClass/add?onlineClass_destination=${values.content}&onlineClass_title=${values.title}&onlineClass_url=${URL}`,
            method: 'post',
            headers: {
                'token': window.sessionStorage.getItem('token'),

            }

        }).then(function (response) {
            message.success('添加成功!!!')
            that.setState({
                Addvisible: false,
                Urlbefore: "http://",
                Urlafter: ".com",
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
            Urlbefore: "http://",
            Urlafter: ".com",
        });

    };
    // 编辑功能
    EditItem = (ocid) => {
        const that = this
        //id查询回复信息渲染到表单
        Axios({
            url: `http://118.178.125.139:8060/admin/onlineClass/findById?id=${ocid}`,
            method: 'get',
            headers: {
                'token': window.sessionStorage.getItem('token'),
            }
        }).then(function (response) {

            const res = response.data.extended.OnlineClass
            console.log(res);
            that.setState({
                Editvisible: true,
            })
            setTimeout(() => {
                that.EditformRef.current.setFieldsValue({
                    "EditItemTitle": res.onlineClass_title,
                    "EditItemId": res.ocid,
                    "EditItemContent": res.onlineClass_destination,
                    "EditItemURL": res.onlineClass_url
                })
            }, 100)
        })
            .catch(function (error) {
                console.log(error)
            })
    }
    //编辑表单提交函数
    EditonFinish = values => {
        const that = this

        Axios({
            url: `http://118.178.125.139:8060/admin/onlineClass/update?id=${values.EditItemId}&onlineClass_destination=${values.EditItemContent}&onlineClass_title=${values.EditItemTitle}&onlineClass_url=${values.EditItemURL}`,
            method: 'post',
            headers: {
                'token': window.sessionStorage.getItem('token'),
            }
        }).then(function (response) {
            //表单重置
            that.EditformRef.current.resetFields();
            that.setState({
                Editvisible: false,
            });
            that.getData((that.state.page - 1), that.state.pageSize);
            message.success('修改成功!!!')


        })
            .catch(function (error) {
                message.error('修改失败...')
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
        });

    }
    //删除
    delItem(ocid) {
        const that = this
        Modal.confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined />,
            content: '此操作将永久删除该教学信息, 是否继续?',
            okText: '确认',
            cancelText: '取消',
            onOk() {

                Axios({
                    url: `http://118.178.125.139:8060/admin/onlineClass/deleteById?id=${ocid}`,
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

        Axios.get(`http://118.178.125.139:8060/admin/onlineClass/findAll?page=${p}&size=${s}`,
            {
                headers: {
                    'token': window.sessionStorage.getItem('token')
                }
            }
        )
            .then(function (response) {
                that.setState({
                    data: response.data.extended.OnlineClasss.content
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
                dataIndex: 'ocid',
                key: 'ocid',
                width: '10%',
                ...this.getColumnSearchProps('ocid'),
            },
            {
                title: '课程名称',
                dataIndex: 'onlineClass_title',
                key: 'onlineClass_title',
                width: '15%',
                ...this.getColumnSearchProps('onlineClass_title'),
            },
            {
                title: '课程介绍',
                dataIndex: 'onlineClass_destination',
                key: 'onlineClass_destination',
                width: '35%',
                ...this.getColumnSearchProps('onlineClass_destination'),
            },
            {
                title: '查阅地址',
                dataIndex: 'onlineClass_url',
                key: 'onlineClass_url',
                width: '10%',
                render: function (onlineTest_url) {
                    if (onlineTest_url !== '') {
                        return (
                            <Tag color="geekblue" icon={<VideoCameraAddOutlined />} onClick={() => {
                                window.open(`${onlineTest_url}`)
                            }}>查阅</Tag>
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
                title: '创建时间',
                dataIndex: 'onlineClass_time',
                key: 'onlineClass_time',
                width: '10%',
                ...this.getColumnSearchProps('onlineClass_time'),
            },
            {
                title: '操作',
                key: 'ocid',
                width: '20%',
                dataIndex: 'ocid',
                render: (ocid) => {
                    const that = this

                    return (
                        <div>
                            <Button icon={<EditOutlined />} type="default" className='actBtn' onClick={() => {
                                that.EditItem(ocid)
                            }}></Button>
                            {/* 编辑信息的模态框 */}
                            <Modal
                                title="编辑课程信息"
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
                                        label='课程ID'
                                    >
                                        <Input disabled={true} />
                                    </Form.Item>

                                    <Form.Item name="EditItemTitle" rules={[
                                        {
                                            required: true,
                                            message: '请输入课程名称'
                                        }
                                    ]}
                                        label='课程名称'
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="EditItemContent" rules={[
                                        {
                                            required: true,
                                            message: '请输入详细信息'
                                        }
                                    ]}
                                        label='课程介绍'
                                    >
                                        <TextArea  autoSize />
                                    </Form.Item>
                                    <Form.Item name="EditItemURL" rules={[
                                        {
                                            required: true,
                                            message: '请配置链接地址'
                                        }
                                    ]}
                                        label='链接地址'
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button onClick={that.editCancel} type="default" className="mod">取消</Button>
                                        <Button type="primary" htmlType="submit" className="mod">提交</Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                            {/* 结束 */}
                            <Button icon={<DeleteOutlined />} danger className='actBtn' onClick={() => {
                                that.delItem(ocid)
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

        //链接地址的文本框
        const { Option } = Select;
        const selectBefore = (
            <Select defaultValue={this.state.Urlbefore} className="select-before" onChange={
                value => {
                    this.setState({
                        Urlbefore: value
                    })
                }
            }>
                <Option value="http://">http://</Option>
                <Option value="https://">https://</Option>
            </Select>
        );
        const selectAfter = (
            <Select defaultValue={this.state.Urlafter} className="select-after" onChange={
                value => {
                    this.setState({
                        Urlafter: value
                    })
                }}>
                <Option value=".com">.com</Option>
                <Option value=".jp">.jp</Option>
                <Option value=".cn">.cn</Option>
                <Option value=".org">.org</Option>
            </Select>
        );
        //结束      
        return (
            <div className='neirong'>
                <Breadcrumb>
                    <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                    <Breadcrumb.Item>网络课信息管理</Breadcrumb.Item>
                    <Breadcrumb.Item>信息列表</Breadcrumb.Item>
                </Breadcrumb>
                {/* 添加信息 */}
                <Button type='primary' icon={<PlusOutlined />} onClick={this.AddshowModal}>添加</Button>
                <Modal
                    title="添加课题信息"
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
                                message: '请输入课程详细信息'
                            }
                        ]}
                            label='课程介绍'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="CURL" rules={[
                            {
                                required: true,
                                message: '请配置课题链接'
                            }
                        ]}
                            label='观看地址'
                        >
                            <Input addonBefore={selectBefore} addonAfter={selectAfter} />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.AddCancel} type="default" className="mod">取消</Button>
                            <Button type="primary" htmlType="submit" className="mod">提交</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Table columns={columns} dataSource={this.state.data} className='table' pagination={paginationProps} />
            </div>
        )
    }
}
