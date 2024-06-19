

document.addEventListener('DOMContentLoaded', function () {
    console.log('works');


    updateDateTime(); // call to set date
    getWeather();


});
    

    function updateDateTime() {
        const now = new Date();
        const formattedDate = formatDate(now); // Call the formatting function
        document.getElementById("heregoestime").innerHTML = formattedDate;
        setInterval(updateDateTime, 500000);
    }


function formatDate(date) {
    const daysOfWeek = ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();

    return `${day}, ${month} ${dayOfMonth}`;
}

var tempCelsius;
var feelsLikeCelsius;

/*weather 
Weather Library by Noah H. Smith
- Source: https://github.com/noazark/weather/tree/0.1.0
- License: MIT License (Copyright (c) 2012 Noah H. Smith)
*/

function getWeather() {
    var apiKey = '2817f8fcf6361f5d6e39b993d2852890//';
    var city = 'Puigcerda,ES';
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Convert temperature from Kelvin to Celsius
            tempCelsius = data.main.temp - 273.15;
            feelsLikeCelsius = data.main.feels_like - 273.15;

            console.log(`${tempCelsius.toFixed(2)}°C`);
            console.log(`${feelsLikeCelsius.toFixed(2)}°C`);

            weatherload();
            
            

        })
        .catch(e => {
            console.log('There was a problem with the fetch operation: ' + e.message);
        });

}


function weatherload(){

    document.getElementById("weathernumber").innerHTML = Math.round(tempCelsius) + "&deg";
};



///buttons onwards of here
//wifi button
document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonwifi'); // Correctly selects the image acting as a button
    const backgroundBlur = document.querySelector('.background-blurwifi'); // Correctly selects the div with class "background-blur"

    let isButtonOnwifi = true;

    imgButton.addEventListener('click', toggleButton); // Attach event listener to the image

    function toggleButton() {
        if (isButtonOnwifi) {
            backgroundBlur.style.display = 'none'; // Use display property for better control
        } else {
            backgroundBlur.style.display = ''; // Reset to default display value
        }
        isButtonOnwifi =!isButtonOnwifi;  // Toggle the state
        console.log('WifiButton state:', isButtonOnwifi);
    }
});

//light button 

document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonlight'); // Correctly selects the image acting as a button
    const backgroundBlur = document.querySelector('.background-blurlight'); // Correctly selects the div with class "background-blur"
    
    let isButtonOnlight = true;

    imgButton.addEventListener('click', toggleButton); // Attach event listener to the image

    function toggleButton() {
        if (isButtonOnlight) {
            backgroundBlur.style.display = 'none'; //false
            //this is to send the request to toggle it, above this is for the visual state change

            const url = 'http://localhost:8080/http://localhost:30010/remote/object/call';

            const data = {
        "objectPath": "/Temp/Untitled_1.Untitled_1:PersistentLevel.Light2_C_UAID_B42E99961B5FEC0002_1293197031",
        "functionName": "Toggle",
        "parameters": {}
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })


    .catch((error) => {
        console.error('Error:', error);
    });


        } else {
            backgroundBlur.style.display = ''; // Reset to default display value
        }


        isButtonOnlight =!isButtonOnlight;  // Toggle the state
        console.log('Light Button state:', isButtonOnlight);
    }
});

//temp button

document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttontemp'); // Correctly selects the image acting as a button
    const backgroundBlur = document.querySelector('.background-blurtemp'); // Correctly selects the div with class "background-blur"
    
    let isButtonOntemp = true;

    imgButton.addEventListener('click', toggleButton); // Attach event listener to the image

    function toggleButton() {
        if (isButtonOntemp) {
            backgroundBlur.style.display = 'none'; // Use display property for better control
        } else {
            backgroundBlur.style.display = ''; // Reset to default display value
        }
        isButtonOntemp =!isButtonOntemp;  // Toggle the state
        console.log('Temp Button state:', isButtonOntemp);
    }
});

//vacum button

document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonvacum'); // Correctly selects the image acting as a button
    const backgroundBlur = document.querySelector('.background-blurvacum'); // Correctly selects the div with class "background-blur"
    
    let isButtonOnvacum = true;

    imgButton.addEventListener('click', toggleButton); // Attach event listener to the image

    function toggleButton() {
        if (isButtonOnvacum) {
            backgroundBlur.style.display = 'none'; // Use display property for better control
        } else {
            backgroundBlur.style.display = ''; // Reset to default display value
        }
        isButtonOnvacum =!isButtonOnvacum;  // Toggle the state
        console.log('Vacuum Button state:', isButtonOnvacum);
    }
});