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