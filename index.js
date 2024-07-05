

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const objectpath = "/Game/Untitled.Untitled:PersistentLevel.Light3_C_UAID_B42E99961B5F3C0102_2085930116"; /// HERE GOES OBJECT PATH FOR WIFI PANEL
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        

        isButtonOnwifi = !isButtonOnwifi;  // Toggle the state
        console.log('WifiButton state:', isButtonOnwifi);
    }
});



//light button 
document.addEventListener("DOMContentLoaded", function() {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const objectpath2 = "/Temp/Untitled_1.Untitled_1:PersistentLevel.Light1_C_UAID_B42E99961B5FE60402_1487855201"; /// HERE GOES OBJECT PATH FOR LIGHTING PANEL
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const imgButton = document.getElementById('buttonlight'); // Assuming 'buttonlight' is the ID of your button image
    const backgroundBlur = document.querySelector('.background-blurlight'); // Assuming 'background-blurlight' is the class of your background div
    
    let isButtonOnlight = true;

    imgButton.addEventListener('click', toggleButton); // Attach event listener to the image button

    function toggleButton() {
        if (isButtonOnlight) {

            backgroundBlur.style.display = 'none'; // Hide background (visual state change)


            const data = {
                functionName: "Toggle",
                parameters: {},
                access: "WRITE_TRANSACTION_ACCESS"
            };

            fetch('http://localhost:30010/remote/preset/Lightbool/function/Toggle', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

        } 
        else {
            backgroundBlur.style.display = ''; // Reset to default display value
            // Construct the data payload for the POST request
            const data = {
                functionName: "Toggle",
                parameters: {},
                access: "WRITE_TRANSACTION_ACCESS"
            };

            fetch('http://localhost:30010/remote/preset/Lightbool/function/Toggle', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

        }

        isButtonOnlight = !isButtonOnlight;  // Toggle button state
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


//color and intensity tryign


document.addEventListener("DOMContentLoaded", function() {
    const lightSlider = document.getElementById("lightSlider");
    lightSlider.addEventListener("input", function() {
        myFunction(this.value);
    });

    function myFunction(value) {
    document.getElementById("sliderValue").innerHTML = "Intensity: " + value + "%";
    updateIntensity(value)
    console.log(value)
     
}

function updateIntensity(value) {
    const url = 'http://localhost:30010/remote/preset/Lightbool/property/Intensity';
    const data = {
        PropertyValue: Number(value*3),  
        GenerateTransaction: true
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}


document.getElementById('myColorPicker').addEventListener('input', function() {
    var hexColor = this.value;
    var rgbValues = hexToRgb(hexColor);
});

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var r = parseInt(hex.substr(0, 2), 16);
    var g = parseInt(hex.substr(2, 2), 16);
    var b = parseInt(hex.substr(4, 2), 16);
    

    fetch('http://localhost:30010/remote/preset/Lightbool/property/R', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PropertyValue: Number(r),  
            GenerateTransaction: true
        })
    });


    fetch('http://localhost:30010/remote/preset/Lightbool/property/B', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PropertyValue: Number(b),  
            GenerateTransaction: true
        })
    });


    fetch("http://localhost:30010/remote/preset/Lightbool/property/G", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PropertyValue: Number(g),  
            GenerateTransaction: true
        })
    });
}











});

