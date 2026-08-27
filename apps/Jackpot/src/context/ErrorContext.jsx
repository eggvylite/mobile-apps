import React, { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errorMsg, setErrormsg] = useState("");

  const changeErrmsg = (msg) => {
    setErrormsg(msg);
  };

  const clearerrMsg = () => {
    setErrormsg("");
  };

  return (
    <ErrorContext.Provider value={{ errorMsg, changeErrmsg, clearerrMsg }}>
      {children}
    </ErrorContext.Provider>
  );
};