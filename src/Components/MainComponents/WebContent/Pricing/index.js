import React from "react";
import {
    Breadcrumb,
    Button,
    Input, InputNumber,
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
        //
        modalTitle:'',
        pricingName:'',
        openTime:'',
        closeTime:'',
        timerange:'',
        isTwentyfour:false,
        pricePh:NaN,
        isFlatRate:false,
        earlyBirdPrice:NaN,
        haveEarlyBird:false,
        maxPrice:NaN,
        haveMax:false,
        isMonthly:false,
        monthlyFees:NaN
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
        if(c===1){
            this.setState({modalTitle:'Make a pricing'});
            this.setState({
                pricingName:'',
                openTime:'',
                closeTime:'',
                timerange:'',
                isTwentyfour:false,
                pricePh:NaN,
                isFlatRate:false,
                earlyBirdPrice:NaN,
                haveEarlyBird:false,
                maxPrice:NaN,
                haveMax:false,
                isMonthly:false,
                monthlyFees:NaN
            })
        }else{
            this.setState({modalTitle:'Edit this pricing'});
            let timerange=[moment(c.openTime, 'HH:mm:ss'),moment(c.closeTime, 'HH:mm:ss')];
            let isTwentyfour = c.isTwentyfour;
            this.setState({timerange,isTwentyfour});
            if(c.haveEarlyBird){
                this.setState({earlyBirdPrice:c.earlyBirdPrice});
            }
            if(c.haveMax){
                this.setState({maxPrice:c.maxPrice});
            }
            if(c.monthlyFees){
                this.setState({monthlyFees:c.monthlyFees});
            }
            if(!c.isTwentyfour){
               this.setState({
                   openTime:c.openTime,
                   closeTime:c.closeTime,});
            }

            this.setState({
                haveMax:c.haveMax,
                haveEarlyBird:c.haveEarlyBird,
                isMonthly:c.isMonthly,
                isFlatRate:c.isFlatRate,
                pricePh:c.pricePh,
            });
        }
        console.log("3#######3")
        console.log(this.state.isTwentyfour);
    }
    //close modal
    handleClose=()=>{
        this.setState({show:false});
    }
    //submit the pricing scheme
    submitForm=()=>{
        let para = {
            isTwentyFour:this.state.isTwentyfour,
            isFlatRate:this.state.isFlatRate,
            pricePh:this.state.pricePh,
            haveEarlyBird: this.state.haveEarlyBird,
            haveMax: this.state.haveMax,
            isMonthly:this.state.isMonthly,
        }
        if(this.state.haveEarlyBird){
            para.earlyBirdPrice=this.state.earlyBirdPrice
        }
        if(this.state.haveMax){
            para.maxPrice=this.state.maxPrice
        }
        if(this.state.isMonthly){
            para.monthlyFees=this.state.monthlyFees
        }
        if(!this.state.isTwentyfour){
            para.openTime=this.state.openTime;
            para.closeTime=this.state.closeTime;
        }
        console.log(para);
        //this.handleClose();
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
                    size={'lg'}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"modal-rows"}>
                            <span className={'title1'}>Opening Hours:</span>
                            <TimePicker.RangePicker popupClassName={"popup-picker"} defaultValue={this.state.timerange}  disabledSeconds={(selectedHour, selectedMinute)=>{
                            let disabled = [];
                            for (let i = 0; i < 60; i++) {
                                disabled.push(i);
                            }
                            return disabled;
                        }} hideDisabledOptions={true} disabled={this.state.isTwentyfour} onChange={(a,b)=>{this.setState({openTime:b[0],closeTime:b[1]})}} />
                            <Switch className={'switch1'} checkedChildren="Yes" unCheckedChildren="No" defaultChecked={this.state.isTwentyfour} onChange={(checked)=>{this.setState({isTwentyfour:checked})}} />
                            <span>24/7 Operation</span>
                        </div>
                        <div className={"modal-rows"}>
                            <span className={"title2"}>Price: </span>
                            <InputNumber
                                defaultValue={this.state.pricePh}
                                min={0}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={value=>{this.setState({pricePh:value})}}
                            />
                            <span id={'phour'}>{this.state.isFlatRate ? "":"per hour"}</span>
                            <Switch className={'switch2'} checkedChildren="Yes" unCheckedChildren="No" defaultChecked={this.state.isFlatRate} onChange={(checked => {this.setState({isFlatRate:checked})})} />
                            <span>Flat Rate</span>
                        </div>
                        <div className={"modal-rows"}>
                            <span className={"title3"}>Maximum Price: </span>
                            <InputNumber
                                defaultValue={this.state.maxPrice}
                                disabled={!this.state.haveMax}
                                min={0}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={value=>{this.setState({maxPrice:value})}}
                            />
                            <span id={'phour'}>{this.state.haveMax ? "Max":""}</span>
                            <Switch className={'switch2'} checkedChildren="Yes" unCheckedChildren="No" defaultChecked={this.state.haveMax} onChange={(checked => {this.setState({haveMax:checked})})} />
                            <span>Applicable</span>
                        </div>
                        <div className={"modal-rows"}>
                            <span className={"title4"}>Early Bird: </span>
                            <InputNumber
                                defaultValue={this.state.earlyBirdPrice}
                                disabled={!this.state.haveEarlyBird}
                                min={0}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={value=>{this.setState({earlyBirdPrice:value})}}
                            />
                            <span id={'phour'}>{this.state.haveEarlyBird ? "Total":""}</span>
                            <Switch className={'switch2'} checkedChildren="Yes" unCheckedChildren="No" defaultChecked={this.state.haveEarlyBird} onChange={(checked => {this.setState({haveEarlyBird:checked})})} />
                            <span>Applicable</span>
                        </div>
                        <div className={"modal-rows"}>
                            <span className={"title5"}>Monthly Price: </span>
                            <InputNumber
                                defaultValue={this.state.monthlyFees}
                                disabled={!this.state.isMonthly}
                                min={0}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={value=>{this.setState({monthlyFees:value})}}
                            />
                            <span id={'phour'}>per month</span>
                            <Switch className={'switch2'} checkedChildren="Yes" unCheckedChildren="No" defaultChecked={this.state.isMonthly} onChange={(checked => {this.setState({isMonthly:checked})})} />
                            <span>Pay Monthly</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="secondary" onClick={()=>this.handleClose()}>
                            Close
                        </Button>
                        <Button type="primary" onClick={()=>this.submitForm()}>Add</Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        );
    }

}