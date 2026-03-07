import { Outlet } from "react-router-dom";
import AdminTopNavbar from "../components/adminComponents/AdminTopNavbar";
import AdminSideNavbar from "../components/adminComponents/AdminSideNavbar";

function AdminLayout({logoutUser}){

    return(
        <>

        <AdminTopNavbar logoutUser={logoutUser}/>

        <div style={{display:"flex"}}>
            <AdminSideNavbar/>
            <main style={{flex:1,padding:"20px"}}>
                <Outlet/>
            </main>
        </div>

        </>
    )
}

export default AdminLayout;