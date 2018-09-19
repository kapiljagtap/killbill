import React from 'react';
import axios from "axios";
import moment from "moment";
import {
    DiscreteColorLegend,
    HorizontalBarSeries,
    HorizontalGridLines,
    VerticalGridLines,
    XAxis,
    XYPlot
} from "react-vis";

import "../../node_modules/react-vis/dist/style.css";
//import DiscreteColorLegend from 'legends/discrete-color-legend';
import Layout from "./Layout";
import {FadeLoader} from "react-spinners";

const colorList = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: {},
            currentYear: "",
            currentMonth: "",
            total: 0,
            loading: false
        };
    }

    componentDidMount() {
        this.setState({loading: true}, () => {
            axios.get('https://m3f5sd3uo6.execute-api.us-west-2.amazonaws.com/Dev').then((res) => {
                if (res.status === 200 && res.data && res.data.result) {
                    this.parseData(res.data.result);
                } else {
                    this.setState({
                        loading: false
                    });
                }
            }).catch(() => {
                this.setState({
                    loading: false
                });
            });
        });
    }

    parseData(data) {
        let total = 0;
        let services = {};
        if (data && data.ResultsByTime) {
            if (data.ResultsByTime.length > 0) {
                const date = moment(data.ResultsByTime[0].TimePeriod.Start);
                const year = date.year();
                const month = date.month();
                let groups = data.ResultsByTime[0].Groups;
                if (groups && groups.length > 0) {
                    for (let group of groups) {
                        const amount = parseFloat(group.Metrics.BlendedCost.Amount);
                        total += amount;
                        if (!services[year]) {
                            services[year] = {};
                        }
                        if (!services[year][month]) {
                            services[year][month] = [];
                        }
                        services[year][month].push({key: group.Keys[0], amount: amount});
                    }
                    this.setState({
                        services,
                        total,
                        currentYear: year,
                        currentMonth: month,
                        loading: false
                    });
                }
            }
        }
    }

    renderMonthlySpend() {
        const totalAmount = Number(this.state.total.toFixed(2));
        return (
            <div>
                <XYPlot
                    width={250}
                    height={100}
                    stackBy="x">
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis/>
                    <HorizontalBarSeries
                        data={[
                            {y: 0, x: this.state.total, year: this.state.currentYear}
                        ]}
                    />
                    <HorizontalBarSeries
                        data={[
                            {y: 0, x: 200.00, year: this.state.currentYear}
                        ]}
                    />
                    <DiscreteColorLegend
                        items={[{"title": `Spend - $ ${totalAmount}`}]}
                    />
                </XYPlot>
            </div>
        );
    }


    render() {
        return (
            <div>
                {this.state.loading && <FadeLoader/>}
                {!this.state.loading &&
                <Layout>
                    <div style={{paddingBottom: "20px"}}>
                        <h2><u>Dashboard</u></h2>
                        <label>{`Showing data for: ${monthName[this.state.currentMonth]}-${this.state.currentYear}`}</label>
                        <h4><u>Monthly Spend</u></h4>
                        {this.renderMonthlySpend()}
                    </div>
                </Layout>
                }
            </div>
        );
    }
}