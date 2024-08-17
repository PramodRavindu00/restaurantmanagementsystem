import React from 'react'
import { useUser } from "../../components/LoggedUser";

function CustomerProducts() {
  let loggeduser = useUser();
  if(!loggeduser){
    loggeduser = JSON.parse(localStorage.getItem("loggedUser"));
  }
  
  return (
    <div>CustomerProducts</div>
  )
}

export default CustomerProducts