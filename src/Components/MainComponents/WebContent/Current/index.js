import React from "react";
import 'antd/dist/antd.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Layout, Table, Tag, Space, message, Popconfirm, Breadcrumb, Button, Input, Spin} from 'antd';
import Highlighter from 'react-highlight-words';
import {RedoOutlined, SearchOutlined} from '@ant-design/icons';
import axios from "axios";
import {Modal} from "react-bootstrap";
const {Content} = Layout;
export default class Current extends React.Component{
    state={

        data:[
        ],
        show:false,
        loading:true,
        searchText: '',
        searchedColumn: '',
        filteredInfo: null,
    };
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
    //
    confirm = (e)=>{
        console.log(e);
        message.success("Done!");
    }
    //release car
    releaseCar = (record)=>{
        axios.post('/api/SearchPlate/ReleaseCar',record).then(res=>{
           if(!res.data.status){
               message.error(res.data.error);
               setInterval('window.location.href="/login"',1000);
           }
           if(res.data.releaseSuccess){
               message.success("Success!");

           }else{
               message.error(res.data.error);
           }
           this.updateTable();
        });
    }
    //upload plate
    uploadPlate=()=>{
        const {value} = this.plateNum.state;
        axios.post('/api/SearchPlate/AddPlate',{plateNum:value.toUpperCase()}).then(res=>{
            if(!res.data.status){
                message.error(res.data.error);
                setInterval('window.location.href="/login"',1000);
            }
            if(res.data.addSuccess){
                message.success("Success!");
                this.handleClose();
                this.updateTable();
            }else{
                message.error(res.data.error);
                this.handleClose();
            }
        });
    }
    //update table
    updateTable=()=>{
        this.setState({loading:true})
        this.getTableData();
        this.forceUpdate();
    }
    //show modal
    show=()=>{
        this.setState({show:true});
    }
    //close modal
    handleClose=()=>{
        this.setState({show:false});
    }
    //get table data
    getTableData=()=>{
        axios.get("/api/SearchPlate/GetCurrentInfo").then(res=>{
            this.setState({loading:false});
            if(res.data.status){
                this.state.data=this.setState({data:res.data.allPlate});
            }else{
                message.error(res.data.error);
                setInterval('window.location.href="/login"',1000);
            }
        });
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
       this.getTableData();
    }

    render() {
        const columns = [
            {
                title: 'Plate',
                dataIndex: 'plate',
                key: 'plate',
                render: text => <a>{text}</a>,
                ...this.getColumnSearchProps('plate'),
            },
            {
                title: 'Entry Time',
                dataIndex: 'inTime',
                key: 'inTime',
                render: time=><span>{this.getDate(time)}</span>
            },
            {
                title: 'Parking Time(minutes)',
                dataIndex: 'timeLength',
                key: 'timeLength',
            },
            {
                title: 'Parking Fees',
                dataIndex: 'fees',
                key: 'fees',
                render:fee=><span>${fee}</span>
            },
            {
                title: 'Pay Status',
                key: 'isPaid',
                dataIndex: 'isPaid',
                render: isPaid => {
                    if(isPaid){
                        return <Tag color={"green"}>{"Paid"}</Tag>
                    }else{
                        return <Tag color={"volcano"}>{"Unpaid"}</Tag>
                    }
                },
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) =>
                    // <Space size="middle">
                    //     <a>Invite {record.name}</a>
                    //     <a>Delete</a>
                    // </Space>
                {
                    if(!record.isPaid){
                        return (
                            <Space size="middle">
                                <Popconfirm onConfirm={()=>this.confirm(this)} title={"Do you confirm to do so?"}><Button type={'primary'}>Make a Payment</Button></Popconfirm>
                            </Space>
                        )
                    }else{
                        return (
                            <Space size="middle">
                                <Popconfirm onConfirm={()=>this.releaseCar(record)} title={"Do you confirm to move it to history?"}><Button>Release the Car</Button></Popconfirm>
                            </Space>
                        )
                    }
                },
            },
        ];
        return (
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Manage Cars</Breadcrumb.Item>
                    <Breadcrumb.Item>Current</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <div className={"button-set"}>
                        <Button className={"add-car"} type={"primary"}  onClick={()=>this.show()}>Add Car</Button>
                        <Button icon={<RedoOutlined />} onClick={()=>this.updateTable()}/>
                    </div>
                    <Spin spinning={this.state.loading}>
                        <Table rowKey={"enterId"} columns={columns} dataSource={this.state.data} />
                    </Spin>
                </Content>
                <Modal
                    show={this.state.show}
                    onHide={()=>this.handleClose()}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add Car Plate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Input ref={c=>this.plateNum=c} placeholder={"Please input the plate here"} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="secondary" onClick={()=>this.handleClose()}>
                            Close
                        </Button>
                        <Button type="primary" onClick={()=>this.uploadPlate()}>Add</Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        )
    }
}