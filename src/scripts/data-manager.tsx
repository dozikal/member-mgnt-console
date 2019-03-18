let groupCount: number = 5;
let userCount: number = 7;

const nodes: { [key: string]: { name: string, type: string } } = {
    "g1": { name: "Group 1", type: "group" },
    "g2": { name: "Group 2", type: "group" },
    "g3": { name: "Group 3", type: "group" },
    "g4": { name: "Group 4", type: "group" },
    "g5": { name: "Group 5", type: "group" },
    "u1": { name: "User 1", type: "user" },
    "u2": { name: "User 2", type: "user" },
    "u3": { name: "User 3", type: "user" },
    "u4": { name: "User 4", type: "user" },
    "u5": { name: "User 5", type: "user" },
    "u6": { name: "User 6", type: "user" },
    "u7": { name: "User 7", type: "user" },
};
const isMemberOfGraph: { from: string, to: string }[] = [
    { from: "g2", to: "g1" },
    { from: "g3", to: "g1" },
    { from: "g4", to: "g1" },
    { from: "u1", to: "g2" },
    { from: "u2", to: "g2" },
    { from: "u3", to: "g3" },
    { from: "u4", to: "g3" },
    { from: "u5", to: "g4" },
    { from: "u6", to: "g4" },
    { from: "u7", to: "g5" },
];
const groups: { [key: string]: { name: string, type: string } } = {
    "g1": { name: "Group 1", type: "group" },
    "g2": { name: "Group 2", type: "group" },
    "g3": { name: "Group 3", type: "group" },
    "g4": { name: "Group 4", type: "group" },
    "g5": { name: "Group 5", type: "group" },
};
const users: { [key: string]: { name: string, type: string } } = {
    "u1": { name: "User 1", type: "user" },
    "u2": { name: "User 2", type: "user" },
    "u3": { name: "User 3", type: "user" },
    "u4": { name: "User 4", type: "user" },
    "u5": { name: "User 5", type: "user" },
    "u6": { name: "User 6", type: "user" },
    "u7": { name: "User 7", type: "user" },
};

//Create a new node/vertex
function CreateNode(name: string, type: string, callback: (isValid: boolean, id: string) => void) {

    //Check if the new name is unique.
    //However the program identifies items by key and not names.
    if (isNewNameUnique(name)) {
        var id: string;

        if (type === 'group') {
            groupCount++;
            id = 'g' + groupCount;
            groups[id] = { name: name, type: type };
        }

        else {
            userCount++;
            id = 'u' + userCount;
            users[id] = { name: name, type: type }
        }

        nodes[id] = { name: name, type: type }

        callback(true, id);
        return;
    }
    else {
        callback(false, '');
        return;
    }
}

//Function to check uiquness of a proposed new name
function isNewNameUnique(testName: string) {
    for (var key in nodes) {
        if (nodes.hasOwnProperty(key)) {
            if (nodes[key].name === testName)
                return false;
        }
    }
    return true;
}

//Delete a node (group or user) from the node list
function DeleteNode(key: string, callback: (isValid: boolean) => void) {

    const listOfEdges = [...isMemberOfGraph].filter(x => x.to === key || x.from === key);

    //1) Remove all the edges linking to that node
    //2) Delte the node
    RemoveEdge(listOfEdges, (res) => {
        if (res == true) {
            delete nodes[key];
            callback(true);
        }
    });
}


//Function that adds a new edge, ie adds a group or user to a group
function AddEdge(from: string, to: string, callback: (isValid: boolean, message: string) => void) {

    // 1) Check if that item is already part of that group
    var isExists = isMemberOfGraph.map(e => { return e.from + e.to; }).indexOf(from + to);
    
    if (isExists !== -1) {
        callback(false, 'The item is already in this group');
        return;
    }

    // 2) Check if adding the new edge will not cause a cycle
    var cycle = BFS(() => { }, to, { from: from, to: to });

    if (cycle.length > 0) {
        callback(false, 'This item cannot be add to this group because it will cause a cycle.');
        return;
    }
    
    // 3) If both conditions pass then add the new edge
    isMemberOfGraph.push({ from: from, to: to });
    callback(true, 'New member successfully added.');
    return;
}

//Function to delete and edge ie Remove a group or user from a group
//Can be used to delete a list of edges
function RemoveEdge(edges: { from: string, to: string }[], callback: (res: boolean, message: string) => void): void {

    for (var edge in edges) {
        var from = edges[edge].from;
        var to = edges[edge].to;

        //Find the index of the edge
        var indexOfEdge = isMemberOfGraph.map(e => { return e.from + e.to; }).indexOf(from + to);
        
        //Delete the edge
        if (indexOfEdge != -1) {
            isMemberOfGraph.splice(indexOfEdge, 1);

        }
    }

    callback(true, 'The item has been removed from this group.');
    return;
}

// Breadth First Search
// 3 arguments - Check to see if adding a node will cause a cycle
// 1 argument - Generate a simplified adjacency matrix (Used for dieplay of the graph)
function BFS(callback: (node: string, childNodes: string[]) => void, startingNode?: string, temporalNode?: { from: string, to: string }, ) {
    let queue = Object.keys(nodes).map(node => [node]);
    let edges = [...isMemberOfGraph];

    // Set starting node to get results faster
    if (startingNode != undefined) {
        queue.sort((x, y) => { return x[0] == startingNode ? -1 : y[0] == startingNode ? 1 : 0; });
    }

    // Edge to check for cycle
    if (temporalNode != undefined) {
        edges = [...edges, ...[temporalNode]];
    }

    while (queue.length) {
        const batch = [];

        for (const path of queue) {
            const children = [...edges].filter(x => x.to === path[0]).map(y => y.from);
            callback(path[0], children);

            for (const node of children) {
                if (node === path[path.length - 1]) return [node, ...path];
                batch.push([node, ...path]);
            }
        }
        queue = batch;
    }
    return [];
}

//Functions to return specific values
function GetNodes(): any { return nodes }
function GetEdges(): any { return isMemberOfGraph }
function GetGroups(): any { return groups }
function GetUsers(): any { return users }
function GetTotalCount(): any {return {groups: groupCount, users: userCount}}

export {
    GetTotalCount,
    CreateNode,
    DeleteNode,
    GetNodes,
    GetGroups,
    GetUsers,
    GetEdges,
    RemoveEdge,
    AddEdge,
    BFS,
};