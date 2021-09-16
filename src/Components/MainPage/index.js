import React from "react";
import {Layout} from "antd";
import Webheader from "../MainComponents/Webheader";
import Websidder from "../MainComponents/Websidder";
import Webfooter from "../MainComponents/Webfooter";
import Current from "../MainComponents/WebContent/Current";
import History from "../MainComponents/WebContent/history";
import './index.css';
import 'antd/dist/antd.css';
import {Switch, Route, Redirect} from "react-router-dom";
import Lease from "../MainComponents/WebContent/Lease";
import Pricing from "../MainComponents/WebContent/Pricing";



export default class MainPage extends React.Component{
    render() {
        return(
                <Layout>
                    <Webheader/>
                    <Layout>
                        <Websidder/>
                        {/*<Layout style={{ padding: '0 24px 24px' }}>*/}
                            {/*<Breadcrumb style={{ margin: '16px 0' }}>*/}
                            {/*    <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                            {/*    <Breadcrumb.Item>List</Breadcrumb.Item>*/}
                            {/*    <Breadcrumb.Item>App</Breadcrumb.Item>*/}
                            {/*</Breadcrumb>*/}
                            {/*<Content*/}
                            {/*    className="site-layout-background"*/}
                            {/*    style={{*/}
                            {/*        padding: 24,*/}
                            {/*        margin: 0,*/}
                            {/*        minHeight: 280,*/}
                            {/*    }}*/}
                            {/*>*/}
                        <Switch>
                            <Route path={'/home/current'} component={Current} />
                            <Route path={'/home/history'} component={History} />
                            <Route path={'/home/lease'} component={Lease}/>
                            <Route path={'/home/pricing'} component={Pricing}/>
                            <Redirect to={'/home/current'} />
                        </Switch>
                            {/*</Content>*/}
                        {/*</Layout>*/}
                    </Layout>
                    <Webfooter/>
                </Layout>
        );
    }
}