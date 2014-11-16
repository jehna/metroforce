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
