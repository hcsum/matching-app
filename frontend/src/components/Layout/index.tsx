import { LeftOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Layout = ({
  children,
  noNav,
}: {
  children: JSX.Element;
  noNav?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className="layout">
      <Space align="start" style={{ width: "100%", marginBottom: "16px" }}>
        {noNav ?? (
          <Button
            type="default"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          />
        )}
      </Space>
      {children}
    </div>
  );
};

export default Layout;
