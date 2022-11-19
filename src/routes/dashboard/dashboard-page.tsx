import {useAuth} from "../../App";

export default function DashboardPage() {
    const appAuth = useAuth();

    return <>Dashboard Page: User uuid: {appAuth?.user?.id}</>
}