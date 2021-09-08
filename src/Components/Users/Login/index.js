import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { message,Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from "axios";

const Login = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
        let params = {
            userName:values.username,
            pwd:values.password
        }
        //verify account
        axios.post('/api/Administrator/LoginAccount',params).then(res=>{
            if(res.data.status===true){
                //if login successfully
                let expire = new Date((new Date()).getTime() +  24 * 3600 * 1000 * 7);
                expire = ";expires=" + expire.toUTCString();
                document.cookie="token="+res.data.result.token+expire;
                window.location.href="/home";
            }else{
                //if unsuccessful
                message.error({
                    content:res.data.result.message,
                    className:'error-message',
                    style:{
                        marginTop: '20vh',
                    }
                })
            }

        });
    };


    return (
        <div className={"login-outer"}>
            <div className={"login-box"}>
            <h2>Login</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a className="login-form-forgot" href="/">
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="/signup">register now!</a>
                    </Form.Item>
                </Form>
                {/*<div className={"link-box"}><a href={"/signup"}>Don't have an account? Sign Up</a></div>*/}
            </div>
        </div>
    );
};
export default Login;
