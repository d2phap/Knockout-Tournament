class MatchUp {
	constructor(id, roundId, tournamentId, score, teams, winnerId) {
		this.id = id;
		this.roundId = roundId;
		this.tournamentId = tournamentId;
		this.score = score;
		this.teams = teams;
		this.winnerId = winnerId;
	}
}

module.exports = { MatchUp };
