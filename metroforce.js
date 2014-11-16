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
    
    this.element = Utils.createSVGElem("line", edgesGroup, {
        class: this.label ? this.label.className : "unlabeled"
    });
}

Edge.prototype.render = function() {
    
    this.element.setAttribute("x1", this.from.x);
    this.element.setAttribute("y1", this.from.y);
    this.element.setAttribute("x2", this.to.x);
    this.element.setAttribute("y2", this.to.y);
    
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
    
    this.element = Utils.createSVGElem("text", labelsGroup);
    this.lineElement = Utils.createSVGElem("line", labelsGroup, {
        class: this.className
    });
}
Label.index = 0;

Label.prototype.render = function() {
    
    var y = this.index * 20 + 30;
    
    this.element.setAttribute("y", y);
    this.element.setAttribute("x", 30);
    this.element.innerHTML = this.name;
    
    this.lineElement.setAttribute("x1", 0);
    this.lineElement.setAttribute("y1", y);
    this.lineElement.setAttribute("x2", 20);
    this.lineElement.setAttribute("y2", y);
}
function metroforce(stationNames, roads) {
    // constructor

    
    this.svg = Utils.createSVGElem("svg", document.body, {
        width: 1500,
        height: 1500
    });
    
    edgesGroup = Utils.createSVGElem("g",this.svg);
    stationsGroup = Utils.createSVGElem("g",this.svg);
    labelsGroup = Utils.createSVGElem("g",this.svg, {
        transform: "translate("+(this.svg.width.baseVal.value - 800)+",0)"
    });
    
    
    
        
    this.world = new World();
    this.stations = [];
    this.labels = [];
    var edges = [];
    
    for(var i = 0; i < stationNames.length; i++) {
        // Draw some stations
        var station = new Vector2(stationNames[i], Utils.randomRange(-100,100),Utils.randomRange(-100,100));
        this.stations.push(station);
        this.world.addChild(station);
    }
    
    for(var road in roads) {
        var label = new Label(road);
        this.labels.push(label);
        this.world.addChild(label);
        
        var self = this;
        if(roads[road].length) roads[road].forEach(function(road) {
            road.reduce(function(a,b) {
                var edge = new Edge(self.stations[a], self.stations[b], label);
                console.log(edge);
                self.world.addChild(edge);
                edges.push(edge);
                return b;
            });
        });
    }

    Solver.solve(this);   
    
    this.render();
    
    //this.world.play();
}

metroforce.prototype.render = function() {
    this.world.render();
}
var Solver = {
    solve: function(mf) {
            
        // Add solver
        var times = 0;
        var currState = 0;
        var states = [
            new SolverState(2.6,0,0.2,0.4),
            new SolverState(0.45,0.45,0.03,0.01)
        ];
        
        //mf.world.addChild({render: function() {
        function goforit() {
            for(var i = 0; i < mf.stations.length; i++) {  // loop through vertices
                var v = mf.stations[i];
                var u;
                
                v.net_force = {x:0,y:0};
                for( var j = 0; j < mf.stations.length; j++) { // loop through other vertices
                    if(i==j)continue;
                    u = mf.stations[j]; 
                    // squared distance between "u" and "v" in 2D space
                    var rsq = ((v._x-u._x)*(v._x-u._x)+(v._y-u._y)*(v._y-u._y)) || 0.001;
                    // counting the repulsion between two vertices 
                    v.net_force.x += states[currState].REPULSION * (v._x-u._x) /rsq;
                    v.net_force.y += states[currState].REPULSION * (v._y-u._y) /rsq;
                }
                
                // Add the attration to nearest whole number
                v.net_force.x += (Utils.roundToNearest(v._x,5) - v._x) * states[currState].WHOLENUMBER;
                v.net_force.y += (Utils.roundToNearest(v._y,5) - v._y) * states[currState].WHOLENUMBER;
                
                for( var j = 0; j < mf.stations[i].edges.length; j++) { // loop through edges
                    u = mf.stations[i].edges[j].to == mf.stations[i] ? mf.stations[i].edges[j].from : mf.stations[i].edges[j].to;
                    // countin the attraction
                    v.net_force.x += states[currState].ATTRACTION*(u._x - v._x);
                    v.net_force.y += states[currState].ATTRACTION*(u._y - v._y);
                }
                // counting the velocity (with damping 0.85)
                v.velocity.x = (v.velocity.x + v.net_force.x)*0.95; 
                v.velocity.y = (v.velocity.y + v.net_force.y)*0.95;
            }
            
            var total_net_force = 0;
            
            for(var i = 0; i < mf.stations.length; i++) { // set new positions
                var v = mf.stations[i];
                //if(v.isDragged){ v._x = mouseX; v._y = mouseY; }
                //else {
                v._x += v.velocity.x;
                v._y += v.velocity.y;
                total_net_force += (v.velocity.x*v.velocity.x)+(v.velocity.y*v.velocity.y);
            }
            
            if (total_net_force < states[currState].LIMIT && currState < states.length-1) {
                currState++;
            } else if (total_net_force < states[currState].LIMIT) {
                //mf.world.stop();
                //mf.world.render();
                return false;
            }
            times++;
            return true;
        };
        
        while (times < 1000 && goforit()) {};
        
        for(var i = 0; i < mf.stations.length; i++) {
            mf.stations[i]._x = Utils.roundToNearest(mf.stations[i]._x, 5);
            mf.stations[i]._y = Utils.roundToNearest(mf.stations[i]._y, 5);
        }
        
        // Find minimum x & y
        var minimums = {x:Infinity,y:Infinity};
        for(var i = 0; i < mf.stations.length; i++) {
            minimums.x = Math.min(minimums.x, mf.stations[i]._x);
            minimums.y = Math.min(minimums.y, mf.stations[i]._y);
        }
        // Notmalize
        for(var i = 0; i < mf.stations.length; i++) {
            mf.stations[i]._x -= minimums.x;
            mf.stations[i]._y -= minimums.y;
            mf.stations[i]._x /= 5;
            mf.stations[i]._y /= 5;
        }
    }
}
function SolverState(repulsion, wholeNumber, attraction, limit) {
    this.REPULSION = repulsion;
    this.WHOLENUMBER = wholeNumber;
    this.ATTRACTION = attraction;
    this.LIMIT = limit;
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
function Vector2(name, x, y) {
    this._x = x || Math.randomRange(-100,100);
    this._y = y || Math.randomRange(-100,100);
    this.velocity = {x:0,y:0};
    this.edges = [];
    this.name = name;
    
    // Generate output nodes
    this.element = Utils.createSVGElem("circle", stationsGroup, {
        r: 8
    });
    
    this.nameElement = Utils.createSVGElem("text", stationsGroup);
    this.nameElement.innerHTML = this.name;
}

Vector2.RENDER_MULTIPLIER = 30;
Vector2.RENDER_MARGIN = 50;

Vector2.prototype.render = function() {
    
    this.element.setAttribute("cx", this.x);
    this.element.setAttribute("cy", this.y);
    
    this.nameElement.setAttribute("x", this.x + 10);
    this.nameElement.setAttribute("y", this.y - 10);
    
    return this;
}

Vector2.prototype.__defineGetter__("x", function() {
    return (this._x * Vector2.RENDER_MULTIPLIER) + Vector2.RENDER_MARGIN;
});

Vector2.prototype.__defineGetter__("y", function() {
    return (this._y * Vector2.RENDER_MULTIPLIER) + Vector2.RENDER_MARGIN;
});

function World() {
    this.nodes = [];
}

World.prototype.addChild = function(node) {
    this.nodes.push(node);
}
World.prototype.removeChild = function(node) {
    this.nodes.splice(this.nodes.indexOf(node), 1);
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