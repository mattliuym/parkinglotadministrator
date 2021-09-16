import React from "react";
import {Layout, Menu} from "antd";
import './index.css';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
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
                        <Menu.Item key="1"><Link to="/home/current">Current</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/home/history">History</Link></Menu.Item>
                        <Menu.Item key="3"><Link to="/home/lease">Pay Monthly</Link></Menu.Item>
                        <Menu.Item key="4">Make a payment</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="sub2" icon={<LaptopOutlined />} >
                        <Link to="/home/pricing">Pricing</Link>
                    </Menu.Item>
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