import React from "react";
import {Layout} from "antd";
const {Footer} = Layout;

export default class Webfooter extends React.Component{
    render() {
        return(
            <Footer style={{ textAlign: 'center' }}>Carpark Management System ©2021 Created by Yiming Liu</Footer>
        )
    }
}