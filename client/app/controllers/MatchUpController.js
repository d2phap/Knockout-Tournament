class MatchUpController {
    constructor() {
        
    }
    
    // get number of matchUps in a tournament
    static getNumberOfMatchUps (numberOfTeams, teamsPerMatch) {
        let match_count = 0;
        while (numberOfTeams != 1) {
            numberOfTeams = numberOfTeams / teamsPerMatch;
            match_count += numberOfTeams;
        }
        return match_count;
    }


    
    
}

module.exports = { MatchUpController };