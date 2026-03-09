function AI(ms) {
	this.MAX_SEARCH_DEPTH_LIMIT = ms || 3
	this.MAX_SEARCH_TIME_LIMIT = 500; // ms

	// var values = {}
	this.pieces = {'p': 33, 'r': 41, 'n': 37, 'b': 37, 'q': 45, 'k': 49}
	this.ranks = [undefined, 1, 2, 4, 4, 4, 4, 2, 1]
	this.files =  {'a': 1, 'b': 1, 'c': 1, 'd': 2, 'e': 2, 'f': 1, 'g': 1, 'h': 1}

	this.searchStartTS
}
AI.prototype.opponent = function(color) {
	return color == 'w' && 'b' || 'w'
}
AI.prototype.evalPiece = function (piece) {
	return this.pieces[piece.toLowerCase()]
}
AI.prototype.evalBoard = function(ctx, color) {
	return this.score(ctx, color) - this.score(ctx, this.opponent(color))
}
AI.prototype.evalMove = function(ctx, move, depth, color) {
	!depth && (depth = 0)

	var max, min, value, moves, capture, captureVal

	value = this.evalPiece(move.piece)

	if (move.color == color && ctx.attacked(opponent(color), ctx.SQUARES[move.to])) {
		capture = ctx.get(move.to)
		captureVal = capture && this.evalPiece(capture)
		if(!capture || captureVal < value) {
			return (capture ? captureVal : 0) - value
		}
	}

	ctx.move(move.san)

	moves = ctx.moves({'verbose': true})

	var i, len, el
	for (i = -1, len = moves.length; ++i < len;) {
		if (depth + 1 < this.MAX_SEARCH_DEPTH_LIMIT && (new Date).getTime() - this.searchStartTS < this.MAX_SEARCH_TIME_LIMIT) {
			el = this.evalMove(ctx, moves[i], depth + 1, color)
		}
		else {
			ctx.move(moves[i].san)
			el = this.evalBoard(ctx, color)
			ctx.undo()
		}

		(!max || el > max) && (max = el)
		(!min || el < min) && (min = el)
	}

	ctx.undo()

	return ctx.turn() != color ? max : min
}

AI.prototype.evalSquare = function(ctx, square, color) {
	var value = 0,
	file = square.charAt(0),
	rank = square.charAt(1),

	locValue = this.ranks[rank] + this.files[file],

	piece = ctx.get(square),
	pieceVal = piece && this.evalPiece(piece),
	ownPiece = piece && (color == piece.toUpperCase() == piece && 'w' || 'b'),
	oppPiece = piece && !ownPiece,

	oppAttack = ctx.attacked(this.opponent(color), ctx.SQUARES[square]),
	ownAttack = ctx.attacked(color, ctx.SQUARES[square])

	value += (ownPiece && (!oppAttack || ownAttack)) && (pieceVal) || 0

	value += (!piece && ownAttack && !oppAttack) && locValue || 0
	value -= (!piece && oppAttack && !ownAttack) && locValue || 0

	value += (oppPiece && !oppAttack && ownAttack) && pieceVal || 0
	value -= (ownPiece && oppAttack) && pieceVal || 0

	return value
}

AI.prototype.search = function search(ctx) {
	var moves = ctx.moves({'verbose': true})

	this.searchStartTS = (new Date).getTime()

	var i, len, el, min, max, best
	for(i = -1, len = moves.length; ++i < len;) {
		el = this.evalMove(ctx, moves[i], 1, ctx.turn())
		(!max || el > max[0]) && (max = [el, moves[i]])
	}
	return max[1].san
}

AI.prototype.score = function(ctx, color) {
	var ret = 0,
	pieces = ctx.fen().replace(/\s.*/,'').match(color == 'b' && /[prnbqk]/g || /[PRNBGQK]/g)

	var i, len
	for(i = -1, len = pieces.length; ++i < len;) {
		ret += this.pieces[pieces[i].toLowerCase()]
		ret += this.pieces[pieces[i].toLowerCase()]
	}

	for(square in ctx.SQUARES) {
		ret += this.evalSquare(ctx, square, color)
	}

	return ret
}









