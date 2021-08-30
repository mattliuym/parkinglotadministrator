import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { message,Form, Input, Button, Checkbox } from 'antd';
import axios from "axios";


// export default class Login extends React.Component{
//     onFinish = (values) => {
//         console.log('Success:', values);
//     };
//     onFinishFailed = (errorInfo) => {
//         console.log('Failed:', errorInfo);
//     };
//
//     render() {
//         return(
//             <Form
//                 name="basic"
//                 labelCol={{
//                     span: 8,
//                 }}
//                 wrapperCol={{
//                     span: 16,
//                 }}
//                 initialValues={{
//                     remember: true,
//                 }}
//                 onFinish={()=>this.onFinish()}
//                 onFinishFailed={()=>this.onFinishFailed}
//             >
//                 <Form.Item
//                     label="Username"
//                     name="username"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input your username!',
//                         },
//                     ]}
//                 >
//                     <Input />
//                 </Form.Item>
//
//                 <Form.Item
//                     label="Password"
//                     name="password"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input your password!',
//                         },
//                     ]}
//                 >
//                     <Input.Password />
//                 </Form.Item>
//
//                 <Form.Item
//                     name="remember"
//                     valuePropName="checked"
//                     wrapperCol={{
//                         offset: 8,
//                         span: 16,
//                     }}
//                 >
//                     <Checkbox>Remember me</Checkbox>
//                 </Form.Item>
//
//                 <Form.Item
//                     wrapperCol={{
//                         offset: 8,
//                         span: 16,
//                     }}
//                 >
//                     <Button type="primary" htmlType="submit">
//                         Submit
//                     </Button>
//                 </Form.Item>
//             </Form>
//         )
//     }
// }

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
                document.cookie="token="+res.data.result.token;
                window.location.href="/";
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

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={"login-outer"}>
            <div className={"login-box"}>
            <h2>Login</h2>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 10,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 13,
                        span: 6,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 10,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
                <div className={"link-box"}><a href={"/signup"}>Don't have an account? Sign Up</a></div>
        </div>
        </div>
    );
};
export default Login;
