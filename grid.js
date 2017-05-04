
function Grid() {
	this.canvas = document.getElementById('pane')
	this.ctx = this.canvas.getContext('2d')
	this.ctx.font = '60pt Calibri sans-serif'
	this.ctx.textAlign = 'center'
	this.ctx.textBaseline = 'middle'
	this.canvasX = Math.round($("#pane").offset().left)
	this.canvasY = Math.round($("#pane").offset().top)
	this.offsetX = 512
	this.offsetY = 64
	this.dimension = 8
	this.tilesize = 128
	this.turn = "w"
	$("title").html(this.turn)
}

function resize(ctx) {
	var mousedowned = false
	$("canvas").mousedown(function(e) {
		mousedowned = true
		ox = e.pageX
		oy = e.pageY
	})
	$("canvas").mousemove(function(e) {
		if (mousedowned == true) {
			n = (e.pageX - ox) * (e.pageX - ox) + (e.pageY - oy) * (e.pageY - oy)
			n = Math.sqrt(n)
			clear(ctx)
			grid(ctx, x, y, m, n)
		}
		else {
			x = e.pageX
			y = e.pageY
			clear(ctx)
			grid(ctx, x, y, m, n)
		}
	})
	$("canvas").mouseup(function(e) {
		mousedowned = false
	})
}
Grid.prototype.clear = function() {
	var canvas = this.canvas
	var ctx = this.ctx
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath()
	ctx.moveTo(0, 0)
	ctx.lineTo(0, canvas.height)
	ctx.moveTo(0, 0)
	ctx.lineTo(canvas.width, 0)
	ctx.moveTo(0, canvas.height)
	ctx.lineTo(canvas.width, canvas.height)
	ctx.moveTo(canvas.width, 0)
	ctx.lineTo(canvas.width, canvas.height)
	ctx.lineWidth = 3
	ctx.strokeStyle = 'black'
	ctx.stroke()
	ctx.closePath()
	this.draw()
}
Grid.prototype.draw = function() {
	var ctx = this.ctx
	var offsetX = this.offsetX
	var offsetY = this.offsetY
	var dimension = this.dimension
	var tilesize = this.tilesize
	ctx.beginPath()
	// for(var i = 0; i <= dimension; i += 1) {ctx.moveTo(offsetX+i*tilesize, offsetY); ctx.lineTo(offsetX+i*tilesize, offsetY+dimension*tilesize);}
	// for(var j = 0; j <= dimension; j += 1) {ctx.moveTo(offsetX, offsetY+j*tilesize); ctx.lineTo(offsetX+dimension*tilesize, offsetY+j*tilesize);}
	for (var i = 0; i < dimension; i += 1) {
		for (var j = 0; j < dimension; j += 1) {
			if ((i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)) {
				ctx.fillStyle = "gray"
				ctx.fillRect(offsetX + i * tilesize, offsetY + j * tilesize, tilesize, tilesize)
			}
			else {
				ctx.fillStyle = "darkgray"
				ctx.fillRect(offsetX + i * tilesize, offsetY + j * tilesize, tilesize, tilesize)
			}
		}
	}
	ctx.lineWidth = 1
	ctx.stroke()
	ctx.closePath()
}
Grid.prototype.setup = function(board) {
	this.board = board
}
Grid.prototype.render = function() {
	var pieces = this.board.pieces
	var ctx = this.ctx
	var tilesize = this.tilesize
	for (var i = 0; i < pieces.length; i++) {
		ctx.fillStyle = pieces[i].color()
		ctx.fillText(pieces[i].glyph(), this.offsetX + pieces[i].x * tilesize + tilesize / 2, this.offsetY + pieces[i].y * tilesize + tilesize / 2)
	}
}
Grid.prototype.clean = function() {
	this.clear()
	this.render()
}
function fen(x, y) {
	var letters = {
		0: 'a',
		1: 'b',
		2: 'c',
		3: 'd',
		4: 'e',
		5: 'f',
		6: 'g',
		7: 'h'
	}
	return letters[x]+(8-y)
}
Grid.prototype.play = function() {
	var grid = this
	var board = grid.board
	var ctx = this.ctx
	var offsetX = this.offsetX
	var offsetY = this.offsetY
	var dimension = this.dimension
	var tilesize = this.tilesize
	var selected = []

	var pieces
	var moves
	var paths
	var boards
	var newboard, i, j, tile, s, m, found, p, max, path, tie = []

	// var ai = new AI();

	$(this.canvas).click(function(e) {
		if (grid.turn === "w") {
			grid.clean()
			if (selected.length >= 2) {
				selected = []
			}
			canvasX = Math.round($("#pane").offset().left)
			canvasY = Math.round($("#pane").offset().top)
			i = Math.floor((e.pageX - canvasX - (offsetX / 2)) / (tilesize / 2))
			j = Math.floor((e.pageY - canvasY - (offsetY / 2)) / (tilesize / 2))
			if (selected.length === 0 && !board.hasPiece(i, j)) {
				selected = []
				return
			}
			tile = board.getPiece(i, j)
			selected.push(tile)
			if (selected[0].team !== grid.turn) {
				selected = []
				return
			}
			moves = []
			if (selected.length === 1) {
				for (s in selected) {
					ctx.fillStyle = "rgba(255, 0, 0, .25)"
					ctx.fillRect(offsetX + selected[s].x * tilesize, offsetY + selected[s].y * tilesize, tilesize, tilesize)
				}
				moves = board.moves(selected[0])
				// console.log(moves[m], selected[0])
				for (m in moves) {
					ctx.fillStyle = "rgba(0, 0, 255, .25)"
					ctx.fillRect(offsetX + moves[m][0] * tilesize, offsetY + moves[m][1] * tilesize, tilesize, tilesize)
				}
			}
			if (selected.length === 2) {
				if (selected[0].x === selected[1].x && selected[0].y === selected[1].y) {
					selected = []
					return
				}
				found = false
				moves = board.moves(selected[0])
				for (m in moves) {
					// console.log(moves, selected[1])
					if (selected[1].x === moves[m][0] && selected[1].y === moves[m][1]) {
						found = true
					}
				}
				if (found === false) {
					return
				}
				board.move(selected[0], selected[1])
				board.chess.move({from: fen(selected[0].x, selected[0].y), to: fen(selected[1].x, selected[1].y)})
				log(board.chess.fen())

				grid.animate(selected[0], selected[1])
				if (grid.turn === "w") {
					grid.turn = "b"
				}
				else {
					grid.turn = "w"
				}
				$("title").html(grid.turn)
			}
		}
		else if (grid.turn === "b") {

			moves = board.chess.moves({verbose: true})

			var title = document.title
			document.title = 'thinking...'
			// var choice = AI.search(board.chess, true), max = 0
			var choice = _.sample(moves), max = 0
			document.title = title

			$.each(moves, function(m, move) {
				board.chess.move(move)
				board.whiteScore = AI.score(board.chess, 'w')
				board.blackScore = AI.score(board.chess, 'b')
				if ((board.blackScore - board.whiteScore) > max) {

					choice = move
					max = board.blackScore - board.whiteScore
				}

				board.chess.undo()
			})

			var tile1 = new Piece(choice.from.charCodeAt(0)-97, 8-parseInt(choice.from[1], 10), choice.color, choice.piece)
			var tile2 = new Piece(choice.to.charCodeAt(0)-97,	 8-parseInt(choice.to[1], 10),	 choice.color, choice.piece)


			log(tile1, tile2)
			board.move(tile1, tile2)
			board.chess.move(choice)

			grid.animate(tile1, tile2)

			if (grid.turn === "w") {
				grid.turn = "b"
			}
			else {
				grid.turn = "w"
			}
			// $("title").html(grid.turn)
		}
		// log(board.chess.fen())
		if (board.chess.game_over()) {
			// reset
		}
	})
}
Grid.prototype.animate = function(tile1, tile2, mode) {
	var grid = this
	var board = this.board
	var ctx = this.ctx
	var pieces = board.pieces
	var offsetX = this.offsetX
	var offsetY = this.offsetY
	var tilesize = this.tilesize
	if (mode === "queen") {
		tile1.type = "queen"
	}
	var glyph = tile1.glyph()
	var x1 = offsetX + tile1.x * tilesize + tilesize / 2
	var y1 = offsetY + tile1.y * tilesize + tilesize / 2
	var x2 = offsetX + tile2.x * tilesize + tilesize / 2
	var y2 = offsetY + tile2.y * tilesize + tilesize / 2
	// var d = Math.sqrt(Math.pow(x1 - y1, 2) + Math.pow(x2 - y2, 2))
	var framerate = 40
	var dx = (x2 - x1) / framerate
	var dy = (y2 - y1) / framerate
	var i = 0
	var x = x1
	var y = y1

	var animus = requestAnimationFrame(step)

	function step() {
		grid.clear()
		grid.draw()
		grid.render()
		if ((tile2.x % 2 == 0 && tile2.y % 2 == 1) || (tile2.x % 2 == 1 && tile2.y % 2 == 0)) {
			ctx.fillStyle = "gray"
			ctx.fillRect(offsetX + tile2.x * tilesize, offsetY + tile2.y * tilesize, tilesize, tilesize)
		}
		else {
			ctx.fillStyle = "darkgray"
			ctx.fillRect(offsetX + tile2.x * tilesize, offsetY + tile2.y * tilesize, tilesize, tilesize)
		}
		ctx.fillStyle = tile1.color()
		x += dx
		y += dy
		ctx.fillText(glyph, x, y)
		animus = requestAnimationFrame(step)
		i++
		if (i === framerate) {
			cancelAnimationFrame(animus)
			grid.clear()
			grid.draw()
			grid.render()
			$(grid.canvas).click()
		}
	}

	animus = requestAnimationFrame(step)

	cancelAnimationFrame(animus)
}