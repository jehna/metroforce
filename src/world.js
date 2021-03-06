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
