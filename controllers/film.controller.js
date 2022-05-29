import fs from 'fs';

exports.index = async (req, res) => {
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    res.render('film', {
        title: 'Films',
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
        films: await getFilms(),
        pageInfo: 'Om u tijd zo aangenaam mogelijk te maken kunt u kiezen uit het aanbod van verschillende films.'
    });
};

exports.play = async (req, res) => {

    let code = req.query.code;

    res.render('film_play', {
        title: 'Film: ' + code,
        loggedIn: req.session.loggedIn,
        shoppingCart: req.shoppingCart,
        film: await getFilms(code)
    });
};

async function getFilms(filmCode = null) {

    // from usb
    let filmDir = 'E:/eyf/films/';
    let contentDir = '/usb/films';

    let films = [];

    if (fs.existsSync(filmDir)) { // check if there is an usb in use
        films = fs.readdirSync(filmDir);
    } else { // use default film if usb is not connected
        filmDir = 'public/content/eyf/films';
        contentDir = '/content/eyf/films';
        films = fs.readdirSync(filmDir);
    }

    let filmObjects = [];
    let filmFound = null;

    await new Promise((resolve) => { // promising al of the loops to make sure that we don not mis any result

        films.forEach(function (film, i) {

            let stats = fs.statSync(filmDir + '/' + film);

            if (stats.isFile() && film.includes('mp4')) {

                let code = film.replace('.mp4', '');
                let filmName = film.replace('mp4', '').replaceAll('_', ' ');
                filmName = filmName.charAt(0).toUpperCase() + filmName.slice(1);

                let filmData = {
                    name: filmName,
                    path: contentDir + '/' + film,
                    code: code,
                    poster: contentDir + '/poster/' + film.replace('mp4', 'png')
                }

                if (filmCode === code) {
                    filmFound = filmData;
                    resolve();
                }

                filmObjects.push(filmData);
            }

            if (i === films.length - 1) resolve();
        });
    });

    if (filmFound !== null) {
        return filmFound;
    }

    return filmObjects;
}