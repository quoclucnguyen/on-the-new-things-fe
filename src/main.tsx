import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {NextUIProvider} from '@nextui-org/react';
import {initializeApp} from "firebase/app";
import './index.css';
import {connectAuthEmulator, getAuth} from "firebase/auth";

const firebaseConfig = {};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider>
            <App/>
        </NextUIProvider>
    </React.StrictMode>
)
