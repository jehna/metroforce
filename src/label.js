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