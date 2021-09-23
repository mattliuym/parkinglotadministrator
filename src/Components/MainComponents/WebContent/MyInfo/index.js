import React from "react";
import {Breadcrumb, Button, Descriptions, Layout, message} from 'antd';
import axios from "axios";
const {Content } = Layout;

export default class MyInfo extends React.Component{
    state={
        email:"",
        phone:"",
        userId:"",
        userName:""
    }
    componentDidMount() {
        axios.get('/api/Header/GetToken').then(res=>{
            if(res.data.status){
                this.setState({
                    userName:res.data.user.userName,
                    userId:res.data.user.userId,
                    phone:res.data.user.phone,
                    email:res.data.user.email
                });
            }else{
                message.error("You have yet logged in!");
                this.delCookie("token");
                setInterval('window.location.href="/login"',1000);
            }
        });
    }

    render() {
        return(
            <Layout style={{ padding: '0 24px 0px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Other Info</Breadcrumb.Item>
                    <Breadcrumb.Item>My Information</Breadcrumb.Item>
                </Breadcrumb>
            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
            >
                <Descriptions title="User Info" bordered>
                    <Descriptions.Item label="UserName" span={3}>{this.state.userName}</Descriptions.Item>
                    <Descriptions.Item label="User Id"span={3}>{this.state.userId}</Descriptions.Item>
                    <Descriptions.Item label="Phone Number"span={3}>{this.state.phone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{this.state.email}</Descriptions.Item>
                </Descriptions>
            </Content>
        </Layout>
        )
    }
}