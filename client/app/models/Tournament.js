class Tournament {
	constructor(id, teamsPerMatch, rounds, winnerId) {
		this.id = id;
		this.teamsPerMatch = teamsPerMatch;
		this.rounds = rounds;
		this.winnerId = winnerId;
	}
}


module.exports = { Tournament };
