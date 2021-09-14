import React from "react";
import {
    Breadcrumb,
    Button,
    Input,
    Layout,
    message,
    Popconfirm,
    Space,
    Spin,
    Switch,
    Table,
    Tag,
    TimePicker
} from "antd";
import axios from "axios";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {Modal} from "react-bootstrap";
import moment from "moment";
import './index.css';
const {Content } = Layout;

export default class Pricing extends React.Component{
    state={
        data:[],
        loading:true,
        show:false,
        searchText: '',
        searchedColumn: '',
        modalTitle:'',
        timerange:'',
        isTwentyfour:false
    }
    //get pricing info from db
    getPricing=()=>{
        axios.get('/api/Pricing/GetAllPricing').then(res=>{
            this.setState({loading:false});
           if(res.data.status){
               this.state.data=this.setState({data:res.data.pricings});
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
    //refresh data
    updateTable=()=>{
        this.setState({loading:true})
        this.getPricing();
        this.forceUpdate();
    }
    //show modal
    show=(c)=>{
        this.setState({show:true});
        console.log(c);
        if(c===1){
            this.setState({modalTitle:'Make a pricing'});
            let time = null
            this.setState({time});
        }else{
            this.setState({modalTitle:'Edit this pricing'});
            let time=[moment(c.openTime, 'HH:mm:ss'),moment(c.closeTime, 'HH:mm:ss')];
            let isTwentyfour=c.isTwentyfour;

            this.setState({time,isTwentyfour});
        }
    }
    //close modal
    handleClose=()=>{
        this.setState({show:false});
    }
    componentDidMount() {
        this.getPricing();
    }

    render() {
        const columns=[
            {
                title: 'Name',
                dataIndex: 'pricingName',
                key: 'pricingName',
                render: text => <a>{text}</a>,
                ...this.getColumnSearchProps('pricingName'),
            },{
                title: 'Open Time',
                dataIndex: 'openTime',
                key: 'openTime',
                render: time=><span>{time}</span>
            },{
                title: 'Closing Time',
                dataIndex: 'closeTime',
                key: 'closeTime',
                render: time=><span>{time}</span>
            },{
                title: '24/7',
                dataIndex: 'isTwentyFour',
                key: 'isTwentyFour',
                render: isTwentyFour=>{
                    if(isTwentyFour){
                       return <Tag color={"green"}>{"Yes"}</Tag>
                    }else{
                        return <Tag color={"volcano"}>{"No"}</Tag>
                    }
                }
            },{
                title: 'Price(hr/fix)',
                dataIndex: 'pricePh',
                key: 'pricePh',
                render: pricePh=><span>${pricePh}</span>
            },{
                title:'Flat Rate',
                dataIndex: 'isFlatRate',
                key:'isFlatRate',
                width:91,
                render:isFlatRate=>{
                    if(isFlatRate){
                        return <Tag color={"green"}>{"Yes"}</Tag>
                    }else{
                        return <Tag color={"volcano"}>{"No"}</Tag>
                    }
                }
            },{
                title:'Early Bird Price',
                dataIndex: 'earlyBirdPrice',
                key:'earlyBirdPrice',
                render:earlyBirdPrice=>{
                    if(earlyBirdPrice===0){
                        return <span>No Applicable</span>
                    }else{
                        return <span>${earlyBirdPrice}</span>
                    }
                }
            },{
                title:'Maximum Price',
                dataIndex: 'maxPrice',
                key:'maxPrice',
                render: maxPrice=>{
                    if(maxPrice===0){
                        return <span>No Applicable</span>
                    }else{
                        return <span>${maxPrice}</span>
                    }
                }
            },{
                title:'Free Parking Time',
                dataIndex: 'freeBefore',
                key:'freeBefore',
                render:freeBefore=>{
                    if(freeBefore===0){
                        return <span>No Applicable</span>
                    }else{
                        return <span>${freeBefore}</span>
                    }
                }
            },
            {
                title:'Lease a park',
                dataIndex: 'monthlyFees',
                key:'monthlyFees',
                render:monthlyFees=>{
                    if(monthlyFees===0){
                        return <span>No Applicable</span>
                    }else{
                        return <span>${monthlyFees}/month</span>
                    }
                }
            },{
                title:'Status',
                dataIndex: 'inUse',
                key:'inUse',
                render:inUse=>{
                    if(inUse){
                        return  <Tag color={"green"}>{"In Use"}</Tag>
                    }else{
                        return <Tag color={"volcano"}>{"Not in use"}</Tag>
                    }
                }
            },{
                title: 'Action',
                key: 'action',
                render: (text, record) =>
                    // <Space size="middle">
                    //     <a>Invite {record.name}</a>
                    //     <a>Delete</a>
                    // </Space>
                {
                    if(record.inUse){
                        return (
                            <Space size="middle">
                                <a style={{color:'#0d6efd'}} type={'primary'} onClick={()=>this.show(record)}>Edit</a>
                            </Space>
                        )
                    }else{
                        return (
                            <Space size="middle">
                                <a style={{color:'#0d6efd'}} onClick={()=>this.show(record)}>Edit</a>
                                <Popconfirm onConfirm={()=>this.releaseCar(record)} title={"Do you confirm to move it to history?"}><a style={{color:'#0d6efd'}}>Delete</a></Popconfirm>
                            </Space>
                        )
                    }
                },
            },
        ];
        console.log(this.state.para)
        return (
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Pricing</Breadcrumb.Item>
                    <Breadcrumb.Item>View Plans</Breadcrumb.Item>
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
                        <Button className={"add-car"} type={"primary"}  onClick={()=>this.show(1)}>New Pricing</Button>
                        <Button icon={<RedoOutlined />} onClick={()=>this.updateTable()}/>
                    </div>
                    <Spin spinning={this.state.loading}>
                        <Table rowKey={"pricingId"} columns={columns} dataSource={this.state.data} />
                    </Spin>
                </Content>
                <Modal
                    show={this.state.show}
                    onHide={()=>this.handleClose()}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <TimePicker.RangePicker popupClassName={"popup-picker"} defaultValue={this.state.time}  disabledSeconds={(selectedHour, selectedMinute)=>{
                            let disabled = [];
                            for (let i = 0; i < 60; i++) {
                                disabled.push(i);
                            }
                            return disabled;
                        }} hideDisabledOptions={true} disabled={this.state.isTwentyfour} />
                            <Switch className={'switch1'} checkedChildren="Yes" unCheckedChildren="No" defaultChecked={this.state.isTwentyfour} onChange={(checked)=>{this.setState({isTwentyfour:checked})}} />
                            <span>24/7</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="secondary" onClick={()=>this.handleClose()}>
                            Close
                        </Button>
                        <Button type="primary" onClick={()=>this.handleClose()}>Add</Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        );
    }

}