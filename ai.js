var MAX_SEARCH_DEPTH_LIMIT = 3;
var MAX_SEARCH_TIME_LIMIT = 500; // ms

var PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

var searchStartTS;
var searchTimedOut;

function pieceValue(type) {
	return PIECE_VALUES[type];
}

// Small centralization bonus so the AI doesn't sit passively on the back rank.
function centerBonus(square) {
	var file = square.charCodeAt(0) - 97;
	var rank = parseInt(square.charAt(1), 10) - 1;
	var df = Math.min(file, 7 - file);
	var dr = Math.min(rank, 7 - rank);
	return (df + dr) * 2;
}

// Material + light positional score of the whole board, from White's point of view.
function evalBoard(chess) {
	var rows = chess.board();
	var total = 0;

	for (var r = 0; r < 8; r++) {
		for (var f = 0; f < 8; f++) {
			var cell = rows[r][f];
			if (!cell) continue;

			var square = String.fromCharCode(97 + f) + (8 - r);
			var value = pieceValue(cell.type) + centerBonus(square);

			total += cell.color === 'w' ? value : -value;
		}
	}

	return total;
}

// Score for a single side; used by the UI's live eval readout.
function score(chess, color) {
	var value = evalBoard(chess);
	return color === 'w' ? value : -value;
}

function timeIsUp() {
	if (!searchTimedOut) {
		searchTimedOut = (new Date()).getTime() - searchStartTS >= MAX_SEARCH_TIME_LIMIT;
	}
	return searchTimedOut;
}

// Negamax with alpha-beta pruning. Always draws candidate moves from
// chess.moves(), which chess.js already restricts to legal moves - so
// there is no way for this to hand back a castle that's illegal because
// the king is in, through, or ends up in check.
function negamax(chess, depth, alpha, beta) {
	if (depth === 0 || timeIsUp()) {
		var perspective = chess.turn() === 'w' ? 1 : -1;
		return perspective * evalBoard(chess);
	}

	var moves = chess.moves();
	if (moves.length === 0) {
		return chess.in_checkmate() ? -100000 - depth : 0;
	}

	var best = -Infinity;
	for (var i = 0; i < moves.length; i++) {
		chess.move(moves[i]);
		var value = -negamax(chess, depth - 1, -beta, -alpha);
		chess.undo();

		if (value > best) {
			best = value;
		}
		if (best > alpha) {
			alpha = best;
		}
		if (alpha >= beta || timeIsUp()) {
			break;
		}
	}

	return best;
}

// Iterative deepening: search depth 1, then 2, then 3 (or until the time
// budget runs out), keeping the best move found by the deepest completed
// pass. This is what actually fixes "the depth search sucks so bad" -
// the old eval scanned all 64 squares with attacked() checks per node,
// which made anything past depth 1 unusably slow.
function search(chess, verbose) {
	var moves = chess.moves({ verbose: true });
	if (moves.length === 0) {
		return null;
	}

	searchStartTS = (new Date()).getTime();
	searchTimedOut = false;

	var best = moves[0];

	for (var depth = 1; depth <= MAX_SEARCH_DEPTH_LIMIT; depth++) {
		var depthBest = null;
		var depthBestValue = -Infinity;
		var alpha = -Infinity, beta = Infinity;

		for (var i = 0; i < moves.length; i++) {
			chess.move(moves[i]);
			var value = -negamax(chess, depth - 1, -beta, -alpha);
			chess.undo();

			if (value > depthBestValue) {
				depthBestValue = value;
				depthBest = moves[i];
			}
			if (depthBestValue > alpha) {
				alpha = depthBestValue;
			}
			if (timeIsUp()) {
				break;
			}
		}

		if (depthBest) {
			best = depthBest;
		}
		if (timeIsUp()) {
			break;
		}
	}

	return verbose ? best : best.san;
}

function setSearchTimeLimit(ms) {
	MAX_SEARCH_TIME_LIMIT = ms;
}

var AI = {
	'evalBoard': evalBoard,
	'score': score,
	'search': search,
	'setSearchTimeLimit': setSearchTimeLimit
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports = AI;
}
