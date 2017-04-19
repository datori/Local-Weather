$(document).ready(function() {
    getLocation();

});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(location) {
            setLocation(location)
        });
    } else {

    }
};

function setLocation(location) {
    var lat = location.coords.latitude;
    var long = location.coords.longitude;
    $("#location").append(`Latitude: ${lat} | Longitude: ${long}`);

    getWeatherData(lat, long);
};

function getWeatherData(lat, long) {
    var apiKey = "842db364b7c37e80310e97ef46cf8396";
    jQuery.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appID=" + apiKey,
        function(json) {
            var name = json.name; // Location name.
            var weatherInfo = []; // Weather condition + description.
            var atmoInfo = [json.main.temp, json.main.pressure, json.main.humidity] // Atmospheric conditions.
            var windInfo = [json.wind.speed, json.wind.deg]; // Wind conditions.
            var data = JSON.stringify(json); // JSON return data.

            // Unpack weather values from object.
            json.weather.forEach(function(object){
                    weatherInfo.push(object.main);

            });

            setPage(name, weatherInfo, atmoInfo, windInfo, data);
        });
};

function setPage(name, weatherInfo, atmoInfo, windInfo, data) {
	// Setup basic structure for weather information container.
    $(".container-fluid").append(`<h1>${name}</h1>
    <br>
	<div class='container well'>
		<h2>Local Weather Conditions</h4>
		<br>
	</div>
	`);

	weather = [];
	// Slice the weatherInfo array to a length of 3 items maximum.
	for(var i = 0; i < 3 && i < weatherInfo.length; i++){
			weather.push(weatherInfo[i]);
	};

	// Add weather condition info to the page.
	switch(weather.length){
		case 1:
			$(".container.well").append(`
				<div class="row">
					<h3 class="col-lg-12">${weather[0]}</h5>
				</div>`);
			break;
		case 2:
			$(".container.well").append(`
				<div class="row">
					<h3 class="col-lg-6">${weather[0]}</h5>
					<h3 class="col-lg-6">${weather[1]}</h5>
				</div>`)
			break;
		case 3:
			$(".container.well").append(`
				<div class="row">
					<h3 class="col-lg-4">${weather[0]}</h5>
					<h3 class="col-lg-4">${weather[1]}</h5>
					<h3 class="col-lg-4">${weather[2]}</h5>
				</div>`)
	}

	// Add atmospheric and wind condition info.
	$(".container.well").append(`
		<hr>
		<div class="row justify-content-center">
			<div class="col-lg-4">
				<h2>Atmospheric</h2>
				<p id="temperature">Temperature: ${Math.floor(atmoInfo[0] - 273.15)} C</p>
				<p>Pressure: ${atmoInfo[1]} hPa</p>
			</div>
			<div class="col-lg-4">
				<h2>Wind</h2>
				<p>Wind Speed: ${windInfo[0]} m/s</p>
				<p>Wind Direction: ${windInfo[1]} deg</p>
			</div>
		</div>

		`);

	// CSS.
	$("body").css({"background-image": "url(resources/imgs/sunny-sky.jpg)"});

}
