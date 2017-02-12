class MatchUpController {
    constructor() {
        
    }
    
    // get number of matchUps in a tournament
    static getNumberOfMatchUps (numberOfTeams, teamsPerMatch) {
        let match_count = 0;
        while (numberOfTeams != 1) {
            numberOfTeams = Math.floor(numberOfTeams / teamsPerMatch);
            match_count += numberOfTeams;

            // console.warn("numberOfTeams = " + numberOfTeams);
            // console.warn("match_count = " + match_count);
        }
        return match_count;
    }


    
    
}

module.exports = { MatchUpController };