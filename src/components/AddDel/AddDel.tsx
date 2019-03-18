import React, { Component } from 'react';
import './AddDel.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import { CreateNode, DeleteNode, GetNodes, } from '../../scripts/data-manager';


class AddDel extends Component<{ refreshFunc: () => void }, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            createItemName: '',
            createItemType: '',
            delItemName: '',
            delItemType: '',
            isCreateValidated: false,
            isDelValidated: false,
            nodes: GetNodes(),
            notification: {
                toNotify: true,
                type: null,
                message: '',
            },
        }
        //this.setInterface = this.setInterface.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {

        return (
            <div>
                <div className="ad-container1">
                    <Fade in={this.state.notification.toNotify}>
                        <Alert key="alert" variant={this.state.notification.type}>
                            {this.state.notification.message}
                        </Alert>
                    </Fade>
                </div>

                <Tabs defaultActiveKey="create" id="tabHolder">
                    <Tab eventKey="create" title="Create">
                        <Form name="create-form" noValidate validated={this.state.isCreateValidated} onSubmit={this.handleSubmit} >
                            <Form.Group controlId="create-input">
                                <Form.Label>Name: </Form.Label>
                                <Form.Control
                                    name="create-input"
                                    required
                                    pattern="[a-zA-Z0-9 ]{2,20}"
                                    maxLength={20}
                                    type="text"
                                    placeholder="Enter name"
                                    value={this.state.createItemName}
                                    onChange={this.handleChange}
                                />
                                <Form.Control.Feedback></Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Must be 2 - 20 characters long and unique.</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="create-select">
                                <Form.Label>Type: </Form.Label>
                                <Form.Control name='create-select' value={this.state.createItemType} required as="select" onChange={this.handleChange}>
                                    <option value="">-- select one --</option>
                                    <option value="group">Group</option>
                                    <option value="user">User</option>
                                </Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Choose a type.</Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col xs={4}>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="light" onClick={() => this.clearInput(0)}>Clear</Button>
                                </Col>
                                <Col xs={4}>
                                    <Button type="submit">Create</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Tab>

                    <Tab eventKey="delete" title="Delete">
                        <Form name="del-form" noValidate validated={this.state.isDelValidated} onSubmit={this.handleSubmit} >
                            <Form.Group controlId="del-select">
                                <Form.Label>Name: </Form.Label>
                                <Form.Control name='del-select' value={this.state.delItemName} required as="select" onChange={this.handleChange}>
                                    <option value="">-- select one --</option>
                                    {this.generateDelItemList()}
                                </Form.Control>
                                <Form.Control.Feedback></Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Choose an item.</Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col xs={4}>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="light" onClick={() => this.clearInput(1)}>Clear</Button>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="danger" type="submit">Delete</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Tab>
                </Tabs >
            </div>
        );
    }


    // Handle any changes to the form
    handleChange(e: any) {
        switch (e.target.name) {
            case 'create-input':
                this.setState({ createItemName: e.target.value });
                break;

            case 'create-select':
                this.setState({ createItemType: e.target.value });
                break;

            case 'del-select':
                this.setState({ delItemName: e.target.value });
                break;

            default:
                break;
        }
    }


    // Handle any form submits
    handleSubmit(e: any) {

        switch (e.target.name) {
            case 'create-form':
                if (e.target.checkValidity() === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                else {
                    CreateNode(this.state.createItemName.trim(), this.state.createItemType, (res, id) => {
                        if (res) {
                            this.notify(res, "A new Item been created with id: " + id);
                            setTimeout(() => {
                                this.clearInput(0);
                            }, 300);
                            this.props.refreshFunc();
                        }
                        else {
                            this.setState({ createItemName: '' });
                            this.notify(res, "The name is not unique");
                        }
                    });
                }
                this.setState({ isCreateValidated: true });
                break;

            case 'del-form':
                if (e.target.checkValidity() === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                else {
                    DeleteNode(this.state.delItemName, (res) => {
                        this.notify(res, "The item was sucessfully deleted.");
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
            this.setState({ notification: { toNotify: true, type: 'success', message: message } });
        }
        else {
            this.setState({ notification: { toNotify: true, type: 'danger', message: message } })
        }

        setTimeout(() => {
            this.setState({ notification: { toNotify: false } })
        }, 7000);
    }

    
    // Function to clear Forms
    clearInput = (index: number) => {

        if (index === 0) this.setState({ createItemName: '', createItemType: '', isCreateValidated: false });

        else this.setState({ delItemName: '', delItemType: '', isDelValidated: false });

    }


    // Function to  generate a list of items that can be deleted 
    generateDelItemList = () => {
        var listItems = Object.keys(this.state.nodes).map((key) => {
            return (<option key={key} value={key}>{this.state.nodes[key].name}</option>);
        });
        return listItems;
    }
}

export default AddDel;
