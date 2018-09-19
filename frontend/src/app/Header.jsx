import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import {Nav, NavItem} from "react-bootstrap";

export default class Header extends React.Component {
    static displayName = 'Header';

    render() {
        return (
            <Nav>
                {this.renderDashoardLink()}
                {this.renderByServices()}
                {this.renderServices()}
                {this.renderMonthlyLink()}
                {this.renderEC2Link()}
            </Nav>
        );
    }

    renderDashoardLink() {
        return (
            <NavItem href="/">
                Dashboard
            </NavItem>
        );
    }
    renderByServices() {
        return (
            <NavItem href="/byservices">
                Bill by Services
            </NavItem>
        );
    }
    renderServices() {
        return (
            <NavItem href="/services">
                Top 5 Services
            </NavItem>
        );
    }
    renderMonthlyLink() {
        return (
            <NavItem href="/monthly-report">
                Monthly Report
            </NavItem>
        );
    }
    renderEC2Link() {
        return (
            <NavItem href="/ec2">
                EC2 Instances
            </NavItem>
        );
    }
}
