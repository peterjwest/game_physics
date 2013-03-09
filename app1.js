var settings = {
    gravity: Vector.create([0, 0.5]),
}

Circle.prototype.update = function() {
    this.a = settings.gravity;
    this.v = this.v.add(this.a);
    this.x = this.x.add(this.v);

    this.draw();
};


var balls = [];

onClick(function() {
    balls.push(new Circle(Math.random() * 10 + 10, mousePosition, [Math.random() * 10 - 5, Math.random() * 10 - 5]));
});

gameLoop(function() {
    for (var i = 0; i < balls.length; i++) balls[i].update();
});
