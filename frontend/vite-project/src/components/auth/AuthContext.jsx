// AuthContext.js
import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../../assets/API/API_URL";
import { ServerVariables } from "./ServerVariable";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    (localStorage.access_token) || null
  );
  // console.log("current user");
  // console.log(localStorage.access_token)
  // console.log(currentUser)

  const login = useCallback(async (inputs) => {
    console.log(inputs);
      // const res = await axios.post(API_URL + ServerVariables.Login, inputs);
      setCurrentUser(inputs.email);
     
  }, []);

  const logout = useCallback(async () => {
      setCurrentUser(null);

  }, []);

  useEffect(() => {
    if (currentUser) {
      // localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  const authContextValue = useMemo(() => ({ currentUser, login, logout }), [currentUser, login, logout]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
