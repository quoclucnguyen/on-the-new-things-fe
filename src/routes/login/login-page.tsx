import {Card} from "@nextui-org/react";
import {Button, Form, Input} from "antd";
import {GoogleOutlined} from "@ant-design/icons";

export default function LoginPage() {
    return <Card css={{padding: '1rem'}}>
        <h6>On The New Things</h6>
        <Form layout={'vertical'}>
            <Form.Item name={'username'} label={'Username'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'password'} label={'Password'}>
                <Input.Password/>
            </Form.Item>
            <Form.Item>
                <Button htmlType={'submit'}>
                    Login
                </Button>
            </Form.Item>
        </Form>
        <p></p>
        <Button>
            Login via {<GoogleOutlined/>}
        </Button>
    </Card>
}