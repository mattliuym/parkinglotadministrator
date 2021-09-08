import React from "react";
import 'antd/dist/antd.css';
import './index.css';
import {Layout, Table, Tag, Space, message, Popconfirm, Breadcrumb, Button} from 'antd';
import axios from "axios";
const {Content } = Layout;
export default class Current extends React.Component{
    state={
        columns: [
            {
                title: 'Plate',
                dataIndex: 'plate',
                key: 'plate',
                render: text => <a>{text}</a>,
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
                                  <Popconfirm onConfirm={()=>this.confirm(this)} title={"Do you confirm to do so?"}><a>Make a Payment</a></Popconfirm>
                              </Space>
                          )
                       }else{
                           return (
                               <Space size="middle">
                                   <Popconfirm title={"Do you confirm to move it to history?"}><a>Move to History</a></Popconfirm>
                               </Space>
                           )
                       }
                    },
            },
        ],
        data:[
        ],
        show:false
    };

    getDate=(time)=>{
        let myDate = new Date(time);
        let year = myDate.getFullYear();
        let month = (myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : myDate.getMonth()+1) ;//获取月
        let date = myDate.getDate();
        let  h = myDate.getHours();
        let m = myDate.getMinutes();
        let now = `${date}-${month}-${year}   ${h}:${m}`;
        return now;
    }
    confirm = (e)=>{
        console.log(e);
        message.success("Done!");
    }
    componentDidMount() {
        axios.get("/api/SearchPlate/GetCurrentInfo").then(res=>{
            //console.log(res.data);
            if(res.data.status){
                this.state.data=this.setState({data:res.data.allPlate});
            }else{
                message.error(res.data.error);
                setInterval('window.location.href="/login"',1000);
            }

        });
    }

    render() {
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
                    <Button type={"primary"} className={"add-car"} onClick={()=>{alert(1)}}>Add Car</Button>
                    <Table rowKey={"enterId"} columns={this.state.columns} dataSource={this.state.data} />
                </Content>
            </Layout>
        )
    }
}