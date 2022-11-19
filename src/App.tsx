import React, {createContext, useContext, useState} from 'react'
import {
    BrowserRouter,
    createBrowserRouter,
    Navigate,
    Route,
    RouterProvider,
    Routes,
    useLocation
} from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import LoginLayout from "./layouts/login-layout";
import LoginPage from "./routes/login/login-page";
import DashboardPage from "./routes/dashboard/dashboard-page";

export interface UserLogin {
    id: string;
}

export interface AuthContextType {
    user: UserLogin | null;
    signin: (user: UserLogin, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

export const authProvider = {
    isAuthenticated: false,
    signin(callback: VoidFunction) {
        authProvider.isAuthenticated = true
        callback()
    },
    signout(callback: VoidFunction) {
        authProvider.isAuthenticated = false
        callback()
    },
}
const AuthContext = createContext<AuthContextType>(null!)

export const useAuth = () => {
    return useContext(AuthContext)
}

function AuthProvider({children}: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<UserLogin | null>(null);

    let signin = (newUser: UserLogin, callback: VoidFunction) => {
        return authProvider.signin(() => {
            setUser(newUser);
            callback();
        });
    };

    let signout = (callback: VoidFunction) => {
        return authProvider.signout(() => {
            setUser(null);
            callback();
        });
    };
    let value = {user, signin, signout};
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}

function RequireAuth({children}: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<LoginLayout/>} path={'/login'}>
                        <Route index element={<LoginPage/>}/>
                    </Route>
                    <Route element={<MainLayout/>} path={'/'}>
                        <Route index element={<RequireAuth><DashboardPage/></RequireAuth>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
