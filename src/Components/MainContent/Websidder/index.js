import React from "react";
import {Layout, Menu} from "antd";
import './index.css';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
const { Sider } = Layout;
const { SubMenu } = Menu;

export default class Websidder extends React.Component{
    render() {
        return(
            <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <SubMenu key="sub1" icon={<UserOutlined />} title="Manage Cars">
                        <Menu.Item key="1">Current</Menu.Item>
                        <Menu.Item key="2">History</Menu.Item>
                        <Menu.Item key="3">Pay Monthly</Menu.Item>
                        <Menu.Item key="4">Make a payment</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<LaptopOutlined />} title="Pricing">
                        <Menu.Item key="5">View Plans</Menu.Item>
                        <Menu.Item key="6">Make New Plan</Menu.Item>
                        {/*<Menu.Item key="7">option7</Menu.Item>*/}
                        {/*<Menu.Item key="8">option8</Menu.Item>*/}
                    </SubMenu>
                    <SubMenu key="sub3" icon={<NotificationOutlined />} title="Settings">
                        <Menu.Item key="9">My Details</Menu.Item>
                        <Menu.Item key="10">Parking Lot Details</Menu.Item>
                        {/*<Menu.Item key="11">option11</Menu.Item>*/}
                        {/*<Menu.Item key="12">option12</Menu.Item>*/}
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}