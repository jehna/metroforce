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