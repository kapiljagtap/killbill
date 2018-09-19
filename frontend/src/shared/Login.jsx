import React from 'react';
import {Button, Col, FormControl, InputGroup, Row} from 'react-bootstrap';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            accessKey: "",
            accessSecretKey: "",
            verifying: false
        };

        this.handleVerifyKey = this.handleVerifyKey.bind(this);
    }

    handleFormField(key, e) {
        let state = this.state;
        state[key] = e.target.value;
        this.setState(state);
    }

    handleVerifyKey(){
    }

    render() {
        const {accessKey, accessSecretKey, verifying} = this.state;
        return (
            <div>
                <h2>Login Page</h2>
                <Row>
                    <Col xs={12}>
                        <label>Access key</label>
                        <InputGroup>
                            <FormControl name="accesskey"
                                         id="accesskey"
                                         type="text"
                                         value={accessKey}
                                         onChange={this.handleFormField.bind(this, "accessKey")}/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <label>Secret Access key</label>
                        <InputGroup>
                            <FormControl name="accessSecretkey"
                                         id="accessSecretkey"
                                         type="text"
                                         value={accessSecretKey}
                                         onChange={this.handleFormField.bind(this, "accessSecretKey")}/>
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Button id='authButton'
                        bsStyle="primary"
                        disabled={ !(accessKey && accessSecretKey) || verifying }
                        onClick={ this.handleVerifyKey }>
                    Verify Keys
                </Button>
            </div>
        );
    }
}