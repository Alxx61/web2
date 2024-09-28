

document.addEventListener('DOMContentLoaded', function () {
    console.log('works');

    updateDateTime(); // call to set date
    getWeather();

    //lliscador https://roundsliderui.com/
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

    //selector de color https://iro.js.org/guide.html



    let alertShown = false;

    document.getElementById('picker').addEventListener('mouseover', function() {
        if (!alertShown) {
            //alert("Siusplau, no arrossegueu el color, genera moltes transaccions");            alertShown = true;
        }
    }, { once: true });

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
    var apiKey = '2817f8fcf6361f5d6e39b993d2852890//'; // Ensure this is your valid API key
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
    var sun3DElement = document.getElementById("sun3D");
    var cloud3DElement = document.getElementById("cloud3D");

    // Hide both elements by default
    if (sun3DElement) sun3DElement.style.display = "none";
    if (cloud3DElement) cloud3DElement.style.display = "none";

    // si inclou "clear"
    if (description.toLowerCase().includes("clear")) {
        if (sun3DElement) sun3DElement.style.display = "block";
        return "Avui el cel estarà cerè.";
    }
    // si inclou "cloud"
    else if (description.toLowerCase().includes("cloud")) {
        if (cloud3DElement) cloud3DElement.style.display = "block";
        return "Avui el cel estarà ennuvolat.";
    }
    // si inclou "rain"
    else if (description.toLowerCase().includes("rain")) {
        return "Avui probablement hi haurà precipitació.";
    }
    // Otherwise
    else {
        return description;
    }
}

window.onload = getWeather;

document.addEventListener('DOMContentLoaded', function() {
    const blindSlider = document.getElementById('blindSlider');
    const sliderValueBlind = document.getElementById('sliderValueBlind');
    const blindCover = document.getElementById('blindCover');

    // Update the cover height and slider value
    blindSlider.addEventListener('input', function() {
        const value = 100 - this.value; // Reverse the value for correct direction
        sliderValueBlind.innerHTML = `Obertura: ${ 100 - value}%`;
        
        // Adjust height of the blind cover
        blindCover.style.height = `${100 - value}%`;

        // Optionally send the update to the server
        updateBlindOpenness(this.value);
    });

    // Function to update server-side blind openness
    function updateBlindOpenness(value) {
        fetch('http://localhost:30010/remote/preset/LightsBedroom/function/Curtain', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Parameters": {
                    "Open": Number(value) / 100 
                },
                "GenerateTransaction": true 
            })
            
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error updating blind openness:', response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error('Error communicating with server:', error);
        });
    }
});





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

        isButtonOnwifi = !isButtonOnwifi;  // Toggle the state
        console.log('WifiButton state:', isButtonOnwifi);
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



//grafic humitat
document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('humidityChart').getContext('2d');
    var humidityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humitat',
                data: [],
                backgroundColor: 'rgba(7, 166, 250, 1)', // Light background for the area under the line
                borderColor: 'rgba(7, 166, 250, 1)', // Changed to yellow for better visibility
                borderWidth: 4,
                pointBackgroundColor: 'rgba(7, 166, 250, 1)', // Point color
                pointBorderColor: 'rgba(7, 166, 250, 1)', // Point border color
                pointRadius: 3 // Increased point size
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hora'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Humitat (%)'
                    },
                    beginAtZero: true,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    let lastHumidity = 55; // Starting humidity

    function addData() {
        var now = new Date();
        var timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0');

        // Generate a more realistic humidity value
        var baseHumidity = 55 + Math.sin(now.getHours() / 24 * Math.PI * 2) * 15;
        var randomVariation = Math.random() * 2 - 1; // Smaller variation
        var newHumidity = Math.max(30, Math.min(80, lastHumidity + randomVariation));
        
        // Gradually move towards the base humidity
        newHumidity = newHumidity + (baseHumidity - newHumidity) * 0.1;
        
        newHumidity = Math.round(newHumidity); // Round to one decimal place
        lastHumidity = newHumidity;

        humidityChart.data.labels.push(timeString);
        humidityChart.data.datasets[0].data.push(newHumidity);

        // Keep only the last 12 data points
        if (humidityChart.data.labels.length > 12) {
            humidityChart.data.labels.shift();
            humidityChart.data.datasets[0].data.shift();
        }

        humidityChart.update();
        document.getElementById("humiditydisplay").querySelector("div").innerHTML = newHumidity.toFixed() + "%";
    }

    // Update every 5 seconds
    setInterval(addData, 5000);

    // Initial data point
    addData();
});

// Assuming this is within your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {

    // Button for activating/deactivating the dehumidifier
    const dehumidifierButton = document.getElementById('dehumidifierButton'); // Adjust selector if necessary

    if (dehumidifierButton) {
        dehumidifierButton.addEventListener('click', function() {
            if (dehumidifierButton.textContent === 'Activar deshumidificador') {
                dehumidifierButton.textContent = 'Desactivar deshumidificador';
                dehumidifierButton.style.backgroundColor = '#444'; // Change to red
            } else {
                dehumidifierButton.textContent = 'Activar deshumidificador';
                dehumidifierButton.style.backgroundColor = 'red'; // Change back to original color
            }
        });
    }
});





// Add functionality to sliders and improve styling
document.addEventListener('DOMContentLoaded', function() {
    // Bath temperature slider
    const bathTempSlider = document.querySelector('#bathpanel input[type="range"]');
    const bathTempDisplay = document.getElementById('bathTemp');
    
    bathTempSlider.addEventListener('input', function() {
        bathTempDisplay.textContent = this.value + '°C';
    });

    // Shower temperature slider
    const showerTempSlider = document.querySelector('#showerpanel input[type="range"]:first-of-type');
    const showerTempDisplay = document.getElementById('showerTemp');
    
    showerTempSlider.addEventListener('input', function() {
        showerTempDisplay.textContent = this.value + '°C';
    });

    // Shower pressure slider
    const showerPressureSlider = document.getElementById('showerPressureSlider');
    const showerPressureDisplay = document.getElementById('showerPressure');
    
    showerPressureSlider.addEventListener('input', function() {
        const pressureValue = parseInt(this.value);
        let displayValue;
        switch(pressureValue) {
            case 1: displayValue = 'Molt suau'; break;
            case 2: displayValue = 'Suau'; break;
            case 3: displayValue = 'Normal'; break;
            case 4: displayValue = 'Forta'; break;
            case 5: displayValue = 'Molt forta'; break;
            default: displayValue = 'Normal';
        }
        showerPressureDisplay.textContent = displayValue;
    });

    // Trigger the input event initially to set the correct value
    showerPressureSlider.dispatchEvent(new Event('input'));

    // Styling improvements
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.style.webkitAppearance = 'none';
        slider.style.appearance = 'none';
        slider.style.height = '10px';
        slider.style.background = '#d3d3d3';
        slider.style.outline = 'none';
        slider.style.opacity = '0.7';
        slider.style.transition = 'opacity .2s';
        slider.style.borderRadius = '5px';
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.transition = 'background-color 0.3s, transform 0.1s';
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#555';
        });
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#444';
        });
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

//cuina light
document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonlightcuina');
    const backgroundBlur = document.getElementById('background-blurlightcuina');
    
    if (imgButton && backgroundBlur) {
        imgButton.addEventListener('click', toggleButton);

        function toggleButton() {
            // Toggle the background blur immediately
            backgroundBlur.style.display = backgroundBlur.style.display === 'none' ? '' : 'none';
            console.log('Kitchen light Button state:', backgroundBlur.style.display !== 'none');

            // Then attempt to communicate with the server
            fetch('http://localhost:30010/remote/preset/LightKitchen/function/Toggle', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Parameters: {},
                    GenerateTransaction: true
                })
            })
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
            .then(() => {
                console.log('Server updated successfully');
            })
            .catch(error => {
                console.error('Error communicating with server:', error);
            });
        }
    } else {
        console.warn('Kitchen light button or background blur element not found');
    }
});

//living room light
document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonlightlivingroom');
    const backgroundBlur = document.getElementById('background-blurlightlivingroom');
    
    if (imgButton && backgroundBlur) {
        imgButton.addEventListener('click', toggleButton);

        function toggleButton() {
            // Toggle the background blur immediately
            backgroundBlur.style.display = backgroundBlur.style.display === 'none' ? '' : 'none';
            console.log('Living room light Button state:', backgroundBlur.style.display !== 'none');

            // Then attempt to communicate with the server
            fetch('http://localhost:30010/remote/preset/LightLivingroom/function/Toggle', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Parameters: {},
                    GenerateTransaction: true
                })
            })
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
            .then(() => {
                console.log('Server updated successfully');
            })
            .catch(error => {
                console.error('Error communicating with server:', error);
            });
        }
    } else {
        console.warn('Living room light button or background blur element not found');
    }
});

//bedroom room light
document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonlightbedroom');
    const backgroundBlur = document.getElementById('background-blurlightbedroom');
    
    if (imgButton && backgroundBlur) {
        imgButton.addEventListener('click', toggleButton);

        function toggleButton() {
            // Toggle the background blur immediately
            backgroundBlur.style.display = backgroundBlur.style.display === 'none' ? '' : 'none';
            console.log('Bedroom light Button state:', backgroundBlur.style.display !== 'none');

            // Then attempt to communicate with the server
            fetch('http://localhost:30010/remote/preset/LightsBedroom/function/Toggle', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Parameters: {},
                    GenerateTransaction: true
                })
            })
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
            .then(() => {
                console.log('Server updated successfully');
            })
            .catch(error => {
                console.error('Error communicating with server:', error);
            });
        }
    } else {
        console.warn('Bedroom light button or background blur element not found');
    }
});

//bathroom room light
document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonlightbathroom');
    const backgroundBlur = document.getElementById('background-blurlightbathroom');
    
    if (imgButton && backgroundBlur) {
        imgButton.addEventListener('click', toggleButton);

        function toggleButton() {
            // Toggle the background blur immediately
            backgroundBlur.style.display = backgroundBlur.style.display === 'none' ? '' : 'none';
            console.log('Bathroom light Button state:', backgroundBlur.style.display !== 'none');

            // Then attempt to communicate with the server
            fetch('http://localhost:30010/remote/preset/LightBathroom/function/Toggle', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Parameters: {},
                    GenerateTransaction: true
                })
            })
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
            .then(() => {
                console.log('Server updated successfully');
            })
            .catch(error => {
                console.error('Error communicating with server:', error);
            });
        }
    } else {
        console.warn('Bathroom light button or background blur element not found');
    }
});


//bathrooom bath fill/empty


document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('bathbutton');
    const imgButton1 = document.getElementById('bathbutton1'); 

    if (imgButton) {
        imgButton.addEventListener('click', toggleButton);
    } else {
        console.warn('Bathroom light button not found');
    }

    if (imgButton1) {
        imgButton1.addEventListener('click', toggleButton); 
    } else {
        console.warn('Bathroom light button 1 not found');
    }

    function toggleButton() {
        console.log('Bathroom bath Button clicked');

        // Attempt to communicate with the server
        fetch('http://localhost:30010/remote/preset/LightBathroom/function/Water', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Parameters: {},
                GenerateTransaction: true
            })
        })
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
        .then(() => {
            console.log('Server updated successfully');
        })
        .catch(error => {
            console.error('Error communicating with server:', error);
        });
    }
});


// Living Room Light Slider
document.addEventListener("DOMContentLoaded", function() {
    const lightSliderLivingRoom = document.getElementById("lightSliderLivingroom");
    if (lightSliderLivingRoom) {
        lightSliderLivingRoom.addEventListener("input", function() {
            updateLightIntensity("Livingroom", this.value);
        });
    }
});



// Bedroom Light Slider
document.addEventListener("DOMContentLoaded", function() {
    const lightSliderBedroom = document.getElementById("lightSliderBedroom");
    if (lightSliderBedroom) {
        lightSliderBedroom.addEventListener("input", function() {
            updateLightIntensity("Bedroom", this.value);
        });
    }
});

// Kitchen Light Slider
document.addEventListener("DOMContentLoaded", function() {
    const lightSliderKitchen = document.getElementById("lightSliderKitchen");
    if (lightSliderKitchen) {
        lightSliderKitchen.addEventListener("input", function() {
            updateLightIntensity("Kitchen", this.value);
        });
    }
});

// Bathroom Light Slider
document.addEventListener("DOMContentLoaded", function() {
    const lightSliderBathroom = document.getElementById("lightSliderBathroom");
    if (lightSliderBathroom) {
        lightSliderBathroom.addEventListener("input", function() {
            updateLightIntensity("Bathroom", this.value);
        });
    }
});

function updateLightIntensity(room, value) {
    const sliderValueElement = document.getElementById(`sliderValue${room}`);
    if (sliderValueElement) {
        sliderValueElement.innerHTML = `Intensitat: ${value}%`;
    }
    
    console.log(`${room} light intensity: ${value}`);

    let url, data;

    switch(room) {
        case "LivingRoom":
            url = 'http://localhost:30010/remote/preset/LightLivingoom/function/Intensity';
            data = {
                Parameters: {
                    Intensity: Number(value)
                },
                GenerateTransaction: true
            };
            break;
        case "Bedroom":
            url = 'http://localhost:30010/remote/preset/LightsBedroom/function/Intensity';
            data = {
                Parameters: {
                    Intensity: Number(value)
                },
                GenerateTransaction: true
            };
            break;
        case "Kitchen":
            url = 'http://localhost:30010/remote/preset/LightKitchen/function/Intensity';
            data = {
                Parameters: {
                    Intensity: Number(value)
                },
                GenerateTransaction: true
            };
            break;
        case "Bathroom":
            url = 'http://localhost:30010/remote/preset/LightBathroom/function/Intensity';
            data = {
                Parameters: {
                    Intensity: Number(value)
                },
                GenerateTransaction: true
            };
            break;
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(error => console.error(`Error updating ${room} light:`, error));
}



// Initialize the color picker
const colorPickerKitchen = new iro.ColorPicker("#pickerKitchen", {
    width: 200,
    color: "#f00" // Default color
});

//kitchen color picker
colorPickerKitchen.on('color:change', function(color) {
    var hex = color.rgbString.replace(/\s+/g, ''); // Get the hex value directly without spaces
    console.log(hex); // Log the hex value

    // Ensure the fetch requests are successful
    fetch('http://localhost:30010/remote/preset/LightKitchen/function/RGBKitchen', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Parameters: {
                RGBKitchen: hex
            },
            GenerateTransaction: true
        })
    }).then(response => {
        if (!response.ok) {
            console.error('Error updating color:', response.status, response.statusText);
        }
    });
});


const colorPickerBathroom = new iro.ColorPicker("#pickerBathroom", {
    width: 200,
    color: "#f00" // Default color
});

const colorPickerLivingroom = new iro.ColorPicker("#pickerLivingroom", {
    width: 200,
    color: "#f00" // Default color
});

const colorPickerBedroom = new iro.ColorPicker("#pickerBedroom", {
    width: 200,
    color: "#f00" // Default color
});

colorPickerBathroom.on('color:change', function(color) {
    var hex = color.rgbString.replace(/\s+/g, ''); // Get the hex value directly without spaces
    console.log(`Bathroom Light - Hex: ${hex}`); // Log the hex value

    fetch('http://localhost:30010/remote/preset/LightBathroom/function/RGBBathroom', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Parameters: {
                RGBBathroom: hex
            },
            GenerateTransaction: true
        })
    }).then(response => {
        if (!response.ok) {
            console.error('Error updating Bathroom color:', response.status, response.statusText);
        }
    });
});

// Living room color picker
colorPickerLivingroom.on('color:change', function(color) {
    var hex = color.rgbString.replace(/\s+/g, ''); // Get the hex value directly without spaces
    console.log(`Living Room Light - Hex: ${hex}`); // Log the hex value

    fetch('http://localhost:30010/remote/preset/LightLivingroom/function/RGBLivingroom', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Parameters: {
                RGBLiving: hex
            },
            GenerateTransaction: true
        })
    }).then(response => {
        if (!response.ok) {
            console.error('Error updating Living Room color:', response.status, response.statusText);
        }
    });
});

//bedroom color picker
colorPickerBedroom.on('color:change', function(color) {
    var hex = color.rgbString.replace(/\s+/g, ''); // Get the hex value directly without spaces
    console.log(hex); // Log the hex value

        // Change the border color of the player element
        const playerElement = document.querySelector('.player'); // Adjust the selector if necessary
        if (playerElement) {
        playerElement.style.borderColor = hex; // Set the border color to the selected color
    }

    // Ensure the fetch requests are successful
    fetch('http://localhost:30010/remote/preset/LightsBedroom/function/RGBBedroom', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Parameters: {
                RGBBedroom: hex
            },
            GenerateTransaction: true
        })
    }).then(response => {
        if (!response.ok) {
            console.error('Error updating color:', response.status, response.statusText);
        }
    });
});

//shower on/off
document.addEventListener("DOMContentLoaded", function() {
    const bathButton = document.getElementById('botodutxa'); // Get the bath button element
    const bathButton1 = document.getElementById('botodutxa1'); // Get the second bath button element
    
    if (bathButton) {
        bathButton.addEventListener('click', toggleButton); // Add event listener for bath button
    } else {
        console.warn('Bath button not found');
    }

    if (bathButton1) {
        bathButton1.addEventListener('click', toggleButton); // Add event listener for the second bath button
    } else {
        console.warn('Bath button 1 not found');
    }

    function toggleButton() {
        console.log('Bathroom bath Button clicked');

        // Attempt to communicate with the server
        fetch('http://localhost:30010/remote/preset/LightBathroom/function/Wateronoff', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Parameters: {},
                GenerateTransaction: true
            })
        })
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
        .then(() => {
            console.log('Server updated successfully');
        })
        .catch(error => {
            console.error('Error communicating with server:', error);
        });
    }
});