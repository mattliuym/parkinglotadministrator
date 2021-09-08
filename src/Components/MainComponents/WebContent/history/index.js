import React from "react";
import {Breadcrumb, Layout, Table} from "antd";
const {Content } = Layout;

export default class History extends React.Component{
    render() {
        return (
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Manage Cars</Breadcrumb.Item>
                    <Breadcrumb.Item>History</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <div>here is history</div>
                    {/*<Table rowKey={"enterId"} columns={this.state.columns} dataSource={this.state.data} />*/}
                </Content>
            </Layout>
        )
    }
}