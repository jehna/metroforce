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