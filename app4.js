var random = function(low, high) {
    return Math.floor(Math.random() * (1 + high - low)) + low;
};

var minkowskiDiff = function(a, b) {
    var i, j;
    var diff = {points: []};
    for (i = 0; i < a.points.length; i++) {
        for (j = 0; j < b.points.length; j++) {
            diff.points.push(a.points[i].subtract(b.points[j]));
        }
    }
    return diff;
};

var projectionExtent = function(direction, point) {
    return point.dot(direction) / direction.dot(direction);
}

var projection = function(direction, point) {
    return direction.multiply(projectionExtent(direction, point));
}

var support = function(direction, shape) {
    var i;
    var max = projectionExtent(direction, shape.points[0]);
    var point = 0;
    for (i = 1; i < shape.points.length; i++) {
        if (projectionExtent(direction, shape.points[i]) > max) {
            max = projectionExtent(direction, shape.points[i]);
            point = i;
        }
    }
    //return shape.points[point];
    return shape.points.splice(point, 1)[0];
};

var orthogonalDirection = function(a, b) {
    var line = b.subtract(a).to3D();
    return a.to3D().cross(line).cross(line).to2D();
}

var clockwiseOf = function(a, b) {
    return b.to3D().cross(a.to3D()).elements[2] > 0;
};

var simplex = [];
var count;

var GJK = function(a, b) {
    var diff, direction, point;

    diff = minkowskiDiff(a, b);
    simplex = {};
    simplex.points = [diff.points.splice(0, 1)[0]];
    //simplex.points = [diff.points[0]];
    simplex.direction = simplex.points[0].x(-1);

    while (simplex.points.length < 3) {
        count++;
        point = support(simplex.direction, diff);
        if (simplex.direction.dot(point) <= 0) return false;
        simplex.points.push(point);
        simplex = computeSimplex(simplex, diff);

        if (count > 50) return false;
    }

    return true;
};

var computeSimplex = function(simplex, diff) {
    if (simplex.points.length == 3) {
        var pointToOrigin = simplex.points[2].x(-1);
        if (clockwiseOf(pointToOrigin, simplex.points[0].subtract(simplex.points[2]))) {
            diff.points.push(simplex.points[1]);
            simplex.points = [simplex.points[0], simplex.points[2]];
        }
        else if (!clockwiseOf(pointToOrigin, simplex.points[1].subtract(simplex.points[2]))) {
            diff.points.push(simplex.points[0]);
            simplex.points = [simplex.points[1], simplex.points[2]];
        }
    }

    if (simplex.points.length == 2) {
        if (clockwiseOf(simplex.points[1], simplex.points[0])) {
            simplex.points = [simplex.points[1], simplex.points[0]];
        }
        simplex.direction = orthogonalDirection(simplex.points[0], simplex.points[1]);
    }

    if (simplex.points.length == 1) {
        simplex.direction = simplex.points[0].x(-1);
    }

    return simplex;
};

var createShape = function(sides) {
    var shape = {points:[]};
    var point =  Vector.create([random(25, 75), 0]);
    var position = Vector.create([random(100, 250), random(100, 250)]);
    var rotation = Matrix.Rotation(2 * Math.PI / sides);
    for (var i = 0; i < sides; i ++) {
        shape.points.push(point.add(position));
        point = rotation.multiply(point);
    }
    return shape;
};

for (var i = 0; i < 1; i++) {
    a = createShape(random(4, 9));
    b = createShape(random(4, 9));
    collided = GJK(a, b);
}

var diff = minkowskiDiff(a, b);
for (var i = 0; i < diff.points.length; i++) {
    for (var j = 0; j < diff.points.length; j++) {
        wall = new Wall([diff.points[i].elements[0] + 500, diff.points[i].elements[1] + 200], [diff.points[i].elements[0] + 500 + 2, diff.points[i].elements[1] + 200]);
        wall.draw();
    }
}

for (var i = 0; i < simplex.points.length; i++) {
    for (var j = 0; j < simplex.points.length; j++) {
        wall = new Wall([simplex.points[i].elements[0] + 500, simplex.points[i].elements[1] + 200], [simplex.points[j].elements[0] + 500, simplex.points[j].elements[1] + 200], null, 'green');
        wall.draw();
    }
}

for (var i = 0; i < a.points.length; i++) {
    color = collided ? 'red' : 'grey';
    wall = new Wall(a.points[i], a.points[(i + 1) % a.points.length], null, color);
    wall.draw();
}

for (var i = 0; i < b.points.length; i++) {
    color = collided ? 'red' : 'black';
    wall = new Wall(b.points[i], b.points[(i + 1) % b.points.length], null, color);
    wall.draw();
}

circle = new Circle(1, [500, 200], [0, 0]);
circle.draw();
