Vector.prototype.to2D = function() {
  var copy = this.dup();
  copy.elements.length = 2;
  return copy;
}

var LineSegment = function() {}
LineSegment.prototype = new Line;

// Returns the unique intersection point with the argument, if one exists
LineSegment.prototype.intersectionWith = function(obj) {
  var i = Line.prototype.intersectionWith.call(this, obj);
  if (!i) return null;

  var intersects = true;

  var length = this.start.subtract(this.end).modulus();
  if (length < this.start.subtract(i).modulus()) intersects = false;
  if (length < this.end.subtract(i).modulus()) intersects = false;

  var length = obj.start.subtract(obj.end).modulus();
  if (length < obj.start.subtract(i).modulus()) intersects = false;
  if (length < obj.end.subtract(i).modulus()) intersects = false;

  return intersects ? i : null;
};

// Set the line's anchor point and direction.
LineSegment.prototype.setVectors = function(start, end) {
  start = Vector.create(start);
  end = Vector.create(end);
  if (start.elements.length == 2) {start.elements.push(0); }
  if (end.elements.length == 2) { end.elements.push(0); }

  this.start = start;
  this.end = end;
  Line.prototype.setVectors.call(this, start, end.subtract(start));

  return this;
};

// Constructor function
LineSegment.create = function(start, end) {
  var L = new LineSegment();
  return L.setVectors(start, end);
};

// Axes
LineSegment.X = LineSegment.create(Vector.Zero(3), Vector.i);
LineSegment.Y = LineSegment.create(Vector.Zero(3), Vector.j);
LineSegment.Z = LineSegment.create(Vector.Zero(3), Vector.k);
