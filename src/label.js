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