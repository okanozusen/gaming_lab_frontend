import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // ✅ Import your Navbar component

function Layout() {
    return (
        <>
            <Navbar /> {/* ✅ Navbar appears on every page */}
            <Outlet />  {/* ✅ This renders the current page */}
        </>
    );
}

export default Layout;
