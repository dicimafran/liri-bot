/* ========= Pseudocoding ======= 

4 commands --> 
    commands: my-tweets, spotify-this-song, movie-this, do-what-it-says
    Using inquirer for ease of use.
    needs: conditionals to display appropriate outputs. Switch statement can be used.
    
*/

// Requirements

var dotenv= require('dotenv').config(); 
var keys= require('./keys');
var fs= require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var inquirer = require('inquirer');
var request = require('request');


var Spotify = require('node-spotify-api');
var Twitter = require('twitter');


inquirer.prompt([
    {
        type: 'list',
        message: 'What do you want to do?',
        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
        name: 'command'
    }

]).then(function (inquirerResponse) {

    switch (inquirerResponse.command) {

// ================ Tweets =========================
    
/*    
    case 'my-tweets':
            inquirer.prompt([
                {
                type: "input",
                message: "Search a song.",
                name: "song"
                }
            ]).then (function (inquirerResponse) {
                console.log(inquirerResponse)
            });
        break;
*/

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
                    var songQuery= inquirerResponse.song

            spotify
                .search(
                        { 
                        type: 'track',
                        query: songQuery
                        }
                ).then(function(response) {
                        console.log(response);
                    })
                .catch(function(err) {
                    console.log(err);
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

                var movieQuery = 'http://www.omdbapi.com/?t=' + inquirerResponse.movieTitle + "&y=&plot=short&apikey=trilogy"


                request(movieQuery, function (error, response, body) {
                    var jBod = JSON.parse(body);

                    // var movieDataArray= [Title, Year, idmbRating, Ratings, Country, Language, Plot, Actors]
                    var movieData = [
                        'Title: ' + jBod.Title,
                        'imdb Rating: ' + jBod.imdbRating,
                        'Rotten Tomatoes Rating: ' + jBod.Ratings[2],
                        'Country: ' + jBod.Country,
                        'Language: ' + jBod.Language,
                        'Plot: ' + jBod.Plot,
                        'Actors: ' + jBod.Actors
                    ].join("\n\n");

                    console.log(movieData);

                });
            });
        break;
// =========================================================

        case 'do-what-it-says':
            console.log('moo');
            break;

        default:
            console.log('Sorry. I don\'t understand your request.');
    }
});
