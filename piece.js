function Piece(x, y, team, type) {
	this.x = x;
	this.y = y;
	this.team = team;
	this.type = type;
}
Piece.prototype.enemy = function() {
	if (this.team === "w") {
		return "b";
	}
	if (this.team === "b") {
		return "w";
	}
}
Piece.prototype.color = function() {
	if (this.team === "w") {
		return "white";
	}
	if (this.team === "b") {
		return "black";
	}
}
Piece.prototype.glyph = function() {
	var glyphs = {
		"p": "♟",
		"n": "♞",
		"b": "♝",
		"r": "♜",
		"q": "♛",
		"k": "♚"
	};
	return glyphs[this.type];
}
Piece.prototype.worth = function() {
	var worths = {
		"p": 1,
		"n": 3,
		"b": 3,
		"r": 5,
		"q": 9,
		"k": 0
	};
	return worths[this.type];
}
Piece.prototype.index = function(i) {
	if (i === false) {
		var indexes = {
			"p": 0,
			"n": 1,
			"b": 2,
			"r": 3,
			"q": 4,
			"k": 5
		};
		return indexes[this.type];
	}
	else {
		var indexes = {
			0: "p",
			1: "n",
			2: "b",
			3: "r",
			4: "q",
			5: "k"
		};
		return indexes[i];
	}
}