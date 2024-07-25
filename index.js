

document.addEventListener('DOMContentLoaded', function () {
    console.log('works');


    updateDateTime(); // call to set date
    getWeather();

    //slider https://roundsliderui.com/

    $("#slider").roundSlider({
        sliderType: "min-range",
        handleShape: "round",
        width: 20,
        radius: 116,
        value: 32,
        lineCap: "round",
        min: "15",
        max: "32",
        startAngle: 170,
        endAngle: "+200"
    });
    //color picker https://iro.js.org/guide.html
    var colorPicker = new iro.ColorPicker("#picker", {
        // Set the size of the color picker
        width: 220,
        // Set the initial color to pure red
        color: "#c29c74"
      });
      colorPicker.on('color:change', function(color){
        let r = color.red;
        let g = color.green;
        let b = color.blue;
        console.log(`Red: ${r}, Green: ${g}, Blue: ${b}`); 
    
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
    });
      



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

function getWeather() {
    var apiKey = '2817f8fcf6361f5d6e39b993d2852890'; // Ensure this is your valid API key
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
            var tempCelsius = data.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
            var description = data.weather[0].description;

            // Update temperature in weathernumber element
            document.getElementById("weathernumber").innerHTML = Math.round(tempCelsius) + "&deg;C";

            // Generate descriptive weather text based on conditions
            var weatherText = generateWeatherText(description);
            document.getElementById("weathertext").innerHTML = weatherText;
        })
        .catch(e => {
            console.log('There was a problem with the fetch operation: ' + e.message);
            document.getElementById('weathernumber').innerHTML = 'N/A';
            document.getElementById('weathertext').innerHTML = 'Unable to fetch weather data.';
        });
}

function generateWeatherText(description) {
    //si inclou clear
    if (description.toLowerCase().includes("clear")) {
        document.getElementById(sun3D).display = ""
        return "Avui el cel estarà cerè.";

    }
    //si inclou cloud
    else if (description.toLowerCase().includes("cloud")) {
        document.getElementById(cloud3D).display = ""
        return "Avui el cel estarà ennuvolat.";

    }
    //si inclou pluja
    else if (description.toLowerCase().includes("rain")) {
        return "Avui probablement hi haurà precipitació.";
    } 
    // sino doncs aveure
    else {
        return description;
    }
}









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


//color and intensity 1


document.addEventListener("DOMContentLoaded", function() {
    const lightSlider = document.getElementById("lightSlider");
    lightSlider.addEventListener("input", function() {
        myFunction(this.value);
    });

    function myFunction(value) {
    document.getElementById("sliderValue").innerHTML = "Intensitat: " + value + "%";
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















});

//tab selector

document.addEventListener('DOMContentLoaded', function() {
    var currentPath = window.location.pathname;
    var element1 = document.getElementById('el1');
    var element2 = document.getElementById('el2');
    var element3 = document.getElementById('el3');
    var element4 = document.getElementById('el4');
  
    if (currentPath === '/C:/Users/bosch/Desktop/web2/index(3).html') {
        element1.style.fontWeight = '1000'; 
      } else if (currentPath === '/C:/Users/bosch/Desktop/web2/habitacio.html') {
        element2.style.fontWeight = '1000'; 
      }else if (currentPath === '/C:/Users/bosch/Desktop/web2/cuina.html') {
        element3.style.fontWeight = '1000'; 
      }else if (currentPath === '/C:/Users/bosch/Desktop/web2/oficina.html') {
            element4.style.fontWeight = '1000'; 
        }

    
    });