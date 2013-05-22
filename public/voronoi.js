//Takes integer width/height of div, id of div, and an array of colors for the different parts of the graph.


function createVoronoi(width, height, divID, colors ){

    divID = fixDivID(divID);

    var vertices = d3.range(colors.length).map(function(d) {
        return [Math.random() * width, Math.random() * height];
    });

    var svg = d3.select(divID).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "PiYG")

    var path = svg.append("g").selectAll("path");

    redraw();

    function redraw() {
        path = path.data(d3.geom.voronoi(vertices).map(function(d) { return "M" + d.join("L") + "Z"; }), String);
        path.exit().remove();
        path.enter().append("path").attr("style", function(d, i) { return 'fill: ' + colors[i] }).attr("d", String);
        path.order();
    }
}


//Useful for illustrating the same set over and over... but has a LOT of redundant code.
function createConstant4Voronoi(width, height, divID, colors){
    divID = fixDivID(divID);

    var vertices = d3.range(colors.length).map(function(d, i) {
        return [(i)*width/4 + width/8 /*approximation- svg's weird*/, height/2];
    });

    var svg = d3.select(divID).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "PiYG")

    var path = svg.append("g").selectAll("path");

    redraw();

    function redraw() {
        path = path.data(d3.geom.voronoi(vertices).map(function(d) { return "M" + d.join("L") + "Z"; }), String);
        path.exit().remove();
        path.enter().append("path").attr("style", function(d, i) { return 'fill: ' + colors[i] }).attr("d", String);
        path.order();
    }

}


function range(l){
    var result = [];
    function putIn(number){
        result.push(number);
    }
    for(var i=0; i<=l; i++){
       putIn(i);
    }
    return result;
}

function fixDivID(divID){
    if(divID.indexOf('#') != 0){
        divID = '#' + divID;  //id and #id are both acceptable
    }
    return divID;
}