class RoundController {
    constructor () {

    }
    
    // get number of rounds in a tournament
    static getNumberOfRounds (numberOfTeams, teamsPerMatch) {
        let numberOfRounds = Math.log(numberOfTeams) / Math.log(teamsPerMatch);
        return Math.floor(numberOfRounds);
    }

	// get match ups of a round
    static getMatchUpsOfRound (teamsOfCurrentRound, teamsPerMatch, initData = null) {
        
        if (initData != null) {
            return initData;
        }

		let matchUps = [];
        let teamsInMatchUp = [];

		for (let i = 0; i < teamsOfCurrentRound.length; i++) {
			teamsInMatchUp.push(teamsOfCurrentRound[i].id);

			if (teamsInMatchUp.length === teamsPerMatch) {
				matchUps.push({
					match: matchUps.length,
					teamIds: teamsInMatchUp.splice(0)
				});
			}
		}

        return matchUps;
    }
    
}

module.exports = { RoundController };