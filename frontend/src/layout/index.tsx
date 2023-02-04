import { Space } from "antd";
import React from "react";
import { useMatches } from "react-router-dom";
import "./styles.css";

type Crumb = (val: unknown) => JSX.Element;
type Match = { handle: { crumb: Crumb } };

function Breadcrumbs() {
  let matches = useMatches();
  let crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => {
      const { handle } = match as Match;
      return Boolean(handle.crumb);
    })
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => {
      const { handle } = match as Match;
      return handle.crumb(match.data);
    });

  return crumbs.slice(-1)[0];
}

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="layout">
      <Space align="start" style={{ width: "100%", marginBottom: "16px" }}>
        <Breadcrumbs />
      </Space>
      {children}
    </div>
  );
};

export default Layout;
