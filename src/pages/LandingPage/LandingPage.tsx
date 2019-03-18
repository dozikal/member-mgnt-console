import React, { Component } from 'react';
import './LandingPage.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import AddDel from '../../components/AddDel/AddDel';
import Manage from '../../components/Manage/Manage';
import { BFS, GetNodes } from '../../scripts/data-manager';

class LandingPage extends Component<{}, any> {

    constructor(props: any) {
        super(props)

        this.state = {
            nodes: GetNodes(),
        }
    }


    render() {
        return (
            <div className="lp-container4">

                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">Loop Membership Management</Navbar.Brand>
                </Navbar>

                <Container fluid={true}>

                    <Row>
                        <Col className='lp-container1' xs={12} sm={12} md={4} lg={3}>
                            <Row>
                                <Col className='lp-container6' xs={12} sm={6} md={12}>
                                    <h6>Create/Delete a group or user</h6>
                                    <AddDel refreshFunc={() => { this.refreshFunction() }} />
                                </Col>

                                <Col className='lp-container7' xs={12} sm={6} md={12}>
                                    <h6>Add/Remove members from groups</h6>
                                    <Manage refreshFunc={() => { this.refreshFunction() }} />
                                </Col>
                            </Row>
                        </Col>

                        <Col className='lp-container2' xs={12} sm={12} md={8} lg={9}>
                            <h4>Membership Graph</h4>

                            <div className="lp-container8">
                                {this.generateGraph()}
                            </div>
                        </Col>
                    </Row>  
                </Container>

            </div>
        );
    }


    //Generate the Graph's visual representation
    generateGraph() {
        let adj: { [key: string]: string[] } = {};

        //Use BFS fuunction to generate a simplified adjacency matrix
        BFS((node, children) => {
            adj[node] = children;
        });

        let nodeChildren: string[][] = Object.values(adj);
        let nodes: string[] = Object.keys(this.state.nodes);
        let listOfAllNodeChildren: string[] = [];

        //Combine keys of all nodes that are children to a 1D array 
        for (var i in nodeChildren) {
            listOfAllNodeChildren = [...listOfAllNodeChildren, ...nodeChildren[i]];
        }

        //Filter out the root nodes ie nodes that are not children of other nodes
        let rootNodes: string[] = [];
        rootNodes = nodes.filter(node => { return listOfAllNodeChildren.indexOf(node) == -1; });
        
        //Return 1 node item
        return rootNodes.map((x) => this.graphItem(x, adj));
    }


    //Recursive function that returns a JSX representation of a node
    //This function will call itself repeatedly if depending on the number of child nodes
    graphItem(key: string, adj: { [key: string]: string[] }) {

        var type: string = this.state.nodes[key].type;
        var name: string = this.state.nodes[key].name;
        var id: string = " : " + key;
        var ref = key + Date.now();

        if (type === 'group') {
            return (
                <div ref={ref} className="lp-container3">
                    <div>
                        <Button variant="primary">{name}</Button>
                        <span style={{color: 'grey'}}>{id}</span>
                    </div>
                    {/*Recall self depending on number of nodes*/}
                    {(adj[key].map(x => this.graphItem(x, adj)))}
                </div>
            )
        }
        else {
            return (
                <div ref={ref} className="lp-container3">
                    <div>
                        <Button variant="outline-primary">{name}</Button>
                        <span style={{color: 'grey'}}>{id}</span>
                    </div>
                    {/*Recall self depending on number of nodes*/}
                    {(adj[key].map(x => this.graphItem(x, adj)))}
                </div>
            );
        }
    }

    
    //Refresh state from child component
    refreshFunction() {
        this.setState({ nodes: GetNodes() });
    }
}

export default LandingPage;