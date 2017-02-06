class Team {
	constructor(id, name, score) {
		this.id = id
		this.name = name
		this.score = score
	}

}


class Match {
	constructor(id, round, teams, score) {
		this.id = id
		this.round = round
		this.teams = teams
		this.score = score
	}

}


class Tournament {
	constructor(id, matchups, teamsPerMatch) {
		this.id = id
		this.matchups = matchups
		this.teamsPerMatch = teamsPerMatch
	}

}


module.exports = {Tournament, Match, Team};
