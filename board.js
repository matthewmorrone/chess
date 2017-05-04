
// returns possible moves for whole board, one team, or one piece
function Board(pieces) {
	this.chess = new Chess()
	this.pieces = pieces || [];
	this.whiteScore = 0;
	this.blackScore = 0;
}
Board.prototype.initialize = function(pieces) {
	for (var p in pieces) {
		piece = new Piece(pieces[p][0], pieces[p][1], (pieces[p][2] === 1 ? "w" : "b"));
		piece.type = piece.index(pieces[p][3]);
		this.pieces.push(piece);
	}
}
Board.prototype.copy = function() {
	return $.extend(true, {}, this);
}
Board.prototype.hasPiece = function(i, j) {
	for (var p in this.pieces) {
		if (this.pieces[p].x === i && this.pieces[p].y === j) {
			return true;
		}
	}
	return false;
}
Board.prototype.getPiece = function(i, j) {
	for (var p in this.pieces) {
		if (this.pieces[p].x === i && this.pieces[p].y === j) {
			return this.pieces[p];
		}
	}
	return new Piece(i, j, "", "");
}
Board.prototype.getPieces = function(team) {
	var pieces = [];
	for (var p in this.pieces) {
		if (this.pieces[p].team === team) {
			pieces.push(this.pieces[p]);
		}
	}
	return pieces;
}
Board.prototype.setPiece = function(i, j, team, type) {
	for (var p in this.pieces) {
		if (this.pieces[p].x === i && this.pieces[p].y === j) {
			this.pieces[p].team = team;
			this.pieces[p].type = type;
			return this.pieces[p];
		}
	}
	return false;
}
Board.prototype.addPiece = function(i, j, team, type) {
	if (this.hasPiece(i, j) === true) {
		return;
	}
	team = team || "";
	type = type || "";
	this.pieces.push(new Piece(i, j, team, type));
	return this.pieces[this.pieces.length];
}
Board.prototype.delPiece = function(i, j) {
	for (var p in this.pieces) {
		if (this.pieces[p].x === i && this.pieces[p].y === j) {
			this.pieces.splice(this.pieces.indexOf(this.pieces[p]), 1);
			return true;
		}
	}
	return false;
}
Board.prototype.isBlocked = function(tile1, tile2) {}
Board.prototype.score = function() {
	this.whiteScore = 0;
	this.blackScore = 0;
	for (var p in this.pieces) {
		if (this.pieces[p].team === "w") {
			this.whiteScore += this.pieces[p].worth()// + Math.floor(Math.random() * 10) + 1;
		}
		if (this.pieces[p].team === "b") {
			this.blackScore += this.pieces[p].worth()// + Math.floor(Math.random() * 10) + 1;
		}
	}

}
// if passed a specific piece, determines for that piece. else finds for all
Board.prototype.moves = function(piece) {
	var board = this;
	var d = d || 8;
	var results = [];
	var finalists = [];
	var r
	switch (piece.type) {
		case "p":
			if (piece.team === "b") {
				if (!board.hasPiece(piece.x, piece.y + 1)) {
					results.push([piece.x, piece.y + 1]);
				}
				if (piece.y === 1 && !board.hasPiece(piece.x, piece.y + 2)) {
					results.push([piece.x, piece.y + 2]);
				}
				if (board.getPiece(piece.x - 1, piece.y + 1).team === "w") {
					results.push([piece.x - 1, piece.y + 1]);
				}
				if (board.getPiece(piece.x + 1, piece.y + 1).team === "w") {
					results.push([piece.x + 1, piece.y + 1]);
				}
			}
			if (piece.team === "w") {
				if (!board.hasPiece(piece.x, piece.y - 1)) {
					results.push([piece.x, piece.y - 1]);
				}
				if (piece.y === 6 && !board.hasPiece(piece.x, piece.y - 2)) {
					results.push([piece.x, piece.y - 2]);
				}
				if (board.getPiece(piece.x - 1, piece.y - 1).team === "b") {
					results.push([piece.x - 1, piece.y - 1]);
				}
				if (board.getPiece(piece.x + 1, piece.y - 1).team === "b") {
					results.push([piece.x + 1, piece.y - 1]);
				}
			}
			// console.log(results);
			break;
		case "n":
			results.push([piece.x - 2, piece.y - 1])
			results.push([piece.x - 2, piece.y + 1])
			results.push([piece.x + 2, piece.y - 1])
			results.push([piece.x + 2, piece.y + 1])
			results.push([piece.x - 1, piece.y - 2])
			results.push([piece.x - 1, piece.y + 2])
			results.push([piece.x + 1, piece.y - 2])
			results.push([piece.x + 1, piece.y + 2])
			break;
		case "b":
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x - r, piece.y - r) === true) {
					if (board.getPiece(piece.x - r, piece.y - r).team === piece.enemy()) {
						results.push([piece.x - r, piece.y - r]);
					}
					break;
				}
				results.push([piece.x - r, piece.y - r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x + r, piece.y - r) === true) {
					if (board.getPiece(piece.x + r, piece.y - r).team === piece.enemy()) {
						results.push([piece.x + r, piece.y - r]);
					}
					break;
				}
				results.push([piece.x + r, piece.y - r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x - r, piece.y + r) === true) {
					if (board.getPiece(piece.x - r, piece.y + r).team === piece.enemy()) {
						results.push([piece.x - r, piece.y + r]);
					}
					break;
				}
				results.push([piece.x - r, piece.y + r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x + r, piece.y + r) === true) {
					if (board.getPiece(piece.x + r, piece.y + r).team === piece.enemy()) {
						results.push([piece.x + r, piece.y + r]);
					}
					break;
				}
				results.push([piece.x + r, piece.y + r])
			}
			break;
		case "r":
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x, piece.y - r) === true) {
					if (board.getPiece(piece.x, piece.y - r).team === piece.enemy()) {
						results.push([piece.x, piece.y - r]);
					}
					break;
				}
				results.push([piece.x, piece.y - r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x, piece.y + r) === true) {
					if (board.getPiece(piece.x, piece.y + r).team === piece.enemy()) {
						results.push([piece.x, piece.y + r]);
					}
					break;
				}
				results.push([piece.x, piece.y + r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x - r, piece.y) === true) {
					if (board.getPiece(piece.x - r, piece.y).team === piece.enemy()) {
						results.push([piece.x - r, piece.y]);
					}
					break;
				}
				results.push([piece.x - r, piece.y])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x + r, piece.y) === true) {
					if (board.getPiece(piece.x + r, piece.y).team === piece.enemy()) {
						results.push([piece.x + r, piece.y]);
					}
					break;
				}
				results.push([piece.x + r, piece.y])
			}
			break;
		case "q":
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x - r, piece.y - r) === true) {
					if (board.getPiece(piece.x - r, piece.y - r).team === piece.enemy()) {
						results.push([piece.x - r, piece.y - r]);
					}
					break;
				}
				results.push([piece.x - r, piece.y - r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x + r, piece.y - r) === true) {
					if (board.getPiece(piece.x + r, piece.y - r).team === piece.enemy()) {
						results.push([piece.x + r, piece.y - r]);
					}
					break;
				}
				results.push([piece.x + r, piece.y - r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x - r, piece.y + r) === true) {
					if (board.getPiece(piece.x - r, piece.y + r).team === piece.enemy()) {
						results.push([piece.x - r, piece.y + r]);
					}
					break;
				}
				results.push([piece.x - r, piece.y + r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x + r, piece.y + r) === true) {
					if (board.getPiece(piece.x + r, piece.y + r).team === piece.enemy()) {
						results.push([piece.x + r, piece.y + r]);
					}
					break;
				}
				results.push([piece.x + r, piece.y + r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x, piece.y - r) === true) {
					if (board.getPiece(piece.x, piece.y - r).team === piece.enemy()) {
						results.push([piece.x, piece.y - r]);
					}
					break;
				}
				results.push([piece.x, piece.y - r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x, piece.y + r) === true) {
					if (board.getPiece(piece.x, piece.y + r).team === piece.enemy()) {
						results.push([piece.x, piece.y + r]);
					}
					break;
				}
				results.push([piece.x, piece.y + r])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x - r, piece.y) === true) {
					if (board.getPiece(piece.x - r, piece.y).team === piece.enemy()) {
						results.push([piece.x - r, piece.y]);
					}
					break;
				}
				results.push([piece.x - r, piece.y])
			}
			for (r = 1; r < d; r++) {
				if (board.hasPiece(piece.x + r, piece.y) === true) {
					if (board.getPiece(piece.x + r, piece.y).team === piece.enemy()) {
						results.push([piece.x + r, piece.y]);
					}
					break;
				}
				results.push([piece.x + r, piece.y])
			}
			break;
		case "k":
			results.push([piece.x - 1, piece.y - 1]);
			results.push([piece.x, piece.y - 1]);
			results.push([piece.x + 1, piece.y - 1]);
			results.push([piece.x + 1, piece.y]);
			results.push([piece.x + 1, piece.y + 1]);
			results.push([piece.x, piece.y + 1]);
			results.push([piece.x - 1, piece.y + 1]);
			results.push([piece.x - 1, piece.y]);
			if (piece.y === 0 && piece.team === "b" && board.getPiece(7, piece.y).type === "r" && !board.hasPiece(6, piece.y) && !board.hasPiece(5, piece.y)) {
				results.push([piece.x + 2, piece.y]);
			}
			if (piece.y === 0 && piece.team === "b" && board.getPiece(0, piece.y).type === "r" && !board.hasPiece(1, piece.y) && !board.hasPiece(2, piece.y) && !board.hasPiece(3, piece.y)) {
				results.push([piece.x - 3, piece.y]);
			}
			if (piece.y === 7 && piece.team === "w" && board.getPiece(7, piece.y).type === "r" && !board.hasPiece(6, piece.y) && !board.hasPiece(5, piece.y)) {
				results.push([piece.x + 2, piece.y]);
			}
			if (piece.y === 7 && piece.team === "w" && board.getPiece(0, piece.y).type === "r" && !board.hasPiece(1, piece.y) && !board.hasPiece(2, piece.y) && !board.hasPiece(3, piece.y)) {
				results.push([piece.x - 3, piece.y]);
			}
			break;
	}
	// console.log(results);
	for (r = 0; r < results.length; r++) {
		if (results[r][0] === piece.x && results[r][1] === piece.y) {
			continue;
		}
		if (results[r][0] < 0 || results[r][0] >= d) {
			continue;
		}
		if (results[r][1] < 0 || results[r][1] >= d) {
			continue;
		}
		if (board.getPiece(results[r][0], results[r][1]).team === piece.team) {
			continue;
		}
		finalists.push(results[r]);
	}
	// results = $.grep(results, function(a){return a !== "";})
	return finalists;
}

Board.prototype.move = function(tile1, tile2) {
	this.delPiece(tile1.x, tile1.y);
	this.delPiece(tile2.x, tile2.y);
	this.addPiece(tile2.x, tile2.y, tile1.team, tile1.type);



	if (tile1.type === "p") {
		if (tile1.team === "w" && tile2.y === 0) {
			this.delPiece(tile2.x, tile2.y);
			this.addPiece(tile2.x, tile2.y, tile1.team, "q");
		}
		else if (tile1.team === "b" && tile2.y === 7) {
			this.delPiece(tile2.x, tile2.y);
			this.addPiece(tile2.x, tile2.y, tile1.team, "q");
		}
	}
	else if (tile1.type === "k") {
		if (tile2.x - tile1.x > 1 && tile1.team === "b") {
			this.delPiece(7, 0);
			this.addPiece(5, 0, tile1.team, "r");
		}
		if (tile2.x - tile1.x < -1 && tile1.team === "b") {
			this.delPiece(0, 0);
			this.addPiece(2, 0, tile1.team, "r");
		}
		if (tile2.x - tile1.x > 1 && tile1.team === "w") {
			this.delPiece(7, 7);
			this.addPiece(5, 7, tile1.team, "r");
		}
		if (tile2.x - tile1.x < -1 && tile1.team === "w") {
			this.delPiece(0, 7);
			this.addPiece(2, 7, tile1.team, "r");
		}
	}
}


function fresh() {
	var pieces = [];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (j === 0) {
				if (i === 0 || i === 7) {
					pieces.push(new Piece(i, j, "b", "r"));
				}
				else if (i === 1 || i === 6) {
					pieces.push(new Piece(i, j, "b", "n"));
				}
				else if (i === 2 || i === 5) {
					pieces.push(new Piece(i, j, "b", "b"));
				}
				else if (i === 3) {
					pieces.push(new Piece(i, j, "b", "q"));
				}
				else if (i === 4) {
					pieces.push(new Piece(i, j, "b", "k"));
				}
			}
			else if (j === 1) {
				pieces.push(new Piece(i, j, "b", "p"));
			}
			else if (j === 6) {
				pieces.push(new Piece(i, j, "w", "p"));
			}
			else if (j === 7) {
				if (i === 0 || i === 7) {
					pieces.push(new Piece(i, j, "w", "r"));
				}
				else if (i === 1 || i === 6) {
					pieces.push(new Piece(i, j, "w", "n"));
				}
				else if (i === 2 || i === 5) {
					pieces.push(new Piece(i, j, "w", "b"));
				}
				else if (i === 3) {
					pieces.push(new Piece(i, j, "w", "q"));
				}
				else if (i === 4) {
					pieces.push(new Piece(i, j, "w", "k"));
				}
			}
		}
	}
	return pieces;
}
