// This function will run when the document is loaded
$(function () {
    // Loading 'searchHistory' from localStorage and parsing it as JSON. If it's not available, initializing as empty array
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Constant string for the API key used for requests
    const apiKey = "efecedb6149c17de99a994a1d3cb87c0";

    // Function to run when the '#search-button' is clicked
    $('#search-button').click(function () {
        // Storing the value of '#city-input' in 'city'
        let city = $('#city-input').val();
        
        // If 'city' has a value, run the following functions
        if (city) {
            fetchWeather(city); // Function to fetch weather data
            fetchForecast(city); // Function to fetch forecast data
            saveSearchHistory(city); // Function to save search history
            renderSearchHistory(); // Function to render search history
        }
    });

    // Function to run when the '#clear-btn' is clicked
    $('#clear-btn').click(function () {
        clearSearchHistory() // Function to clear search history
        renderSearchHistory(); // Function to render search history
    });

    // Function to run when the document is ready
    $(document).ready( function () {
        // Default city is set as 'Fairfax'
        let city = "Fairfax";
        fetchWeather(city); // Function to fetch weather data
        fetchForecast(city); // Function to fetch forecast data
    });

    // Function to run when any '.history-item' is clicked
    $(document).on('click', '.history-item', function () {
        // The text of the clicked '.history-item' is stored in 'city'
        let city = $(this).text();
        fetchWeather(city); // Function to fetch weather data
        fetchForecast(city); // Function to fetch forecast data
    });

    // Function to fetch weather data
    function fetchWeather(city) {
        // URL for the API request
        const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        // AJAX request
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            // Once the request is complete, the following elements are updated with the data from the response
            $("#city-name").text(response.name);
            $("#temperature").text("Temperature: " + response.main.temp + " °F");
            $("#humidity").text("Humidity: " + response.main.humidity + " %");
            $("#windspeed").text("Wind Speed: " + response.wind.speed + " MPH");
        });
    }

    // Function to fetch forecast data
    function fetchForecast(city) {
        // URL for the API request
        const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

        // AJAX request
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            // Once the request is complete, the following elements are updated with the data from the response
            for (let i = 0; i < 5; i++) {
                const forecastIndex = i * 8 + 4;
                $("#date" + i + "-temp").text("Temp: " + response.list[forecastIndex].main.temp + " °F");
                $("#date" + i + "-humidity").text("Humidity: " + response.list[forecastIndex].main.humidity + " %");
                $("#date" + i + "-wind").text("Wind: " + response.list[forecastIndex].wind.speed + " MPH");

                // Also, the forecast icons are updated
                const iconCode = response.list[forecastIndex].weather[0].icon;
                const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                $("#Icon" + i).attr('src', iconUrl);
            }
        });
    }

    // Function to save search history
    function saveSearchHistory(city) {
        // If the 'city' is not already in the 'searchHistory', add it and save 'searchHistory' in localStorage
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }

    // Function to clear search history
    function clearSearchHistory() {
        // Overwriting 'searchHistory' in localStorage with an empty array
        localStorage.setItem('searchHistory', JSON.stringify([]));
    }

    // Function to render search history
    function renderSearchHistory() {
        // Emptying '#search-history'
        $('#search-history').empty();

        // For each item in 'searchHistory' in localStorage, prepend a new button with class '.history-item' and text of the city
        JSON.parse(localStorage.getItem('searchHistory')).forEach(city => {
            $('#search-history').prepend($('<button>').addClass('history-item').text(city));
        });
    }

    // Render search history when the document loads
    renderSearchHistory();
});