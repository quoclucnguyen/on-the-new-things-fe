import {Card} from "@nextui-org/react";
import {Button, Form, Input} from "antd";
import {GoogleOutlined} from "@ant-design/icons";
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {useAuth} from "../../App";
import {useNavigate} from "react-router-dom";
import {auth} from "../../firebase-config";
import localForage from "localforage";

export default function LoginPage() {
    const appAuth = useAuth();
    const navigate = useNavigate();
    const handleBtnLoginViaGoogleClick = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                const userLogin = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                }
//                console.log(typeof (user));
                const userFirebase = {
                    ...user
                }

                console.log(userFirebase);
                localForage.setItem('user', user.toJSON()).then(() => {
                    appAuth.signin(userLogin, () => {
                        navigate("/")
                    });
                })
                // ...
            }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

    }
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
        <Button onClick={handleBtnLoginViaGoogleClick}>
            Login via {<GoogleOutlined/>}
        </Button>
    </Card>
}