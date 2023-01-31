import React from "react";
import "./styles.css";

const Layout = ({ children }: { children: JSX.Element }) => {
  return <div className="layout">{children}</div>;
};

export default Layout;
