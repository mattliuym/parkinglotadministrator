import React from "react";
import {Layout, Menu,message} from "antd";
import './index.css';
import axios from 'axios';
const { Header } = Layout;

export default class Webheader extends React.Component{

    state = {
        userName:"",
    }
    componentDidMount() {
        axios.get('/api/Header/GetToken').then(res=>{
            if(res.data.status){
                this.setState({userName:res.data.user.userName});
            }else{
                message.error("You have yet logged in!");
                this.delCookie("token");
                setInterval('window.location.href="/login"',1000);
            }
        });
    }
    getCookie=(name)=>{
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        arr=document.cookie.match(reg)
        if(arr)
            return (arr[2]);
        else
            return null;
    }
    delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=this.getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toUTCString();
    }
    render() {
        return(
            <Header className="header">
                <div className="logo user-info">
                    <span>{this.state.userName}</span>
                </div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    {/*<Menu.Item key="1">nav 1</Menu.Item>*/}
                    {/*<Menu.Item key="2">nav 2</Menu.Item>*/}
                    {/*<Menu.Item key="3">nav 3</Menu.Item>*/}
                </Menu>
            </Header>
        )
    }
}