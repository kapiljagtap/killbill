import React from 'react';
import axios from "axios";
import Layout from "./Layout";
import moment from "moment";
import {FadeLoader} from "react-spinners";

export default class Top5Services extends React.Component {
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
	renderTop5Services() {
		let {services, currentYear, currentMonth} = this.state;
		let topServices = [];
		if (services && services[currentYear] && services[currentYear][currentMonth]) {
			topServices = services[currentYear][currentMonth].sort((serviceA, serviceB) => {
				return serviceA.amount < serviceB.amount;
			});
			let length = topServices.length;
			if(length > 5){
				length = 5;
			}
			let dom = [];
			for(let index = 0; index < length; index++){
				var finalAmount = Number(topServices[index].amount.toFixed(2))
				dom.push(<div>
					<b>{topServices[index].key}</b><br/>$ {finalAmount}
				</div>);
			}
			return(<div>
				{dom}
			</div>);
		}
	}
	
	render() {
		return(
			<div>
				{this.state.loading && <FadeLoader/>}
				{!this.state.loading &&
			<Layout>
					<h4><u>Top 5 Services</u></h4>
					{this.renderTop5Services()}
			</Layout>
				}
			</div>
		)
	}
}