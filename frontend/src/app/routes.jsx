import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Login from '../shared/Login.jsx';
import Home from './Home.jsx';
import Dashboard from './Dashboard';

export default [
    <IndexRoute key="index" component={ Home }/>,
    <Route key='login' path="login" component={ Login } noAuth={ true } noHeader={ true } />,
    <Route key='dashboard' path="dashboard" component={ Dashboard } noAuth={ true }>
        <IndexRoute component={ Dashboard }/>
    </Route>,
];
