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

Notes to my cringey noob self: 
    - console.log('\n') will make spacing between text. Making separate a spacing variable for the first attempt wasn't efficient...
    - I can only make a .env file with command line because I can't use the usual rename method when looking through the folder
    - Always use npm install --save for dependencies you want in your package.

Progress: 
    - OMDB
        - [x] get movie search to work and have info formatted
        - [] if user doesn't provide input, have it default to 'Mr. Nobody
        - [] if user input doesn't have a match default to Mr. Nobody

    - Gotta get Spotify to work.
        - [x] spotify key works
        - [] spotify query works, but response needs refinement.
        
    - Do what it says command --> Need help
        - [x] read fs successful
        - [] have spotify search for whatever's in random.txt. Might require promises in order to work.
        - [] Trying to think of how to switch the case to 'spotify-this-song' via reading of the txt file. There may be problems with scope.

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
        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says', '????? \n'],
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
                        let tweetnumber= parseFloat([i]) + parseFloat(1); 
                        
                        console.log('\t\t Tweet '+ tweetnumber);
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
                    var songQuery = inquirerResponse.song;
                     
                    spotify
                        .search( 
                            {
                                type: 'track',
                                query: songQuery,
                                limit: 3 
                            }, 
                            function(err, data) {
                                if (err) {
                                return console.log('Error occurred: ' + err);
                                }
                            
                            console.log(data.tracks.items[0].artists[0]); 
                            });

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
                        
                        // Formatting
                        console.log(dblLine);
                        console.log('\t' + 'Listing Movie Info...' + '\n' + dblLine);
                        
                        // Movie data
                        console.log(movieData);

                        // Formatting
                        console.log(dblLine);
                    }

                    if (error) {
                        console.log(error)                        
                    }
                });
            });

        break;
    // ====================== fs readfile + spotify ===========================
        case 'do-what-it-says':

            // Reading random.txt 
            fs.readFile('random.txt', 'utf-8', function (error, data) {
                if (error) {
                    return console.log(error);
                }

                var randomSplit= data.split(',');
                console.log(randomSplit);
               
            })

    
        break;

        default:
            console.log('\n' + 'Sorry. I don\'t understand your request.' + '\n');
    }
});
