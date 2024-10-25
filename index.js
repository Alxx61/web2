

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

// Constants
const WEATHER_API = {
    BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    KEY: 'API KEY' // Replace with your API key
};

class WeatherApp {
    constructor(city = 'Puigcerda,ES') {
        this.city = city;
        this.init();
    }

    init() {
        this.weatherNumber = document.getElementById("weathernumber");
        this.weatherText = document.getElementById("weathertext");
        this.sun3D = document.getElementById("sun3D");
        this.cloud3D = document.getElementById("cloud3D");
        
        if (!this.weatherNumber || !this.weatherText) {
            console.error('Required DOM elements not found');
            return;
        }

        this.getWeather();
    }

    async getWeather() {
        try {
            const url = `${WEATHER_API.BASE_URL}?q=${encodeURIComponent(this.city)}&appid=${WEATHER_API.KEY}&units=metric`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.updateWeatherDisplay(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.handleError();
        }
    }

    updateWeatherDisplay(data) {
        // Update temperature (already in Celsius due to units=metric parameter)
        const temperature = Math.round(data.main.temp);
        this.weatherNumber.innerHTML = `${temperature}°C`;

        // Update weather description
        const description = data.weather[0].description;
        this.weatherText.innerHTML = this.generateWeatherText(description);
    }

    generateWeatherText(description) {
        // Hide both 3D elements initially
        this.hideAllWeatherIcons();

        const lowerDescription = description.toLowerCase();
        
        if (lowerDescription.includes("clear")) {
            if (this.sun3D) this.sun3D.style.display = "block";
            return "Avui el cel estarà serè.";
        }
        if (lowerDescription.includes("cloud")) {
            if (this.cloud3D) this.cloud3D.style.display = "block";
            return "Avui el cel estarà ennuvolat.";
        }
        if (lowerDescription.includes("rain")) {
            return "Avui probablement hi haurà precipitació.";
        }
        return description;
    }

    hideAllWeatherIcons() {
        if (this.sun3D) this.sun3D.style.display = "none";
        if (this.cloud3D) this.cloud3D.style.display = "none";
    }

    handleError() {
        if (this.weatherNumber) this.weatherNumber.innerHTML = 'N/A';
        if (this.weatherText) this.weatherText.innerHTML = 'No s\'han pogut obtenir les dades meteorològiques.';
        this.hideAllWeatherIcons();
    }
}

// Initialize the app when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

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


document.addEventListener('DOMContentLoaded', function () {
    const sleepSlider = document.getElementById('sleepSlider');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    const sleepRangeDisplay = document.getElementById('sleepRange');

    const ctx = sleepSlider.getContext('2d');
    const centerX = sleepSlider.width / 2;
    const centerY = sleepSlider.height / 2;
    const radius = 100;

    let startAngle = 0; // Initial start angle (12 AM)
    let endAngle = Math.PI; // Initial end angle (12 PM)
    const totalHours = 24;

    let dragging = null; // 'start' or 'end'

    function drawSlider() {
        ctx.clearRect(0, 0, sleepSlider.width, sleepSlider.height);

        // Draw hour markers
        for (let hour = 0; hour < totalHours; hour++) {
            const angle = (hour / totalHours) * 2 * Math.PI - Math.PI / 2;
            const xInner = centerX + Math.cos(angle) * (radius - 10);
            const yInner = centerY + Math.sin(angle) * (radius - 10);
            const xOuter = centerX + Math.cos(angle) * radius;
            const yOuter = centerY + Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.moveTo(xInner, yInner);
            ctx.lineTo(xOuter, yOuter);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label every 3 hours
            if (hour % 3 === 0) {
                const xText = centerX + Math.cos(angle) * (radius - 25);
                const yText = centerY + Math.sin(angle) * (radius - 25);
                ctx.font = '12px Karla';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                let label = '';
                if (hour === 0) label = '12 AM';
                else if (hour < 12) label = `${hour} AM`;
                else if (hour === 12) label = '12 PM';
                else label = `${hour - 12} PM`;
                ctx.fillText(label, xText, yText);
            }
        }

        // Draw Sleep Arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, true);
        ctx.strokeStyle = '#6a0dad'; // Purple color for Sleep time
        ctx.lineWidth = 10;
        ctx.stroke();

        // Draw Start Handle
        const startX = centerX + Math.cos(startAngle) * radius;
        const startY = centerY + Math.sin(startAngle) * radius;
        ctx.beginPath();
        ctx.arc(startX, startY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#6a0dad';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Draw End Handle
        const endX = centerX + Math.cos(endAngle) * radius;
        const endY = centerY + Math.sin(endAngle) * radius;
        ctx.beginPath();
        ctx.arc(endX, endY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#6a0dad';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Update Sleep Range Display
        const startTime = angleToTime(startAngle);
        const endTime = angleToTime(endAngle);
        sleepRangeDisplay.textContent = `Sleep Time: ${startTime} - ${endTime}`;

        // Update icons
        moonIcon.classList.toggle('active', true);
        sunIcon.classList.toggle('active', false);
    }

    function angleToTime(angle) {
        let hours = Math.round((angle + Math.PI / 2) / (Math.PI * 2) * 24) % 24;
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        return `${hours}:00 ${period}`;
    }

    function getAngle(x, y) {
        const dx = x - centerX;
        const dy = y - centerY;
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += Math.PI * 2;
        return angle;
    }

    function handleMouseDown(e) {
        const rect = sleepSlider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clickAngle = getAngle(x, y);

        const distStart = Math.abs(clickAngle - startAngle);
        const distEnd = Math.abs(clickAngle - endAngle);

        if (distStart < distEnd) {
            dragging = 'start';
        } else {
            dragging = 'end';
        }
    }

    function handleMouseMove(e) {
        if (!dragging) return;

        const rect = sleepSlider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        let angle = getAngle(x, y);

        if (dragging === 'start') {
            startAngle = angle;
        } else if (dragging === 'end') {
            endAngle = angle;
        }

        drawSlider();
    }

    function handleMouseUp() {
        dragging = null;
    }

    // Initialize the slider
    drawSlider();

    // Event listeners for interaction
    sleepSlider.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Prevent text selection while dragging
    sleepSlider.addEventListener('dragstart', function(e) { e.preventDefault(); });

    // Touch support
    sleepSlider.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        handleMouseDown(touch);
    }, { passive: false });

    sleepSlider.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        handleMouseMove(touch);
        e.preventDefault();
    }, { passive: false });

    sleepSlider.addEventListener('touchend', handleMouseUp);
});




// Automation Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const addRuleBtn = document.getElementById('addRuleBtn');
    const modal = document.getElementById('newRuleModal');
    const saveRuleBtn = document.getElementById('saveRule');
    const cancelRuleBtn = document.getElementById('cancelRule');
    const triggerType = document.getElementById('triggerType');
    const actionType = document.getElementById('actionType');
    const rulesList = document.getElementById('rulesList');

    // Show modal when clicking Add Rule button
    addRuleBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        updateTriggerOptions();
        updateActionOptions();
    });

    // Hide modal when clicking Cancel
    cancelRuleBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle trigger type changes
    triggerType.addEventListener('change', updateTriggerOptions);
    actionType.addEventListener('change', updateActionOptions);

    function updateTriggerOptions() {
        const triggerOptions = document.getElementById('triggerOptions');
        const selectedTrigger = triggerType.value;
        
        let optionsHTML = '';
        
        switch(selectedTrigger) {
            case 'time':
                optionsHTML = `
                    <input type="time" id="triggerTime" class="rule-input">
                    <div class="day-selector">
                        <label><input type="checkbox" value="mon"> Dilluns</label>
                        <label><input type="checkbox" value="tue"> Dimarts</label>
                        <label><input type="checkbox" value="wed"> Dimecres</label>
                        <label><input type="checkbox" value="thu"> Dijous</label>
                        <label><input type="checkbox" value="fri"> Divendres</label>
                        <label><input type="checkbox" value="sat"> Dissabte</label>
                        <label><input type="checkbox" value="sun"> Diumenge</label>
                    </div>
                `;
                break;
            case 'temperature':
                optionsHTML = `
                    <div class="condition-input">
                        <select id="tempCondition" class="rule-select">
                            <option value="above">Per sobre de</option>
                            <option value="below">Per sota de</option>
                        </select>
                        <input type="number" id="tempValue" class="rule-input" min="0" max="40" step="0.5">
                        <span>°C</span>
                    </div>
                `;
                break;
            case 'motion':
                optionsHTML = `
                    <select id="motionLocation" class="rule-select">
                        <option value="living">Sala d'estar</option>
                        <option value="kitchen">Cuina</option>
                        <option value="bedroom">Habitació</option>
                        <option value="bathroom">Bany</option>
                    </select>
                    <select id="motionCondition" class="rule-select">
                        <option value="detected">Detectat moviment</option>
                        <option value="notDetected">No detectat moviment per</option>
                    </select>
                    <input type="number" id="motionDuration" class="rule-input" min="1" max="60">
                    <span>minuts</span>
                `;
                break;
            case 'light':
                optionsHTML = `
                    <div class="condition-input">
                        <select id="lightCondition" class="rule-select">
                            <option value="above">Per sobre de</option>
                            <option value="below">Per sota de</option>
                        </select>
                        <input type="number" id="lightValue" class="rule-input" min="0" max="100" step="1">
                        <span>%</span>
                    </div>
                `;
                break;
        }
        
        triggerOptions.innerHTML = optionsHTML;
    }

    function updateActionOptions() {
        const actionOptions = document.getElementById('actionOptions');
        const selectedAction = actionType.value;
        
        let optionsHTML = '';
        
        switch(selectedAction) {
            case 'lights':
                optionsHTML = `
                    <select id="lightRoom" class="rule-select">
                        <option value="living">Sala d'estar</option>
                        <option value="kitchen">Cuina</option>
                        <option value="bedroom">Habitació</option>
                        <option value="bathroom">Bany</option>
                    </select>
                    <select id="lightAction" class="rule-select">
                        <option value="on">Encendre</option>
                        <option value="off">Apagar</option>
                        <option value="dim">Ajustar intensitat</option>
                    </select>
                    <div id="dimmerControl" style="display: none;">
                        <input type="range" min="0" max="100" value="50" class="rule-slider">
                        <span>50%</span>
                    </div>
                `;
                break;
            case 'blinds':
                optionsHTML = `
                    <select id="blindRoom" class="rule-select">
                        <option value="living">Sala d'estar</option>
                        <option value="bedroom">Habitació</option>
                    </select>
                    <select id="blindAction" class="rule-select">
                        <option value="open">Obrir</option>
                        <option value="close">Tancar</option>
                        <option value="partial">Ajustar</option>
                    </select>
                    <div id="blindControl" style="display: none;">
                        <input type="range" min="0" max="100" value="50" class="rule-slider">
                        <span>50%</span>
                    </div>
                `;
                break;
            case 'thermostat':
                optionsHTML = `
                    <select id="thermostatMode" class="rule-select">
                        <option value="heat">Calefacció</option>
                        <option value="cool">Refrigeració</option>
                        <option value="auto">Automàtic</option>
                    </select>
                    <input type="number" id="thermostatTemp" class="rule-input" min="15" max="30" step="0.5">
                    <span>°C</span>
                `;
                break;
            case 'appliance':
                optionsHTML = `
                    <select id="applianceType" class="rule-select">
                        <option value="coffee">Cafetera</option>
                        <option value="dishwasher">Rentavaixelles</option>
                        <option value="washer">Rentadora</option>
                        <option value="robot">Robot aspirador</option>
                    </select>
                    <select id="applianceAction" class="rule-select">
                        <option value="start">Iniciar</option>
                        <option value="stop">Aturar</option>
                    </select>
                `;
                break;
        }
        
        actionOptions.innerHTML = optionsHTML;
        
        // Add event listeners for special controls
        if (selectedAction === 'lights') {
            const lightAction = document.getElementById('lightAction');
            const dimmerControl = document.getElementById('dimmerControl');
            lightAction.addEventListener('change', () => {
                dimmerControl.style.display = lightAction.value === 'dim' ? 'block' : 'none';
            });
        }
        
        if (selectedAction === 'blinds') {
            const blindAction = document.getElementById('blindAction');
            const blindControl = document.getElementById('blindControl');
            blindAction.addEventListener('change', () => {
                blindControl.style.display = blindAction.value === 'partial' ? 'block' : 'none';
            });
        }
    }

    // Save rule
    saveRuleBtn.addEventListener('click', () => {
        const rule = createRuleFromInputs();
        addRuleToList(rule);
        modal.style.display = 'none';
    });

    function createRuleFromInputs() {
        // Create rule object based on form inputs
        // This is a simplified version - you'll want to add more validation and data collection
        return {
            id: Date.now(),
            trigger: {
                type: triggerType.value,
                // Add more trigger details based on type
            },
            action: {
                type: actionType.value,
                // Add more action details based on type
            }
        };
    }

    function addRuleToList(rule) {
        const ruleCard = document.createElement('div');
        ruleCard.className = 'rule-card';
        ruleCard.innerHTML = `
            <div class="rule-header">
                <span class="rule-title">Nova Automatització</span>
                <div class="rule-controls">
                    <button class="rule-control-btn" onclick="editRule(${rule.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="rule-control-btn" onclick="deleteRule(${rule.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="rule-content">
                <div class="rule-condition">
                    <i class="fas fa-clock"></i> SI: ${formatTrigger(rule.trigger)}
                </div>
                <div class="rule-action">
                    <i class="fas fa-magic"></i> LLAVORS: ${formatAction(rule.action)}
                </div>
            </div>
        `;
        
        rulesList.appendChild(ruleCard);
    }

    function formatTrigger(trigger) {
        // Format trigger description based on type
        return `Condició: ${trigger.type}`;
    }

    function formatAction(action) {
        // Format action description based on type
        return `Acció: ${action.type}`;
    }
});

// Global functions for rule management
window.editRule = function(ruleId) {
    console.log('Editing rule:', ruleId);
    // Implement edit functionality
};

window.deleteRule = function(ruleId) {
    const ruleElement = document.querySelector(`.rule-card[data-id="${ruleId}"]`);
    if (ruleElement && confirm('Estàs segur que vols eliminar aquesta automatització?')) {
        ruleElement.remove();
    }
};

// ... (codi existent) ...

function addRuleToList(rule) {
    const ruleCard = document.createElement('div');
    ruleCard.className = 'rule-card';
    ruleCard.dataset.id = rule.id; // Afegim l'ID com a data attribute
    ruleCard.innerHTML = `
        <div class="rule-header">
            <span class="rule-title">Nova Automatització</span>
            <div class="rule-controls">
                <button class="rule-control-btn edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="rule-control-btn delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="rule-content">
            <div class="rule-condition">
                <i class="fas fa-clock"></i> SI: ${formatTrigger(rule.trigger)}
            </div>
            <div class="rule-action">
                <i class="fas fa-magic"></i> LLAVORS: ${formatAction(rule.action)}
            </div>
        </div>
    `;

    // Afegim els event listeners als botons
    const editBtn = ruleCard.querySelector('.edit-btn');
    const deleteBtn = ruleCard.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => editRule(rule));
    deleteBtn.addEventListener('click', () => deleteRule(rule.id));

    rulesList.appendChild(ruleCard);
}

// Funció per editar una regla
function editRule(rule) {
    // Mostrem el modal
    const modal = document.getElementById('newRuleModal');
    modal.style.display = 'block';

    // Emplenem els camps amb les dades existents
    const triggerType = document.getElementById('triggerType');
    const actionType = document.getElementById('actionType');

    triggerType.value = rule.trigger.type;
    actionType.value = rule.action.type;

    // Actualitzem les opcions
    updateTriggerOptions();
    updateActionOptions();

    // Emplenem els camps específics segons el tipus de trigger i action
    // ... (aquí pots afegir més lògica per emplenar camps específics) ...

    // Modifiquem el comportament del botó de desar
    const saveBtn = document.getElementById('saveRule');
    saveBtn.onclick = () => {
        // Guardem els canvis
        const updatedRule = createRuleFromInputs();
        updatedRule.id = rule.id; // Mantenim el mateix ID

        // Eliminem la targeta antiga
        const oldCard = document.querySelector(`.rule-card[data-id="${rule.id}"]`);
        if (oldCard) {
            oldCard.remove();
        }

        // Afegim la targeta actualitzada
        addRuleToList(updatedRule);

        // Tanquem el modal
        modal.style.display = 'none';

        // Restaurem el comportament original del botó de desar
        saveBtn.onclick = () => {
            const newRule = createRuleFromInputs();
            addRuleToList(newRule);
            modal.style.display = 'none';
        };
    };
}

// Funció per eliminar una regla
function deleteRule(ruleId) {
    const ruleCard = document.querySelector(`.rule-card[data-id="${ruleId}"]`);
    if (ruleCard && confirm('Estàs segur que vols eliminar aquesta automatització?')) {
        // Afegim una animació de desaparició
        ruleCard.style.transition = 'all 0.3s ease';
        ruleCard.style.opacity = '0';
        ruleCard.style.transform = 'scale(0.8)';

        // Eliminem l'element després de l'animació
        setTimeout(() => {
            ruleCard.remove();
        }, 300);
    }
}

// Funció millorada per crear una regla des dels inputs
function createRuleFromInputs() {
    const triggerType = document.getElementById('triggerType');
    const actionType = document.getElementById('actionType');

    const rule = {
        id: Date.now(),
        trigger: {
            type: triggerType.value,
            options: {}
        },
        action: {
            type: actionType.value,
            options: {}
        }
    };

    // Recollim les opcions específiques segons el tipus de trigger
    switch (triggerType.value) {
        case 'time':
            const time = document.getElementById('triggerTime')?.value;
            const days = Array.from(document.querySelectorAll('.day-selector input:checked'))
                .map(input => input.value);
            rule.trigger.options = { time, days };
            break;
        case 'temperature':
            rule.trigger.options = {
                condition: document.getElementById('tempCondition')?.value,
                value: document.getElementById('tempValue')?.value
            };
            break;
        // ... (afegir més casos segons necessitat)
    }

    // Recollim les opcions específiques segons el tipus d'acció
    switch (actionType.value) {
        case 'lights':
            rule.action.options = {
                room: document.getElementById('lightRoom')?.value,
                action: document.getElementById('lightAction')?.value,
                intensity: document.getElementById('dimmerControl')?.querySelector('input')?.value
            };
            break;
        case 'blinds':
            rule.action.options = {
                room: document.getElementById('blindRoom')?.value,
                action: document.getElementById('blindAction')?.value,
                position: document.getElementById('blindControl')?.querySelector('input')?.value
            };
            break;
        // ... (afegir més casos segons necessitat)
    }

    return rule;
}

// Millorem les funcions de formatatge per mostrar més detalls
function formatTrigger(trigger) {
    let description = '';
    switch (trigger.type) {
        case 'time':
            const days = trigger.options?.days?.join(', ') || 'tots els dies';
            description = `a les ${trigger.options?.time || '00:00'} (${days})`;
            break;
        case 'temperature':
            description = `temperatura ${trigger.options?.condition} ${trigger.options?.value}°C`;
            break;
        // ... (afegir més casos)
        default:
            description = trigger.type;
    }
    return description;
}

function formatAction(action) {
    let description = '';
    switch (action.type) {
        case 'lights':
            const intensity = action.options?.intensity ? ` al ${action.options.intensity}%` : '';
            description = `${action.options?.action} llums ${action.options?.room}${intensity}`;
            break;
        case 'blinds':
            const position = action.options?.position ? ` al ${action.options.position}%` : '';
            description = `${action.options?.action} persianes ${action.options?.room}${position}`;
            break;
        // ... (afegir més casos)
        default:
            description = action.type;
    }
    return description;
}