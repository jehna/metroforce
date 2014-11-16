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