import React from "react";
import {Breadcrumb, Layout} from "antd";
const {Content } = Layout;

export default class Lease extends React.Component{


    render() {
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
                    {/*<Spin spinning={this.state.loading}>*/}
                    {/*    <Table rowKey={"enterId"} columns={columns} dataSource={this.state.data} />*/}
                    {/*</Spin>*/}
                </Content>
            </Layout>
        );
    }

}