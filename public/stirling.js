function stirling(n, k){
	//return 0 if no partitions can be made
	if(invalidPartition(n,k)){
		return 0
	}
	if(n===k || k===1 ){
		return 1
	}
	return stirling(n-1, k-1) + k*stirling(n-1, k)
}

function invalidPartition(n, k){
	return !n || !k || n<=0 || k<=0 || k>n
}

function stirlingJSON(n, k){
	var result = {}
	if(invalidPartition(n,k)) return result
	var stir = stirling(n,k)
	result.txt = stir + ' ' + k +'-part partitions of a ' + n + '-set'
	result.size = stir
	var children = []
	if(!(n===k) && !(k===1)){
		children.push(stirlingJSON(n-1, k-1))
		for(var i = 0; i<k; i++){
			children.push(stirlingJSON(n-1, k))
		}
		result.children = children
	}
	return result

}


//Creates a tree visualization of S(n,k) in the given div. Depends on d3 for force diagram visualization code.
function createStirlingVis(divID, divWidth, divHeight, n, k){
    var w = divWidth,
        h = divHeight,
        node,
        link,
        root,
        initialized=false;
    if(divID.indexOf('#') != 0){
        divID = '#' + divID;  //id and #id are both cool or #id
    }

    var force = d3.layout.force()
        .on("tick", tick)
        .charge(function(d){ return d.size * -120 || -200 })
        .linkDistance(function(d) { return d.target._children ? 80 : 30; })
        .size([w, h - 160])
        .gravity(0.35);

    var vis = d3.select(divID).append("svg:svg")
        .attr("width", w)
        .attr("height", h);



    root = stirlingJSON(n, k);
    root.fixed = true;
    root.x = w / 2;
    root.y = h / 2 ;
    update();

    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
            .nodes(nodes)
            .links(links)
            .start();

        // Update the links…
        link = vis.selectAll("line.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links.
        link.enter().insert("svg:line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        // Exit any old links.
        link.exit().remove();

        // Update the nodes…
        node = vis.selectAll("circle.node")
            .data(nodes, function(d) { return d.id; })
            .style("fill", color);

        node.transition()
            .attr("r", radius);

        // Enter any new nodes.
        node.enter().append("svg:circle")
            .attr("class", "node")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", radius)
            .style("fill", color)
            .on("click", click)
            .call(force.drag);

        // Exit any old nodes.
        node.exit().remove();

        node.append("svg:title")
            .text(function(d) {return d.txt; });

    }

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x = Math.max(radius(d), Math.min(w - radius(d), d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius(d), Math.min(h - radius(d), d.y)); });
    }

// Color leaf nodes orange, and packages white or blue.
    function color(d) {
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    }

    function radius(d){
        //return d.children ? Math.sqrt(d.size*1000) / 10 : Math.sqrt(d.size*1000) / 10;
        return Math.pow(d.size * 1000, 0.55) / 10;

    }

// Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update();
    }

// Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [], i = 0;

        function recurse(node) {
            if (node.children) node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
            if (!node.id) node.id = ++i;
            nodes.push(node);
            //return node.size;
        }

        recurse(root);
        return nodes;
    }

}