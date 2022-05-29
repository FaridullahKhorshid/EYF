import fs from 'fs';

exports.index = async (req, res) => {
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    res.render('game', {
        title: 'Game',
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
        games: await getGames(),
        pageInfo: 'U kunt hier verschillende games spelen, zowel single-player als multi-player.'
    });
};

exports.play = async (req, res) => {

    let game = req.query.game;
    let name = game.charAt(0).toUpperCase() + game.slice(1);

    res.render('game_play', {
        title: 'Game: ' + name.replaceAll('_', ' '),
        loggedIn: req.session.loggedIn,
        shoppingCart: req.shoppingCart,
        game: await getGames(game)
    });
};

async function getGames(gameCode = null) {

    // file dir
    let gameDir = 'public/images/games';
    let contentDir = '/images/games';

    let gameFiles = fs.readdirSync(gameDir);

    let gameObjects = [];
    let gameFound = null;

    await new Promise((resolve) => { // promising al of the loops to make sure that we do not mis any result

        gameFiles.forEach(function (game, i) {

            let code = game.replace('.png', '');
            let gameName = game.replace('.png', '').replaceAll('_', ' ');
            gameName = gameName.charAt(0).toUpperCase() + gameName.slice(1);

            let gameData = {
                name: gameName,
                code: code,
                thumbnail: contentDir + '/' + game
            }

            if (gameCode === code) {
                gameFound = gameData;
                resolve();
            }

            gameObjects.push(gameData);

            if (i === gameFiles.length - 1) resolve();
        });
    });

    if (gameFound !== null) {
        return gameFound;
    }

    return gameObjects;
}