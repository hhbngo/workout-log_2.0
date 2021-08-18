import React, { useEffect, useMemo } from 'react';
import { FirebaseAuth } from './firebase';
import { authSuccess, authFalse, resetExercises } from './store/actions';
import { StoreState } from './store/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import './App.css';

import routesConfig from './routesConfig';

const App: React.FC = () => {
  const { authed } = useSelector((state: StoreState) => state.auth);
  let dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = FirebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(authSuccess(user));
      } else {
        dispatch(authFalse());
        dispatch(resetExercises());
      }
    });

    return () => unsubscribe();
  }, []);

  const mapRoutes = (authed: boolean | null): JSX.Element[] => {
    const routes = [];
    for (const route in routesConfig) {
      let { path, component, requireAuth, loggedInAccess } =
        routesConfig[route];
      if ((authed && loggedInAccess) || (!authed && !requireAuth)) {
        routes.push(
          <Route key={route} path={path} component={component} exact />
        );
      }
    }
    return routes;
  };

  const routes = useMemo(() => mapRoutes(authed), [authed]);

  return authed === null ? null : (
    <>
      {authed && <Navbar />}
      <Switch>
        {routes}
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default App;
