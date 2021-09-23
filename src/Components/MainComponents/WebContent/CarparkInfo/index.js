import React from "react";
import {Breadcrumb, Button, Descriptions, Layout, message} from 'antd';
import axios from "axios";
const {Content } = Layout;

export default class CarparkInfo extends React.Component{
    state={
        openTime: "",
        closeTime: "",
        isTwentyFour: "",
        totalPark:""
    }
    componentDidMount() {
        axios.get('/api/Pricing/GetPricing').then(res=>{
            this.setState({
                openTime:res.data[0].openTime,
                closeTime:res.data[0].closeTime,
                isTwentyFour:res.data[0].isTwentyFour,
                totalPark:res.data[0].totalPark
            });
        });
    }

    render() {
        let des;
        if(this.state.isTwentyFour){
            des=(
                <Descriptions title="Carpark Information" bordered>
                    <Descriptions.Item label="Hours of operation" span={3}>24/7</Descriptions.Item>
                    <Descriptions.Item label="Number of Spaces" span={3}>{this.state.totalPark}</Descriptions.Item>
                </Descriptions>
            )
        }else{
            des=(
                <Descriptions title="Carpark Information" bordered>
                    <Descriptions.Item label="Opening Times" span={3}>{this.state.openTime}-{this.state.closeTime}</Descriptions.Item>
                    <Descriptions.Item label="Number of Bays" span={3}>{this.state.totalPark}</Descriptions.Item>
                </Descriptions>
            )
        }
        return(
            <Layout style={{ padding: '0 24px 0px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Other Info</Breadcrumb.Item>
                    <Breadcrumb.Item>Carpark Details</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    {des}
                </Content>
            </Layout>
        )
    }
}