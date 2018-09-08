/* ========= Pseudocoding ======= 

4 commands --> 
    commands: my-tweets, spotify-this-song, movie-this, do-what-it-says
        my-tweets: shows last 20 tweets
        spotify: shows the input song's artist, name, preview link, and album
        Movie: shows the input movie's  title, release year, imdb rating, rotten tomatoes rating, language, plot, and actors

    Using inquirer for ease of use.
    needs: conditionals to display appropriate outputs. Switch statement can be used.

Aims: 
    Make the CLI easy to read.

=============== Lessons to Self ==============

Notes to my cringey noob self: 
    - console.log('\n') will make spacing between text. Making separate a spacing variable for the first attempt wasn't efficient...
    - I can only make a .env file with command line because I can't use the usual rename method when looking through the folder
    - Always use npm install --save for dependencies you want in your package. 

Self-critiques for improvement:
    - Initial loading is slow. How can I make it faster? 
    - My aim was to make this bot functional at the expense of being immersed in callback hell.
    - I know movie-this and spotify-this can be shortened. The following are the ways I think I can make it better.
        > modules for export
        > constructor functions


================== Progress ========================

    - Twitter- Finished. Shows last 20 tweets of my dummy account.

    - OMDB- Finished
        - [x] get movie search to work and have info formatted
        - [x] if user doesn't provide input, have it default to 'Mr. Nobody
        
    - Spotify this- WIP. 
        - [x] spotify key works
        - [wip] spotify query works, but response needs refinement. 
                [] Somehow I have trouble searching artist and track at the same time. 'The Sign' does not lead to Ace of Base!
                [] I gotta figure out how to access the object with a preview of the link from Spotify
        
    - Do what it says command --> NEED HELP
        - [x] read fs successful
        - [] have spotify search for whatever's in random.txt.
        - [] Trying to think of how to switch the case to 'spotify-this-song' via reading of the txt file.
*/

// =============== Dependencies ===================

var dotenv = require('dotenv').config();
var keys = require('./keys');
var inquirer = require('inquirer');
var request = require('request');
var fs = require('fs');

// Twitter module export
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);


// Spotify module export
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// ==================== Formatting stuff  ==================

var line = ('--------------------------------------------');
var dblLine = ('\n' + '===========================================' + '\n');


// ================ CLI ============================

inquirer.prompt([
    {
        type: 'list',
        message: '\n What do you want to do? \n',
        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says', '?????'],
        name: 'command'
    }

]).then(function (inquirerResponse) {

    switch (inquirerResponse.command) {

    // ================ Tweets =========================

        case 'my-tweets':
            // Parameters set to limit tweet responses from my dummy twitter account.
            client.get('statuses/user_timeline', { screen_name: 'Horror_birds', count: 20 }, function (error, tweet, response) {

                if (error) throw error;

                if (!error) {
                    // Interesting. It seems that some languages don't show up. Index number and '\n' (aka spaces) added for readability.
                    console.log(dblLine);
                    console.log('\t Listing the last 20 tweets... \n');

                    for (i = 0; i < tweet.length; i++) {
                        console.log(line + '\n');

                        // Tweet number, text, and language. Note to self: the tweet number doesn't show up on some tweets correctly unless there are parentheses around both parseFloat integers.
                        let tweetnumber = parseFloat([i]) + parseFloat(1);

                        console.log('\t\t Tweet ' + tweetnumber);
                        console.log('\n   ' + tweet[i].created_at);
                        console.log('\n   ' + tweet[i].text);
                        console.log('\n   ' + 'Language: ' + tweet[i].lang + '\n');
                    }
                }

            });

        break;

    // ================ Spotify =========================

        case 'spotify-this-song':
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "Search a song.",
                        name: "song"
                    }

                ]).then(function (inquirerResponse) {

                    // Default search for nothing typed
                    if (inquirerResponse.song === '') {
                        spotify.search({ type: 'track', query: 'The Sign', limit: 1 }, function (err, data) {
                            if (err) {
                                return console.log('Error occurred: ' + err);
                            }

                            if (!err) {
                                //console.log(data)
                                //console.log(data.tracks.items[0].name)

                                let trackInfo = [
                                    dblLine,
                                    '\t Default search: The Sign',
                                    line,
                                    '  Artist: ' + data.tracks.items[0].artists[0].name,
                                    '  Song Name: ' + data.tracks.items[0].name,
                                    '  Album song is from: ' + data.tracks.items[0].album.name,
                                    dblLine + '\n'
                                ].join('\n\n');

                                console.log(trackInfo);
                            }

                        });
                    }

                    // Search if something is typed.
                    else {
                        var songQuery = inquirerResponse.song;

                        spotify.search({ type: 'track', query: songQuery, limit: 1 }, function (err, data) {
                            if (err) {
                                return console.log('Error occurred: ' + err);
                            }

                            else {
                                let trackInfo = [
                                    dblLine,
                                        '\t You searched: ' + inquirerResponse.song,
                                    line,
                                        '  Artist: ' + data.tracks.items[0].artists[0].name,
                                        '  Song Name: ' + data.tracks.items[0].name,
                                        '  Album song is from: ' + data.tracks.items[0].album.name,
                                    dblLine + '\n'
                                ].join('\n\n')

                                console.log(trackInfo);
                            }
                        });
                    }

                });
            break;

    // ================ Movie search ========================= 

        case 'movie-this':

            inquirer.prompt([
                {
                    type: "input",
                    message: "Search a movie.",
                    name: "movieTitle"
                }
            ]).then(function (inquirerResponse) {

                var movieQuery = 'http://www.omdbapi.com/?t=' + inquirerResponse.movieTitle + "&y=&plot=short&apikey=trilogy";
                var defaultMovie = 'http://www.omdbapi.com/?t=' + 'Mr. Nobody' + "&y=&plot=short&apikey=trilogy";

                if (inquirerResponse.movieTitle !==''){
                    request(movieQuery, function (error, response, body) {

                        // jBod stands for Jason Body
                        var jBod = JSON.parse(body);

                        // var movieDataArray= [Title, Year, idmbRating, Ratings, Country, Language, Plot, Actors]
                        // Note to self: Joining by '\n\n' means each movieData array item will be separated by a new line before and after it.
                        var movieData = [
                            '  Title: ' + jBod.Title,
                            '  imdb Rating: ' + jBod.imdbRating,
                            '  Rotten Tomatoes Rating: ' + jBod.Ratings[2],
                            '  Country: ' + jBod.Country,
                            '  Language: ' + jBod.Language,
                            '  Plot: ' + jBod.Plot,
                            '  Actors: ' + jBod.Actors
                        ].join("\n\n");

                        if (!error & response.statusCode === 200) {
                            //Formatting                    
                            console.log(dblLine +'\t' + 'Listing Movie Info...' + '\n' + dblLine);

                            // Movie data
                            console.log(movieData + '\n' + dblLine);
                        }

                        if (error) {
                            console.log(error)
                        }
                    });
                }
            else {
                request(defaultMovie, function (error, response, body) {

                    // jBod stands for Jason Body
                    var jBod = JSON.parse(body);

                    // var movieDataArray= [Title, Year, idmbRating, Ratings, Country, Language, Plot, Actors]
                    // Note to self: Joining by '\n\n' means each movieData array item will be separated by a new line before and after it.
                    var movieData = [
                        '  Title: ' + jBod.Title,
                        '  imdb Rating: ' + jBod.imdbRating,
                        '  Rotten Tomatoes Rating: ' + jBod.Ratings[2],
                        '  Country: ' + jBod.Country,
                        '  Language: ' + jBod.Language,
                        '  Plot: ' + jBod.Plot,
                        '  Actors: ' + jBod.Actors
                    ].join("\n\n");

                        if (!error & response.statusCode === 200) {
                            //Formatting                    
                            console.log(dblLine +'\t' + 'Listing Movie Info...' + '\n' + dblLine);

                            // Movie data
                            console.log(movieData + '\n' + dblLine);
                        }

                        if (error) {
                            console.log(error)
                        }
                    }
                )};

            });
            break;
        // ====================== fs readfile + spotify ===========================
        case 'do-what-it-says':

            // Reading random.txt 
            fs.readFile('random.txt', 'utf-8', function (error, data) {
                if (error) {
                    return console.log(error);
                }

                if (!error) {
                    var randomSplit = data.split(',');
                    console.log(randomSplit);
                }

            })

            break;

        default:
            console.log('\n' + 'Sorry. I don\'t understand your request.' + '\n');
    }
});
