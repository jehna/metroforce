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
