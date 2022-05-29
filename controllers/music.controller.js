import fs from 'fs';

exports.index = async (req, res) => {
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    res.render('music', {
        title: 'Music',
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
        albums: await getAlbums(),
        pageInfo: 'Dit is de muziek pagina waar u meerdere albums van verschillende artiesten kan beluisteren. '
    });
};

exports.play = async (req, res) => {

    let name = req.query.album;
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    res.render('music_play', {
        title: 'Music play',
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
        album: await getAlbums(name)
    });
};

exports.getFiles = async (req, res) => {

    let album = req.query.album;
    let musicFiles = await getAlbums(album);

    res.send(musicFiles.tracks);
}

async function getAlbums(currentAlbum = null) {

    // from usb
    let musicDir = 'E:/eyf/music/';
    let contentDir = '/usb/music';

    let artists = [];


    if (fs.existsSync(musicDir)) { // check if there is an usb in use
        artists = fs.readdirSync(musicDir);
    } else { // use default music if usb is not connected
        musicDir = 'public/content/eyf/music';
        contentDir = '/content/eyf/music';
        artists = fs.readdirSync(musicDir);
    }

    let musicAlbums = [];
    let returnAlbum = null;

    await new Promise((resolve) => { // promising al of the loops to make sure that we don not mis any result

        artists.forEach(function (artist, i) {

            let albums = fs.readdirSync(musicDir + '/' + artist);
            let artistName = artist.charAt(0).toUpperCase() + artist.slice(1).replaceAll('_', ' ');

            albums.forEach(function (album, i) {

                let tracks = fs.readdirSync(musicDir + '/' + artist + '/' + album).filter(track => track.indexOf('png') === -1);

                let musicAlbum = {
                    artist: artistName,
                    quantityTracks: tracks.length,
                    code: album,
                    name: album.charAt(0).toUpperCase() + album.slice(1).replaceAll('_', ' '),
                    thumbnail: contentDir + '/' + artist + '/' + album + '/' + album + '.png',
                    tracks: []
                }

                // loop throw the through and a js object from it
                tracks.forEach(function (track, i) {
                    let name = track.replace('mp3', '').replaceAll('_', ' ');
                    name = name.charAt(0).toUpperCase() + name.slice(1);

                    musicAlbum['tracks'].push(
                        {
                            name: name,
                            path: contentDir + '/' + artist + '/' + album + '/' + track
                        }
                    );
                });

                if (currentAlbum !== null && currentAlbum === album) {
                    returnAlbum = musicAlbum;
                }

                musicAlbums.push(musicAlbum);
            });

            if (i === artists.length - 1) resolve();
        });
    });

    if (returnAlbum !== null) {
        return returnAlbum;
    }

    return musicAlbums;
}