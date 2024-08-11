import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({component:Component,role,...rest})=>{
const token = localStorage.getItem('authToken');
const userType = localStorage.getItem('userType');

if(!token){
    return <Navigate to={"/login"}/>
}

if(role && role !== userType){
    return <Navigate to={"/login"}/>
}

return <Component {...rest}/>

}

export default PrivateRoute