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