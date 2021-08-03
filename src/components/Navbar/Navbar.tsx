import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface NavbarProps {
  isAuth: boolean;
}

const { Item } = Menu;

const Navbar: React.FC<NavbarProps> = ({ isAuth }) => {
  let location = useLocation();
  return (
    <Menu mode="horizontal" selectedKeys={[location.pathname]}>
      <Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      {isAuth ? (
        <Item key="/logout" style={{ position: 'absolute', right: '7px' }}>
          <Link to="/logout">Log out</Link>
        </Item>
      ) : (
        <Item key="/login" style={{ position: 'absolute', right: '7px' }}>
          <Link to="/login">Login</Link>
        </Item>
      )}
    </Menu>
  );
};

export default Navbar;
