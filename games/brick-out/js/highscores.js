const HIGH_SCORE_KEY = "BreakoutHighScores";
const MAX_HIGH_SCORES = 10;

function loadHighScores(){

    let highScores = localStorage.getItem(HIGH_SCORE_KEY);

    if(highScores){
        return JSON.parse(highScores);
    }

    return [];
}

function saveHighScores(scores){
    localStorage.setItem(
        HIGH_SCORE_KEY,
        JSON.stringify(scores)
    );
}

function isHighScore(score){

    let highScores = loadHighScores();

    if(highScores.length < MAX_HIGH_SCORES)
        return true;

    return score > highScores[highScores.length-1].score;
}

function addHighScore(name,score){

    let highScores = loadHighScores();

    highScores.push({
        name:name,
        score:score
    });

    highScores.sort((a,b)=>b.score-a.score);

    highScores = highScores.slice(0,MAX_HIGH_SCORES);

    saveHighScores(highScores);
    game.highScores = highScores;
}