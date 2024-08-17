import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Note: Make sure you have installed 'jwt-decode'

const UserContext = createContext();

export function LoggedUser({ children }) {
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;

        const storedUser = JSON.parse(localStorage.getItem("loggedUser")); //if there is a already logged user use it

        if (storedUser) {
          setLoggedUser(storedUser);
        } else {
          axios
            .get(`/user/getLoggedUser/${email}`)
            .then((response) => {
              const user = response.data;

              const loggedUserData = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                branch: user.branch,
                active: user.active,
              };

              setLoggedUser(loggedUserData);
              localStorage.setItem("loggedUser", JSON.stringify(loggedUserData));  //setting fetched data as logged user data
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
              setLoggedUser(null);
            });
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setLoggedUser(null);
      }
    } else {
      setLoggedUser(null);
    }
  }, []);

  return (
    <UserContext.Provider value={loggedUser}>{children}</UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
