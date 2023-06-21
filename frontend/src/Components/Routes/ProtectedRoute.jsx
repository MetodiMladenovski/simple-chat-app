import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    if (localStorage.getItem("loggedUser") == null) {
       return <Navigate to={'/login'} />;
    }
    return children;
 };

 export default ProtectedRoute;