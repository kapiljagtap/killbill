import React from 'react';
import {HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, XYPlot, YAxis} from "react-vis";
import Layout from "./Layout";
import moment from "moment/moment";
import axios from "axios/index";
import {FadeLoader} from "react-spinners";

const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

export default class MonthlyReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            services: {},
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
        let services = {};
        if (data && data.ResultsByTime) {
            if (data.ResultsByTime.length > 0) {
                for (let resultByTime of data.ResultsByTime) {
                    const date = moment(resultByTime.TimePeriod.Start);
                    const year = date.year();
                    const month = date.month();
                    let total = 0;
                    let groups = resultByTime.Groups;
                    if (groups && groups.length > 0) {
                        for (let group of groups) {
                            const amount = parseFloat(group.Metrics.BlendedCost.Amount);
                            total += amount;
                            if (!services[year]) {
                                services[year] = {};
                            }
                        }
                        services[year][month] = total;
                    }
                }

                this.setState({
                    services,
                    loading: false
                });
            }
        }
    }

    render() {
        let data = [];
        let year = moment().year();
        if(this.state.services){
            if(this.state.services[year-1]){
                Object.keys(this.state.services[year-1]).forEach((month) => {
                   data.push({x: `${year-1}/${monthName[month]}`, y: this.state.services[year-1][month]});
                });
            }
            if(this.state.services[year]){
                Object.keys(this.state.services[year]).forEach((month) => {
                    data.push({x: `${year}/${monthName[month]}`, y: this.state.services[year][month]});
                });
            }
        }
        return (
            <div>
                {this.state.loading && <FadeLoader/>}
                {!this.state.loading &&
            <Layout>
                <div>
                    <XYPlot
                        xType="ordinal"
                        width={700}
                        height={700}>
                        <HorizontalGridLines/>
                        <VerticalGridLines/>
                        <XAxis title="Month" position="start"/>
                        <YAxis title="BlendedCost"/>
                        <VerticalBarSeries
                            className="first-series"
                            data={data}
                            />
                    </XYPlot>
                </div>
            </Layout>
                }
            </div>
        );
    }
}