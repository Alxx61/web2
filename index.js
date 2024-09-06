

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
    var colorPicker = new iro.ColorPicker("#picker", {
        // estableix la mida del selector de color
        width: 220,
        // estableix el color inicial a vermell pur
        color: "#c29c74"
    });

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



//light button 
document.addEventListener("DOMContentLoaded", function() {
    const imgButton = document.getElementById('buttonlight');
    const backgroundBlur = document.querySelector('.background-blurlight');
    
    imgButton.addEventListener('click', toggleButton);

    function toggleButton() {
        fetch('http://localhost:30010/remote/preset/Lightbool/function/Toggle', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Parameters: {},
                GenerateTransaction: true
            })
        })
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
        .then(() => {
            backgroundBlur.style.display = backgroundBlur.style.display === 'none' ? '' : 'none';
            console.log('Living room light Button state:', backgroundBlur.style.display !== 'none');
        })
        .catch(error => console.error('Error:', error));
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





    //blind test
    document.addEventListener('DOMContentLoaded', (event) => {
        const slider = document.getElementById('custom-slider');
        const blind = document.getElementById('blind');
        const image = document.getElementById('blindimage');
        
        function updateBlind() {
            const imageHeight = image.clientHeight;
            const blindHeight = (slider.value / 100) * imageHeight;
            const blindTop = image.offsetTop + imageHeight - blindHeight;
            blind.style.height = `${blindHeight}px`;
            blind.style.top = `${blindTop}px`;
            console.log(`Image Height: ${imageHeight}, Blind Height: ${blindHeight}, Blind Top: ${blindTop}`); // Debugging line
        }

        // Initial update after image is loaded
        image.addEventListener('load', updateBlind);

        // Update on slider input
        slider.addEventListener('input', updateBlind);
    });


//grafic humitat
document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('humidityChart').getContext('2d');
    var humidityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity',
                data: [],
                backgroundColor: 'rgba(0, 0, 0, 1)',
                borderColor: 'rgba(0, 255, 0, 0.68)',
                color: "white",
                borderWidth: 4
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