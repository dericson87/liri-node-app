//COMMANDS: concert-this, spotify-this-song, movie-this, do-what-it-says

require("dotenv").config();

var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

let chalk = require('chalk');

var userOption = process.argv[2]; 
var inputParameter = process.argv[3];

UserInputs(userOption, inputParameter);

function UserInputs (userOption, inputParameter){
    switch (userOption) {
    case 'concert-this':
        showConcertInfo(inputParameter);
        break;
    case 'spotify-this-song':
        spotifySong(inputParameter);
        break;
    case 'movie-this':
        showMovieInfo(inputParameter);
        break;
    case 'do-what-it-says':
        showSomeInfo();
        break;
    default: 
        console.log("Valid commands: \nconcert-this <'name of band'> \nspotify-this-song <'name of song'>\nmovie-this <'name of movie'>\ndo-what-it-says");
    }
}

// Bands in Town
function showConcertInfo(inputParameter){
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputParameter + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var concerts = JSON.parse(body);
        for (var i = 0; i < concerts.length; i++) {    
          display(chalk.blue("\n********EVENT INFO*********\n"));  
            fs.appendFileSync("log.txt", "\n********EVENT INFO***********\n");
           display(chalk.green(i));
            fs.appendFileSync("log.txt", i+"\n");
           display(chalk.green("Name of the venue: " + concerts[i].venue.name));
            fs.appendFileSync("log.txt", "Name of the venue: " + concerts[i].venue.name+"\n");
           display(chalk.green("Venue location: " +  concerts[i].venue.city));
            fs.appendFileSync("log.txt", "Venue location: " +  concerts[i].venue.city+"\n");
            var dTime = concerts[i].datetime;
            var month = dTime.substring(5,7);
            var year = dTime.substring(0,4);
            var day = dTime.substring(8,10);
            var dateForm = month + "/" + day + "/" + year
           display(chalk.green("Date of the Event: " +  dateForm));
            fs.appendFileSync("log.txt", "Date of the Event: " + dateForm +"\n");
           display(chalk.blue("\n***************************"));
            fs.appendFileSync("log.txt", "******************************");
        }
    } else{
      display(chalk.red('Error occurred.'));
    }
});}

//Spotify
function spotifySong(parameter) {
  var searchTrack;
  if (parameter === undefined) {
    searchTrack = "Ace of Base The Sign";
  } else {
    searchTrack = parameter;
  }

  spotify.search({
    type: 'track',
    query: searchTrack
  }, function(error, data) {
    if (error) {
      display('Error recorded: ' + error);
      return;
    } else {
      display(chalk.blue("\n**********SONG INFO***********\n"));
      fs.appendFileSync("log.txt","\n**********SONG INFO***********\n");
      display(chalk.green("Artist: " + data.tracks.items[0].artists[0].name));
      fs.appendFileSync("log.txt","Artist: " + data.tracks.items[0].artists[0].name + "\n");
      display(chalk.green("Song: " + data.tracks.items[0].name));
      fs.appendFileSync("log.txt","Song: " + data.tracks.items[0].name + "\n");
      display(chalk.green("Preview: " + data.tracks.items[3].preview_url));
      fs.appendFileSync("log.txt","Preview: " + data.tracks.items[3].preview_url + "\n");
      display(chalk.green("Album: " + data.tracks.items[0].album.name));
      fs.appendFileSync("log.txt","Album: " + data.tracks.items[0].album.name);
      display(chalk.blue("\n******************************\n"));
      fs.appendFileSync("log.txt", "\n******************************\n");  
    }
  });
};

//OMDB
function showMovieInfo(inputParameter){
    if (inputParameter === undefined) {
        inputParameter = "Mr. Nobody"
        display(chalk.red("-----------------------"));
        fs.appendFileSync("log.txt", "-----------------------\n");
        display(chalk.red("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/"));
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/" +"\n");
        display(chalk.red("It's on Netflix!"));
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + inputParameter + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
   
    if (!error && response.statusCode === 200) {
        var movies = JSON.parse(body);
        display(chalk.blue("\n**********MOVIE INFO*********\n"));  
        fs.appendFileSync("log.txt", "**********MOVIE INFO*********\n");
        display(chalk.green("Title: " + movies.Title));
        fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
       display(chalk.green("Release Year: " + movies.Year));
        fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
        display(chalk.green("IMDB Rating: " + movies.imdbRating));
        fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
       display(chalk.green("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies)));
        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
       display(chalk.green("Country of Production: " + movies.Country));
        fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
       display(chalk.green("Language: " + movies.Language));
        fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
       display(chalk.green("Plot: " + movies.Plot));
        fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
       display(chalk.green("Actors: " + movies.Actors));
        fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
        display(chalk.blue("\n**********MOVIE INFO*********\n"));  
        fs.appendFileSync("log.txt", "*****************************\n");
    } else{
      console.log('Error occurred.');
    }

});}

//Rotten Tomatoes
function getRottenTomatoesRatingObject (data) {
    return data.Ratings.find(function (item) {
       return item.Source === "Rotten Tomatoes";
    });
  }
  function getRottenTomatoesRatingValue (data) {
    return getRottenTomatoesRatingObject(data).Value;
  }

// random.txt 
function showSomeInfo(){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
    });
}
    function display (dataToLog) {
        console.log(dataToLog);
    }
    
