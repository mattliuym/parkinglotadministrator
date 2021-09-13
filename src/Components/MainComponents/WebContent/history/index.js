import React from "react";
import {Breadcrumb, Button, Input, Layout, message, Popconfirm, Space, Spin, Table} from "antd";
import axios from "axios";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const {Content } = Layout;

export default class History extends React.Component{
    state={
        data:[],
        loading:true,
        searchText: '',
        searchedColumn: '',
    }
    //reformat date function
    getDate=(time)=>{
        let myDate = new Date(time);
        let year = myDate.getFullYear();
        let month = (myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : myDate.getMonth()+1) ;
        let date = (myDate.getDate()<10? '0'+myDate.getDate() : myDate.getDate());
        let  h = (myDate.getHours()<10? '0'+myDate.getHours() : myDate.getHours());
        let m = (myDate.getMinutes()<10? '0'+myDate.getMinutes():myDate.getMinutes());
        return `${date}-${month}-${year}   ${h}:${m}`;
    }
    getHistoryData=()=>{
        axios.get('/api/SearchPlate/GetHistoryInfo').then(res=>{
            this.setState({loading:false});
            if(res.data.status){
                this.state.data=this.setState({data:res.data.history});
            }else{
                message.error(res.data.error);
                setInterval('window.location.href="/login"',1000);
            }
        });
    }
    //refresh the table
    updateTable=()=>{
        this.setState({loading:true})
        this.getHistoryData();
        this.forceUpdate();
    }
    //Search
    getColumnSearchProps = (dataIndex) => ({
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
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
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
    //search function achieving
    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };
    //reset
    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    componentDidMount() {
        this.getHistoryData();
    }

    render() {
        const columns=[
            {
                title: 'Plate',
                dataIndex: 'plate',
                key: 'plate',
                render: text => <a>{text}</a>,
                ...this.getColumnSearchProps('plate'),
            },{
                title: 'Entry Time',
                dataIndex: 'inTime',
                key: 'inTime',
                render: time=><span>{this.getDate(time)}</span>
            },{
                title: 'Leave Time',
                dataIndex: 'outTime',
                key: 'outTime',
                render: time=><span>{this.getDate(time)}</span>
            },{
                title: 'Parking Fees',
                dataIndex: 'fees',
                key: 'fees',
                render:fee=><span>${fee}</span>
            }, {
                title: 'Action',
                key: 'action',
                render: (text, record) =>
                    <Space size="middle">
                        <Popconfirm onConfirm={()=>this.updateTable()} title={"Do you confirm to do so?"}><Button type={"primary"}>Delete Record</Button></Popconfirm>
                    </Space>
            }
        ];
        return (
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Manage Cars</Breadcrumb.Item>
                    <Breadcrumb.Item>History</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Spin spinning={this.state.loading}>
                        <Table rowKey={"enterId"} columns={columns} dataSource={this.state.data} />
                    </Spin>
                </Content>
            </Layout>
        )
    }
}