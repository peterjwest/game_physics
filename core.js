var arena = $('.arena');
var paper = Raphael(0, 0, 100, 100);

/* Circle constructor */

var Circle = function(radius, x, v) {
    this.x = Vector.create(x);
    this.v = Vector.create(v);
    this.a  = Vector.Zero(2);
    this.radius = radius;

    this.circle = paper.circle(this.x.elements[0], this.x.elements[1], radius);
    this.circle.attr("fill", "#59F");
    this.circle.attr("stroke", "#26c");
    this.circle.attr("stroke-width", 2);
}

Circle.prototype.update = function() {
    this.draw();
};

Circle.prototype.draw = function() {
    this.circle.attr("cx", this.x.elements[0]);
    this.circle.attr("cy", this.x.elements[1]);
}

/* Wall constructor */

var Wall = function(start, end, rotation, color) {
    this.line = LineSegment.create(start, end);
    this.vector = this.line.end.subtract(this.line.start).to2D();
    this.path = paper.path();
    this.path.attr("stroke-width", 2);
    this.rotation = rotation ||  Matrix.Rotation(0);
    this.color = color;
};

Wall.prototype.size = function(start, end) {
    this.line = LineSegment.create(start, end);
}

Wall.prototype.update = function() {
    this.draw();
};

Wall.prototype.remove = function() {
    this.path.remove();
}

Wall.prototype.draw = function() {
    this.path.attr("path",
        'M'+this.line.start.elements.join(',')+
        'L'+this.line.end.elements.join(',')
    );
    this.path.attr("stroke", this.color);
};


/* Click events to add balls */

var interval, mousePosition, clickEvent;
var onClick = function(fn) {
    clickEvent = fn;
};

$('body').mousedown(function(e) {
    mousePosition = [e.pageX, e.pageY];
    interval = setInterval(clickEvent, 100);
    if (clickEvent) clickEvent();
});

$('body').mousemove(function(e) {
    mousePosition = [e.pageX, e.pageY];
});

$('body').mouseup(function(e) {
    clearInterval(interval);
});


/* Resize events */

var resizeEvents = [];
var resizeEvent = function(fn) {
    resizeEvents.push(fn);
    $(window).resize();
};

$(window).resize(function() {
    width = arena.width();
    height = arena.height();

    paper.setSize(width, height);

    for (var i = 0; i < resizeEvents.length; i++) {
        resizeEvents[i](width, height);
    }
});
$(window).resize();


/* Game loop hook */

var gameLoop = function(fn) {
    setInterval(fn, 1000/60);
};
