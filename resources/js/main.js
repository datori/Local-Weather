$(document).ready(function() {
    getLocation();

});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(location) {
            setLocation(location);
        });
    } else {
    	// Browser does not support geolocation.
    	$(".container-fluid").append(`<h2>Your browser does not support geolocation.</h2>`);
    }
};

function setLocation(location) {
    var lat = location.coords.latitude;
    var long = location.coords.longitude;

    getWeatherData(lat, long);
};

function getWeatherData(lat, long) {
    var apiKey = "842db364b7c37e80310e97ef46cf8396";
    jQuery.getJSON("https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appID=" + apiKey,
        function(json) {
            var name = json.name; // Location name.
            var weatherInfo = []; // Weather condition.
            var weatherID = json.weather[0].id; // ID of primary weather condition.
            var atmoInfo = [json.main.temp, json.main.pressure, json.main.humidity] // Atmospheric conditions.
            var windInfo = [json.wind.speed, json.wind.deg]; // Wind conditions.

            // Unpack weather values from object.
            json.weather.forEach(function(object){
                    weatherInfo.push(object.main);
            });

            setPage(name, weatherInfo, weatherID, atmoInfo, windInfo);
        });
};

function setPage(name, weatherInfo, weatherID, atmoInfo, windInfo) {
	weather = [];
	// Slice the weatherInfo array to a length of 3 items maximum.
	for(var i = 0; i < 3 && i < weatherInfo.length; i++){
			weather.push(weatherInfo[i]);
	};

	/* -- PAGE CONSTRUCTION -- */
	// Setup basic structure for weather information container.
    $(".container-fluid").append(`<br><br>
    <h1>${name}</h1> 	
    <h4 id="temperature">
    	<a>${Math.floor(atmoInfo[0] - 273.15)} <span id="temp-unit">C</span></a>
    </h4>
    <br>
    <br>
	<div class='container well'>
		<h2>Local Weather Conditions:</h4>
		<br>
	</div>
	`);

	// Add weather condition info to the page.
	switch(weather.length){
		case 1:
			// Display primary condition.
			$(".container.well").append(`
				<div class="row">
					<h2 class="col-12 col-lg-12">${weather[0]}</h2>
				</div>`);
			break;
		case 2:
			// Display 2 conditions in a row, with primary condition on the left side.
			$(".container.well").append(`
				<div class="row">
					<h2 class="col-6 col-lg-6">${weather[0]}</h2>
					<h2 class="col-6 col-lg-6">${weather[1]}</h2>
				</div>`)
			break;
		case 3:
			// Display 3 conditions as a row, and center the primary condition.
			$(".container.well").append(`
				<div class="row">
					<h4 class="col-4 col-lg-4">${weather[1]}</h4>
					<h2 class="col-4 col-lg-4">${weather[0]}</h2>
					<h4 class="col-4 col-lg-4">${weather[2]}</h4>
				</div>`)
	}

	// Add atmospheric and wind condition info.
	$(".container.well").append(`
		<hr>
		<div class="row justify-content-center">
			<div class="col-lg-4">
				<h2>Atmospheric</h2>
				<p>Pressure: ${atmoInfo[1]} hPa</p>
			</div>
			<div class="col-lg-4">
				<h2>Wind</h2>
				<p>Wind Speed: ${windInfo[0]} m/s</p>
				<p>Wind Direction: ${windInfo[1]} deg</p>
			</div>
		</div>
		`);

	// Change background image based on primary weather condition.
	if(weatherID >= 200 && weatherID < 300){ // Thunder Storm.
		$("body").css({"background-image": "url(resources/imgs/thunderstorm.jpg)"});
	}
	else if(weatherID >= 300 && weatherID < 400){ // Drizzle.
		$("body").css({"background-image": "url(resources/imgs/drizzle.jpg)"});
	}
	else if(weatherID >= 500 && weatherID < 600){ // Rain.
		$("body").css({"background-image": "url(resources/imgs/rain.jpg)"});
	}
	else if(weatherID >= 600 && weatherID < 700){ // Snow.
		$("body").css({"background-image": "url(resources/imgs/snow.jpg)"});
	}
	else if(weatherID >= 700 && weatherID < 800){ // Atmospheric.
		$("body").css({"background-image": "url(resources/imgs/atmospheric.jpg)"});
	}
	else if(weatherID == 800){ // Clear Sky.
		$("body").css({"background-image": "url(resources/imgs/clear.jpg)"});
	}
	else if(weatherID > 800 && weatherID < 900){ // Clouds.
		$("body").css({"background-image": "url(resources/imgs/clouds.jpg)"});
	}
	else if(weatherID >= 900 && weatherID < 907){ // Extreme conditions.
		$("body").css({"background-image": "url(resources/imgs/extreme.jpg)"});
	}
	else if(weatherID >= 951 && weatherID < 959){ // Misc. Wind conditions.
		$("body").css({"background-image": "url(resources/imgs/miscwind.jpg)"});
	}
	else if(weatherID >= 959 && weatherID < 963){ // Misc. Storm conditions.
		$("body").css({"background-image": "url(resources/imgs/extreme.jpg)"});
	}
	else{ // Default.
		$("body").css({"background-image": "url(resources/imgs/clear.jpg)"});
	}

	// CSS.
	$("#holder").animate({opacity: 1.0}, 1000);

	// Temperature change button.
	$('a').on('click', function(){
		if($(this).text().slice(-1) == 'C'){
			$(this).animate({opacity: 0.0}, 500, function(){
				$(this).html(`${Math.floor((atmoInfo[0] * 1.8) - 459.67)} <span id="temp-unit">F</span>`);
			});
			$(this).animate({opacity: 1.0}, 500);
		}
		else{
			$(this).animate({opacity: 0.0}, 500, function(){
				$(this).html(`${Math.floor(atmoInfo[0] - 273.15)} <span id="temp-unit">C</span>`);
			})
			$(this).animate({opacity: 1}, 500);
		}
	});
}
