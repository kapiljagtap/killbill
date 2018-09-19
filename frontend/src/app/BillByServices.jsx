import React from 'react';
import axios from "axios";
import Layout from "./Layout";
import moment from "moment";
import {FadeLoader} from "react-spinners";
import {
	DiscreteColorLegend,
	HorizontalBarSeries,
	HorizontalGridLines,
	RadialChart,
	VerticalGridLines,
	XAxis,
	XYPlot
} from "react-vis";

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

export default class BillByServices extends React.Component {
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

	renderByServices() {
		let data = [];
		let legends = [];
		const {services, currentYear, currentMonth, total} = this.state;
		if (services && services[currentYear] && services[currentYear][currentMonth]) {
			services[currentYear][currentMonth].forEach((service, index) => {
				const percentageShare = Math.round((service.amount / total) * 100);
				data.push({angle: percentageShare, color: colorList[index], label: service.key});
				legends.push({title: service.key + ' (' + percentageShare + '%)', color: colorList[index]});
			});
		}
		return (
			<div>
				<RadialChart
					colorType={'literal'}
					colorDomain={[0, 100]}
					colorRange={[0, 10]}
					margin={{top: 100}}
					data={data}
					labelsRadiusMultiplier={1}
					labelsStyle={{fontSize: 8, fill: '#222'}}
					showLabels={false}
					style={{stroke: '#fff', strokeWidth: 2}}
					width={250}
					height={250}
				>
				</RadialChart>

				<DiscreteColorLegend
					orientation="vertical"
					items={legends}
				/>
			</div>
		);
	}

	render() {
		return(
			<div>
				{this.state.loading && <FadeLoader/>}
				{!this.state.loading &&
		<Layout>
			<h4><u>Bill By Services</u></h4>
			{this.renderByServices()}
		</Layout>
				}
			</div>
		)
	}
}