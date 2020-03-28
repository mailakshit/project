onload = function () {
    // create a network
    let curr_data;
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    // initialise graph options
    const options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf183',
                size: 50,
                color: '#991133',
            }
        }
    };
    // initialize your network!
    let network = new vis.Network(container);
    network.setOptions(options);
    let network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData(){
        const sz = Math.floor(Math.random() * 8) + 2;

        // Adding people to nodes array
        let nodes = [];
        for(let i=1;i<=sz;i++){
            nodes.push({id:i, label:"Person "+i})
        }
        nodes = new vis.DataSet(nodes);

        // Dynamically creating edges with random amount to be paid from one to another friend
        const edges = [];
        for(let i=1;i<=sz;i++){
            for(let j=i+1;j<=sz;j++){
                // Modifies the amount of edges added in the graph
                if(Math.random() > 0.5){
                    // Controls the direction of cash flow on edge
                    if(Math.random() > 0.5)
                        edges.push({from: i, to: j, label: String(Math.floor(Math.random()*100)+1)});
                    else
                        edges.push({from: j, to: i, label: String(Math.floor(Math.random()*100)+1)});
                }
            }
        }
        const data = {
            nodes: nodes,
            edges: edges
        };
        return data;
    }

    genNew.onclick = function () {
        const data = createData();
        curr_data = data;
        network.setData(data);
        temptext.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function () {
        temptext.style.display  = "none";
        container2.style.display = "inline";
        const solvedData = solveData();
        network2.setData(solvedData);
    };

    function solveData() {
        let data = curr_data;
        const sz = data['nodes'].length;
        const vals = Array(sz).fill(0);
        // Calculating net balance of each person
        for(let i=0;i<data['edges'].length;i++) {
            const edge = data['edges'][i];
            vals[edge['to'] - 1] += parseInt(edge['label']);
            vals[edge['from'] - 1] -= parseInt(edge['label']);
        }

        const new_edges = [];
        for(let i=0;i<sz;i++){
            // Person has to receive money
            if(vals[i]>0){
                for(let j=0;j<sz && vals[i]>0;j++){
                    // Person has to give money
                    if(vals[j]<0){
                        // Amount to be received is greater than amount to be paid by J
                        if(vals[j]+vals[i]>=0){
                            new_edges.push({from: j+1, to:i+1, label: String(Math.abs(vals[j]))});
                            vals[i]+=vals[j];
                            vals[j] = 0;
                        } else{ // Amount to be received is lesser than amount to be paid by J
                            new_edges.push({from: j+1, to:i+1, label: String(vals[i])});
                            vals[j]+=vals[i];
                            vals[i] = 0;
                        }
                    }
                }
            }
        }

        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    genNew.click();

};
