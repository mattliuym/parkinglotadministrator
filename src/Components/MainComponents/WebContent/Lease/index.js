import React from "react";
import {Breadcrumb, Button, Layout, message, Tag, Spin, Table, Input, Space,InputNumber} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import axios from "axios";
import {Modal} from "react-bootstrap";
import Highlighter from "react-highlight-words";
import './index.css';
const {Content } = Layout;


export default class Lease extends React.Component{
    state={
        data:[],
        loading:true,
        show:false,
        searchText:'',
        searchedColumn:'',
        modalTitle: '',
        extend:true,
        plateDis:true,
        //
        pricingId:'',
        isMonthly:false,
        monthlyFees:'',
        amount:'',
        //
        leaseId:NaN,
        plate:'',
        expiry:'',
        nexpiry:'',
        valid:false
    }
    //reformat date function
    getDate=(time)=>{
        let myDate = new Date(time);
        let year = myDate.getFullYear();
        let month = (myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : myDate.getMonth()+1) ;
        let date = (myDate.getDate()<10? '0'+myDate.getDate() : myDate.getDate());
        // let  h = (myDate.getHours()<10? '0'+myDate.getHours() : myDate.getHours());
        // let m = (myDate.getMinutes()<10? '0'+myDate.getMinutes():myDate.getMinutes());
        return `${date}-${month}-${year}`;
    }
    //get monthly paid car
    getLease=()=>{
        axios.get('/api/LeasePark/GetAllLease').then(res=>{
           this.setState({loading:false});
           if(res.data.status){
               this.setState({data:res.data.leaseLists});
               this.getPricing();
           }else{
               message.error(res.data.error);
               setInterval('window.location.href="/login"',1000);
           }
        });

    }
    //pricing
    getPricing=()=>{
        axios.get('/api/Pricing/GetPricing').then(res=>{
           this.setState({
               pricingId:res.data[0].pricingId,
               isMonthly:res.data[0].isMonthly,
               monthlyFees:res.data[0].monthlyFees,
           });
        });
    }
    //add new lease detail
    uploadLease=()=>{
        let para={
            leaseId:this.state.leaseId,
            plate:this.state.plate.toUpperCase(),
            expiry:this.state.nexpiry,
            valid:true
        }
        if(!para.leaseId){
            para.leaseId=0;
        }
        axios.post('/api/LeasePark/AddLease',para).then(res=>{
           if(res.data.status){
               this.handleClose();
               message.success("Done!");
               this.updateTable();
           }else{
               message.error(res.data.error);
               setTimeout('window.location.href="/login"',1000);
           }
        });
        //axios.post('');
    }

    updateTable=()=>{
       this.setState({loading:true});
       this.getLease();
       this.forceUpdate();
    }
    //set extended expired date
    setLength=(value)=>{
        const expired=new Date(this.state.expiry);
        let extDate=new Date(expired);
        extDate.setDate(expired.getDate()+30*value);
        this.setState({nexpiry:extDate});
        let mfees=this.state.monthlyFees;
        this.setState({amount:mfees*value});
    }
    show=(c)=>{
        this.setState({show:true,extend:true});
        this.setState({amount:this.state.monthlyFees+"/month"});
        if(c===1){
            this.setState({modalTitle:'Pay the parking fees monthly'});
            this.setState({
                leaseId:NaN,
                plate:'',
                expiry:new Date(),
                nexpiry:new Date(),
                valid:false,
                plateDis:false
            });
        }else{
            this.setState({modalTitle:'Edit'});
            if(c.valid){
                this.setState({
                    leaseId:c.leaseId,
                    plate:c.plate,
                    expiry:c.expiry,
                    nexpiry:c.expiry,
                    valid:c.valid,
                    plateDis:true
                });
            }else{
                this.setState({
                    leaseId:c.leaseId,
                    plate:c.plate,
                    expiry:new Date(),
                    nexpiry:new Date(),
                    valid:c.valid,
                    plateDis:true
                });
            }

        }
    }
    //close modal
    handleClose=()=>{
        this.setState({show:false});
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
        this.getLease();
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
                title: 'Expired Date',
                dataIndex: 'expiry',
                key: 'expiry',
                render: time=><span>{this.getDate(time)}</span>
            },{
                title:'Validation',
                dataIndex: 'valid',
                key:'valid',
                render: isValid=>{
                    if(isValid){
                        return <Tag color={"green"}>{"Yes"}</Tag>
                    }else{
                        return <Tag color={"volcano"}>{"No"}</Tag>
                    }
                },
            },{
                title:'Action',
                key:'action',
                render:(text,record)=>{
                    if(this.state.isMonthly){
                        return(
                            <Space size={"middle"}>
                                <a style={{color:'#0d6efd'}} type={'primary'} onClick={()=>this.show(record)}>Edit</a>
                            </Space>
                        )
                    }
                }
            }
        ];
        return (
            <Layout style={{ padding: '0 24px 0px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Manage Cars</Breadcrumb.Item>
                    <Breadcrumb.Item>Pay Monthly</Breadcrumb.Item>
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
                        <Button className={"add-car"} type={"primary"}  onClick={()=>this.show(1)} disabled={!this.state.isMonthly}>New</Button>
                        <Button icon={<RedoOutlined />} onClick={()=>this.updateTable()}/>
                    </div>
                    <Spin spinning={this.state.loading}>
                        <Table rowKey={"leaseId"} columns={columns} dataSource={this.state.data} />
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
                        <div className={"modal-rows"}>
                            <span className={'plate-title'}>Plate:</span>
                            <Input style={{width:"228px"}} defaultValue={this.state.plate} onChange={e=>{this.setState({plate:e.target.value})}} disabled={this.state.plateDis}></Input>
                        </div>
                        <div className={"modal-rows"}>
                            <span>Extend: </span>
                            <InputNumber min={1} max={12} defaultValue={0} onChange={value=>{this.setLength(value);this.setState({extend:false})}} />
                            <span style={{"margin-left":"5px"}}>Month(s)/30 days</span>
                        </div>
                        <div className={"modal-rows"}>
                            <span>Expiry:</span>
                            <span style={{"margin-left":"10px"}}>{this.getDate(this.state.nexpiry)}</span>
                        </div>
                        <div className={"modal-rows"}>
                            <span>Amount:</span>
                            <span>${this.state.amount}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="secondary" onClick={()=>this.handleClose()}>
                            Close
                        </Button>
                        <Button type="primary" onClick={()=>this.uploadLease()} disabled={this.state.extend}>Add</Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        );
    }

}