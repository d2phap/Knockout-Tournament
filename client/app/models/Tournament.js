class Tournament {
	constructor(id, teamsPerMatch, rounds, winner) {
		this.id = id;
		this.teamsPerMatch = teamsPerMatch;
		this.rounds = rounds;
		this.winner = winner;
	}
}


module.exports = { Tournament };
