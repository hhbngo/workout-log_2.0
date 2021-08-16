import { FunctionComponent } from 'react';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Logout from './pages/Logout/Logout';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import Entry from './pages/Entry/Entry';
import Stats from './pages/Stats/Stats';

export interface RouteProps {
  [key: string]: {
    path: string;
    component: FunctionComponent;
    requireAuth: boolean;
    loggedInAccess: boolean;
  };
}

const routesConfig: RouteProps = {
  login: {
    path: '/login',
    component: Login,
    requireAuth: false,
    loggedInAccess: false,
  },
  register: {
    path: '/register',
    component: Register,
    requireAuth: false,
    loggedInAccess: false,
  },
  logout: {
    path: '/logout',
    component: Logout,
    requireAuth: true,
    loggedInAccess: true,
  },
  entry: {
    path: '/entry',
    component: Entry,
    requireAuth: true,
    loggedInAccess: true,
  },
  stats: {
    path: '/stats',
    component: Stats,
    requireAuth: true,
    loggedInAccess: true,
  },
  landing: {
    path: '/',
    component: Landing,
    requireAuth: false,
    loggedInAccess: false,
  },
  home: {
    path: '/',
    component: Home,
    requireAuth: true,
    loggedInAccess: true,
  },
};

export default routesConfig;
