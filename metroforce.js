window.metroforce = (function() {

var xmlns = "http://www.w3.org/2000/svg";
var document = window.document;
var edgesGroup, labelsGroup, stationsGroup;
function Edge(from,to,label) {
    this.from = from;
    this.to = to;
    this.label = label;
    from.edges.push(this);
    to.edges.push(this);
}

Edge.prototype.render = function() {
    
    var line = document.createElementNS(xmlns, "line");
    line.setAttribute("x1", this.from.x);
    line.setAttribute("y1", this.from.y);
    line.setAttribute("x2", this.to.x);
    line.setAttribute("y2", this.to.y);
    
    if (this.label) {
        line.setAttribute("class", this.label.className);
    }
    
    edgesGroup.appendChild(line);
    return this;
}
function Label(name) {
    this.name = name;
    this.className = name.replace(/\W/g,function(a) {
        if (/[ _-]/.test(a)) {
            return "-";
        } else {
            return "";
        }
    }).toLowerCase();
    this.index = Label.index++;
}
Label.index = 0;

Label.prototype.render = function() {
    
    var y = this.index * 20 + 30;
    var text = document.createElementNS(xmlns, "text");
    text.setAttribute("y", y);
    text.setAttribute("x", 30);
    text.innerHTML = this.name;
    labelsGroup.appendChild(text);
    
    var line = document.createElementNS(xmlns, "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);
    line.setAttribute("x2", 20);
    line.setAttribute("y2", y);
    line.setAttribute("class", this.className);
    labelsGroup.appendChild(line);
}



function metroforce() {
    // constructor

    
    var svg = Utils.createSVGElem("svg", document.body, {
        width: 1500,
        height: 1500
    });
    
    edgesGroup = Utils.createSVGElem("g",svg);
    stationsGroup = Utils.createSVGElem("g",svg);
    labelsGroup = Utils.createSVGElem("g",svg, {
        transform: "translate("+(svg.width.baseVal.value - 800)+",0)"
    });
    
    
    
        
    var world = new World();
    var stations = [];
    
    var stationNames = [
        "Viisikulma",
        "R-kioski",
        "Len's keishoku",
        "Sis Deli",
        "Pursari-Albertinkatu kulma",
        "Suomi kahvila",
        "Hoku",
        "Kinki",
        "Puisto",
        "Wanha ct HQ",
        
        "Brooklyn cafe",
        "Vivo's",
        "We got beef",
        "Fafa's",
        "Beefy queen"
    ];
    
    for(var i = 0; i < stationNames.length; i++) {
        // Draw some stations
        var station = new Vector2(Utils.randomRange(-100,100),Utils.randomRange(-100,100));
        station.name = stationNames[i];
        stations.push(station);
        world.addChild(station);
    }
    
    var labelNames = [
        "Pursimiehenkatu",
        "Albertinkatu",
        "Frederikinkatu",
        "Iso-Roobertinkatu",
        "Other"
    ];
    
    var labels = [];
    for(var i in labelNames) {
        var label = new Label(labelNames[i]);
        labels.push(label);
        world.addChild(label);
    }
    
    
    var edges = [
        new Edge(stations[0], stations[1], labels[0]),
        new Edge(stations[1], stations[2], labels[0]),
        new Edge(stations[2], stations[3], labels[0]),
        new Edge(stations[3], stations[4], labels[0]),
        new Edge(stations[4], stations[5], labels[0]),
        new Edge(stations[4], stations[6], labels[1]),
        new Edge(stations[5], stations[7]),
        new Edge(stations[7], stations[8]),
        new Edge(stations[8], stations[9]),
        new Edge(stations[9], stations[0]),
        
        new Edge(stations[1], stations[10], labels[2]),
        new Edge(stations[10], stations[11], labels[2]),
        new Edge(stations[11], stations[12], labels[3]),
        new Edge(stations[12], stations[13], labels[3]),
        new Edge(stations[13], stations[14])
    ];
    for(var i = 0; i < edges.length; i++) {
        // Draw some edges
        var edge = edges[i];
        world.addChild(edge);
    }
    
    /*
    var edges = [];
    for(var i = 0; i < 40; i++) {
        // Draw some edges
        var edge = new Edge(
            stations[Utils.randomRange(0,stations.length)],
            stations[Utils.randomRange(0,stations.length)]
        );
        world.addChild(edge);
    }*/
    
    function State(repulsion, wholeNumber, attraction, limit) {
        this.REPULSION = repulsion;
        this.WHOLENUMBER = wholeNumber;
        this.ATTRACTION = attraction;
        this.LIMIT = limit;
    }
    
    // Add solver
    var times = 0;
    var currState = 0;
    var states = [
        new State(2.6,0,0.2,0.4),
        new State(0.45,0.45,0.03,0.01)
    ];
    //world.addChild({render: function() {
    function goforit() {
        for(var i = 0; i < stations.length; i++) {  // loop through vertices
            var v = stations[i];
            var u;
            
            v.net_force = {x:0,y:0};
            for( var j = 0; j < stations.length; j++) { // loop through other vertices
                if(i==j)continue;
                u = stations[j]; 
                // squared distance between "u" and "v" in 2D space
                var rsq = ((v._x-u._x)*(v._x-u._x)+(v._y-u._y)*(v._y-u._y)) || 0.001;
                // counting the repulsion between two vertices 
                v.net_force.x += states[currState].REPULSION * (v._x-u._x) /rsq;
                v.net_force.y += states[currState].REPULSION * (v._y-u._y) /rsq;
            }
            
            // Add the attration to nearest whole number
            v.net_force.x += (Utils.roundToNearest(v._x,5) - v._x) * states[currState].WHOLENUMBER;
            v.net_force.y += (Utils.roundToNearest(v._y,5) - v._y) * states[currState].WHOLENUMBER;
            
            for( var j = 0; j < stations[i].edges.length; j++) { // loop through edges
                u = stations[i].edges[j].to == stations[i] ? stations[i].edges[j].from : stations[i].edges[j].to;
                // countin the attraction
                v.net_force.x += states[currState].ATTRACTION*(u._x - v._x);
                v.net_force.y += states[currState].ATTRACTION*(u._y - v._y);
            }
            // counting the velocity (with damping 0.85)
            v.velocity.x = (v.velocity.x + v.net_force.x)*0.95; 
            v.velocity.y = (v.velocity.y + v.net_force.y)*0.95;
        }
        
        var total_net_force = 0;
        
        for(var i = 0; i < stations.length; i++) { // set new positions
            var v = stations[i];
            //if(v.isDragged){ v._x = mouseX; v._y = mouseY; }
            //else {
            v._x += v.velocity.x;
            v._y += v.velocity.y;
            total_net_force += (v.velocity.x*v.velocity.x)+(v.velocity.y*v.velocity.y);
        }
        
        if (total_net_force < states[currState].LIMIT && currState < states.length-1) {
            currState++;
        } else if (total_net_force < states[currState].LIMIT) {
            //world.stop();
            //world.render();
            return false;
        }
        times++;
        //console.log(total_net_force, ++times);
        return true;
    };
    
    while (times < 1000 && goforit()) {};
    
    for(var i = 0; i < stations.length; i++) {
        stations[i]._x = Utils.roundToNearest(stations[i]._x, 5);
        stations[i]._y = Utils.roundToNearest(stations[i]._y, 5);
    }
    
    // Find minimum x & y
    var minimums = {x:Infinity,y:Infinity};
    for(var i = 0; i < stations.length; i++) {
        minimums.x = Math.min(minimums.x, stations[i]._x);
        minimums.y = Math.min(minimums.y, stations[i]._y);
    }
    // Notmalize
    for(var i = 0; i < stations.length; i++) {
        stations[i]._x -= minimums.x;
        stations[i]._y -= minimums.y;
        stations[i]._x /= 5;
        stations[i]._y /= 5;
    }
    
    world.render();
    
    //world.play();
}
var Utils = {
    createSVGElem: function(name, parent, params) {
        params = params || {};
        var elem = document.createElementNS(xmlns, name);
        for(var param in params) {
            elem.setAttribute(param, params[param]);
        }
        parent.appendChild(elem);
        return elem;
    },
    randomRange: function(from, to) {
        return Math.floor(Math.random() * (to-from)) + from;
    },
    roundToNearest: function(number, nearest) {
        return Math.round(number/nearest)*nearest;
    }
}
function Vector2(x,y) {
    this._x = x || Math.randomRange(-100,100);
    this._y = y || Math.randomRange(-100,100);
    this.velocity = {x:0,y:0};
    this.edges = [];
}

Vector2.prototype.render = function() {
    
    var circle = document.createElementNS(xmlns, "circle");
    circle.setAttribute("cx", this.x);
    circle.setAttribute("cy", this.y);
    circle.setAttribute("r", 8);
    stationsGroup.appendChild(circle);
    
    if (this.name) {
        var text = document.createElementNS(xmlns, "text");
        text.setAttribute("x", this.x + 10);
        text.setAttribute("y", this.y - 10);
        text.innerHTML = this.name;
        stationsGroup.appendChild(text);
    }
    
    return this;
}

Vector2.prototype.__defineGetter__("x", function() {
    return /*(canvas.width/2) + */(this._x * 30) + 50;
});

Vector2.prototype.__defineGetter__("y", function() {
    return /*(canvas.height/2) + */(this._y * 30) + 50;
});

function World() {
    this.nodes = [];
}

World.prototype.addChild = function(node) {
    this.nodes.push(node);
}

World.prototype.render = function() {
    
    this.nodes.forEach(function(node){
        node.render();
    });
}

World.prototype.play = function() {
    var self = this;
    this.player = setInterval(function() {
        self.render();
    }, 1000 / 30);
}

World.prototype.stop = function() {
    clearInterval(this.player);
}


return metroforce;
})();