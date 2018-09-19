import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, Route, Router} from 'react-router';
import Dashboard from "./app/Dashboard";
import Login from "./shared/Login";
import MonthlyReport from "./app/MonthlyReport";
import DailyReport from './app/DailyReport';
import HourlyReport from './app/HourlyReport';
import EC2 from './app/EC2';
import Top5Services from './app/Top5Services';
import registerServiceWorker from './registerServiceWorker';
import BillByServices from './app/BillByServices';


var router = <Router history={browserHistory}>
    <Route component={Dashboard} path="/"/>
    <Route path="login" component={Login} noAuth={true} noHeader={true}/>
    <Route path="monthly-report" component={MonthlyReport}/>
    <Route path="daily-report" component={DailyReport}/>
    <Route path="hourly-report" component={HourlyReport}/>
    <Route path="ec2" component={EC2}/>
    <Route path="services" component={Top5Services}/>
    <Route path="byservices" component={BillByServices}/>
</Router>;

ReactDOM.render(router, window.document.getElementById('root'));
registerServiceWorker();