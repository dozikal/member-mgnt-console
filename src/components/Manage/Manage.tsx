import React, { Component } from 'react';
import './Manage.css';
import { GetGroups, GetNodes, GetEdges, RemoveEdge, AddEdge } from '../../scripts/data-manager';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Fade from 'react-bootstrap/Fade';

class Manage extends Component<{ refreshFunc: () => void }, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            interface: 0,
            groups: GetGroups(),
            nodes: GetNodes(),
            edges: GetEdges(),
            addGroupKey: '',
            addMemberKey: '',
            remGroupKey: '',
            remMemberKey: '',
            isAddValidated: false,
            isRemValidated: false,
            memberList: null,
            possibleMemberList: null,
            notification: {
                toNotify: true,
                type: null,
                message: '',
            },
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <div className="m-container1">
                    <Fade in={this.state.notification.toNotify}>
                        <Alert key="alert" variant={this.state.notification.type}>
                            {this.state.notification.message}
                        </Alert>
                    </Fade>
                </div>

                <Tabs defaultActiveKey="add" id="uncontrolled-tab-example">
                    <Tab eventKey="add" title="Add">
                        <Form name="add-form" noValidate validated={this.state.isAddValidated} onSubmit={this.handleSubmit} >
                            <Form.Group controlId="add-select1">
                                <Form.Label>Group: </Form.Label>
                                <Form.Control name='add-select1' value={this.state.addGroupKey} required as="select" onChange={this.handleChange}>
                                    <option value="">-- select one --</option>
                                    {this.generateGroupList()}
                                </Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Choose an Group.</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="add-select2">
                                <Form.Label>User/Group: </Form.Label>
                                <Form.Control name='add-select2' value={this.state.addMemberKey} required as="select" onChange={this.handleChange}>
                                    <option value="">-- select one --</option>
                                    {this.state.possibleMemberList}
                                </Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Choose an item.</Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col xs={4}>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="light" onClick={() => { this.clearInput(0) }}>Clear</Button>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="primary" type="submit">Add</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Tab>

                    <Tab eventKey="remove" title="Remove">
                        <Form name="rem-form" noValidate validated={this.state.isRemValidated} onSubmit={this.handleSubmit} >
                            <Form.Group controlId="rem-select1">
                                <Form.Label>Group: </Form.Label>
                                <Form.Control name='rem-select1' value={this.state.remGroupKey} required as="select" onChange={this.handleChange}>
                                    <option value="">-- select one --</option>
                                    {this.generateGroupList()}
                                </Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Choose an Group.</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="rem-select2">
                                <Form.Label>User/Group: </Form.Label>
                                <Form.Control name='rem-select2' value={this.state.remMemberKey} required as="select" onChange={this.handleChange}>
                                    <option value="">-- select one --</option>
                                    {this.state.memberList}
                                </Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Choose an member.</Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col xs={4}>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="light" onClick={() => { this.clearInput(1) }}>Clear</Button>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="danger" type="submit">Remove</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Tab>
                </Tabs>
            </div>
        );
    }


    //Handle any changes to the forms
    handleChange(e: any) {
        switch (e.target.name) {
            case 'add-select1':
                this.setState({ addGroupKey: e.target.value }, () => {
                    this.generatePossibleMemberList();
                });
                break;

            case 'add-select2':
                this.setState({ addMemberKey: e.target.value });
                break;

            case 'rem-select1':
                this.setState({ remGroupKey: e.target.value }, () => {
                    this.generateMemberList();
                });
                break;

            case 'rem-select2':
                this.setState({ remMemberKey: e.target.value });
                break;

            default:
                break;
        }
    }


    // Handle any form submits
    handleSubmit(e: any) {
        switch (e.target.name) {
            case 'add-form':
                if (e.target.checkValidity() === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                else {
                    AddEdge(this.state.addMemberKey, this.state.addGroupKey, (res, msg) => {
                        this.notify(res, msg);
                        setTimeout(() => {
                            this.clearInput(0);
                        }, 300);
                        this.props.refreshFunc();
                    });
                }
                break;

            case 'rem-form':
                if (e.target.checkValidity() === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                else {
                    RemoveEdge([{ from: this.state.remMemberKey, to: this.state.remGroupKey }], (res, msg) => {
                        this.notify(res, msg);
                        setTimeout(() => {
                            this.clearInput(1);
                        }, 300);
                        this.props.refreshFunc();
                    });
                }
                break;

            default:
                break;
        }
        e.preventDefault();
    }
    

    // Function to display a notification message
    notify(res: boolean, message: string) {
        if (res) {
            this.setState({ notification: { toNotify: true, type: 'success', message: message } })
        }
        else {
            this.setState({ notification: { toNotify: true, type: 'danger', message: message } })
        }

        setTimeout(() => {
            this.setState({ notification: { toNotify: false } })
        }, 7000);
    }


    // Function to clear the forms
    clearInput = (index: number) => {

        if (index === 0) this.setState({ addGroupKey: '', addMemberKey: '', isAddValidated: false });

        else this.setState({ remGroupKey: '', remMemberKey: '', isRemValidated: false });

    }


    // Generate a list of all groups
    generateGroupList = () => {
        var listItems = Object.keys(this.state.groups).map((key) => {
            return (<option key={key} value={key}>{this.state.groups[key].name}</option>);
        });
        return listItems;
    }


    //Generate a list of all Items that can be added to a group
    generatePossibleMemberList = () => {
        const nodes = JSON.parse(JSON.stringify(this.state.nodes));
        delete nodes[this.state.addGroupKey];

        var listItems = Object.keys(nodes).map((key) => {
            return (<option key={key} value={key}>{nodes[key].name}</option>);
        });
        this.setState({ possibleMemberList: listItems });
    }


    //Generate a list of all members in a group
    generateMemberList = () => {
        const nodes = JSON.parse(JSON.stringify(this.state.nodes));
        var list: { from: string, to: string }[] = [...this.state.edges].filter(x => x.to === this.state.remGroupKey);

        var list2: string[] = list.map(a => a.from);

        const filtered: { [key: string]: { name: string, type: string } } = Object.keys(nodes)
            .filter(key => list2.includes(key))
            .reduce((obj: { [key: string]: { name: string, type: string } }, key) => {
                obj[key] = nodes[key];
                return obj;
            }, {});

        var listItems = Object.keys(filtered).map((key) => {
            return (<option key={key} value={key}>{filtered[key].name}</option>);
        });
        this.setState({ memberList: listItems });
    }
}

export default Manage;