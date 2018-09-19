import React from 'react';
import axios from "axios";
import Layout from "./Layout";
import {FadeLoader} from "react-spinners";

export default class ActionsEc2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "Loading...",
            instances: [],
            response: "Action response will appear here",
            loading: false,
            instance: ""
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.setState({loading: true}, () => {
            axios.get('https://rj0nmabr0j.execute-api.us-west-2.amazonaws.com/DEV')
                .then((res) => {
                    if (res.status === 200) {
                        var instances = [];
                        res.data.result.Reservations.map(function (reservation) {
                            var instanceId = reservation.Instances[0].InstanceId;
                            var state = reservation.Instances[0].State.Name;
                            var object = {"instanceId": instanceId, "state": state};
                            instances.push(object);
                            console.log("instances: " + instanceId + "," + state);
                        });
                        this.setState({
                            data: res.data.result,
                            instances: instances,
                            loading: false
                        });
                    }
                })
                .catch((ex) => {
                    this.setState({
                        loading: false
                    });
                    console.log("Exception: " + ex);
                });
        });

    }

    click() {
        const postData = {};
        postData["int"] = this.state.instance || "i-0a39fcfae686eaa11";
        postData["act"] = "stop";

        axios.post("https://rj0nmabr0j.execute-api.us-west-2.amazonaws.com/DEV", postData)
            .then((response) => {
                console.log("response: " + JSON.stringify(response));
                alert(JSON.stringify(response));
            })
            .catch((err) => {
                console.log("err: " + err);
            });
    }

    onRadioClicked(instanceId){
        this.setState({
            instance: instanceId
        });
    }

    getList() {
        return this.state.instances.map((object) => {
            return (
                <div>
                    <div>
                        <div><b>InstanceId:</b> {object.instanceId}</div>
                        <div><b>State:</b> {object.state}</div>
                        <div><b>Action:</b>
                            <br/><input type="radio" name="action" value="stop" onClick={this.onRadioClicked.bind(this,object.instanceId)}/> STOP
                            <br/><input type="radio" name="action" value="restart" onClick={this.onRadioClicked.bind(this,object.instanceId)}/> RESTART
                            <br/><input type="radio" name="action" value="terminate" onClick={this.onRadioClicked.bind(this,object.instanceId)}/> TERMINATE
                        </div>
                        {/*<div><input type="button" value="Proceed"/></div>*/}
                    </div>
                    <br/>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.state.loading && <FadeLoader/>}
                {!this.state.loading &&
            <Layout>
                <div>
                    <div><h2><u>List of EC2 Instances</u></h2></div>
                    <div>{this.getList()}</div>
                    <div><input type="button" value="Submit" onClick={this.click}/></div>
                </div>

            </Layout>
                }
                </div>
        );
    }
}

