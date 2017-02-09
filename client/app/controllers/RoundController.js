class RoundController {
    constructor () {

    }
    
    // get number of rounds in a tournament
    static getNumberOfRounds (numberOfTeams, teamsPerMatch) {
        let numberOfRounds = Math.log(numberOfTeams) / Math.log(teamsPerMatch);
        return Math.floor(numberOfRounds);
    }
    
}

module.exports = { RoundController };