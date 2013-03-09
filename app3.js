var settings = {
    gravity: Vector.create([0, 0.5]),
    elasticity: 0.8,
    rotation: Matrix.Rotation(0.01)
}

Circle.prototype.update = function(elements) {
    this.a = settings.gravity;
    this.v = this.v.add(this.a);
    this.x = this.handleCollisions(elements, this.x.add(this.v));

    this.draw();
};

Circle.prototype.handleCollisions = function(elements, nextPosition) {
    var motion = LineSegment.create(this.x, nextPosition);

    for (i = 0; i < elements.length; i++) {

        var collision = elements[i].line.intersectionWith(motion);
        if (collision) {

            var reflectionAxis = Line.create(Vector.create([0,0]), elements[i].line.direction);

            this.v = this.v.reflectionIn(reflectionAxis).to2D();
            this.v = this.v.multiply(settings.elasticity);

            var before = collision.to2D().subtract(this.x);
            var after = nextPosition.subtract(collision.to2D());
            after = after.reflectionIn(reflectionAxis).to2D();

            nextPosition = this.x.add(before).add(after);

            return this.handleCollisions(elements, nextPosition);
        }
    }

    return nextPosition;
};


Wall.prototype.update = function() {
    this.vector = this.rotation.multiply(this.vector);
    this.size(this.line.start.to2D(), this.vector.add(this.line.start.to2D()));
    this.draw();
};


var balls = [];
var walls = [];

onClick(function() {
    balls.push(new Circle(Math.random() * 10 + 10, mousePosition, [0, 0]));
});

gameLoop(function() {

    settings.gravity = settings.rotation.multiply(settings.gravity);

    for (var i = 0; i < balls.length; i++) balls[i].update(walls);
    for (var i = 0; i < walls.length; i++) walls[i].update();
});

resizeEvent(function(width, height) {
    for (i = 0; i < walls.length; i++) walls[i].remove();

    walls = [
        new Wall([width * 0.2, height * 0.5], [width * 0.35, height * 0.5], Matrix.Rotation(0.01)),
        new Wall([width * 0.65, height * 0.5], [width * 0.5, height * 0.5], Matrix.Rotation(-0.01)),
        new Wall([0, 0], [0, height]),
        new Wall([0, 0], [width, 0]),
        new Wall([0, height], [width, height]),
        new Wall([width, 0], [width, height]),
        new Wall([width * 0.5, 0], [width, height * 0.5]),
        new Wall([width * 0.4, height], [width * 0.5, height * 0.8]),
        new Wall([width * 0.5, height * 0.8], [width * 0.6, height])
    ];
});
