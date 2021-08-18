import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, LineChartOutlined } from '@ant-design/icons';

const { Item } = Menu;

const Navbar: React.FC = () => {
  let location = useLocation();
  return (
    <Menu mode="horizontal" selectedKeys={[location.pathname]}>
      <Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      <Item key="/stats" icon={<LineChartOutlined />}>
        <Link to="/stats">Stats</Link>
      </Item>
      <Item key="/logout" style={{ position: 'absolute', right: '7px' }}>
        <Link to="/logout">Log out</Link>
      </Item>
    </Menu>
  );
};

export default Navbar;
