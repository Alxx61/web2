document.addEventListener('DOMContentLoaded', function() {
    // Chart.js global configuration
    Chart.defaults.color = '#ffffff';
    Chart.defaults.borderColor = '#666666';
    
    // Initialize charts
    initializeCharts();
    
    // Start real-time updates
    updateCurrentUsage();
    setInterval(updateCurrentUsage, 5000);
    
    // Update daily and monthly stats
    updateStats();
    setInterval(updateStats, 60000);
});

// Chart initialization
function initializeCharts() {
    // Power consumption chart
    const powerCtx = document.getElementById('powerChart').getContext('2d');
    window.powerChart = new Chart(powerCtx, {
        type: 'line',
        data: {
            labels: generateHourLabels(),
            datasets: [{
                label: 'kW',
                data: [],
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: getChartOptions('Consum Elèctric (kW)')
    });

    // Water consumption chart
    const waterCtx = document.getElementById('waterChart').getContext('2d');
    window.waterChart = new Chart(waterCtx, {
        type: 'line',
        data: {
            labels: generateHourLabels(),
            datasets: [{
                label: 'L/h',
                data: [],
                borderColor: '#00CED1',
                backgroundColor: 'rgba(0, 206, 209, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: getChartOptions('Consum d\'Aigua (L/h)')
    });

    // Gas consumption chart
    const gasCtx = document.getElementById('gasChart').getContext('2d');
    window.gasChart = new Chart(gasCtx, {
        type: 'line',
        data: {
            labels: generateHourLabels(),
            datasets: [{
                label: 'm³/h',
                data: [],
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: getChartOptions('Consum de Gas (m³/h)')
    });
}

// Generate realistic random data
function generateRealisticData(type) {
    const hour = new Date().getHours();
    let baseValue = 0;
    let variation = 0;

    switch(type) {
        case 'power':
            // Higher consumption during morning and evening
            if (hour >= 7 && hour <= 9) baseValue = 2.5;
            else if (hour >= 18 && hour <= 22) baseValue = 3;
            else if (hour >= 23 || hour <= 5) baseValue = 0.5;
            else baseValue = 1.5;
            variation = 0.5;
            break;
        case 'water':
            // Peaks during morning and evening (shower times)
            if (hour >= 7 && hour <= 9) baseValue = 15;
            else if (hour >= 19 && hour <= 22) baseValue = 12;
            else if (hour >= 23 || hour <= 5) baseValue = 0;
            else baseValue = 5;
            variation = 3;
            break;
        case 'gas':
            // Higher during meal times and winter evenings
            if (hour >= 7 && hour <= 9) baseValue = 0.8;
            else if (hour >= 12 && hour <= 14) baseValue = 0.6;
            else if (hour >= 19 && hour <= 21) baseValue = 1;
            else if (hour >= 22 || hour <= 5) baseValue = 0.1;
            else baseValue = 0.3;
            variation = 0.2;
            break;
    }

    return Math.max(0, baseValue + (Math.random() - 0.5) * variation);
}

// Update current usage displays
function updateCurrentUsage() {
    // Generate current values
    const currentPower = generateRealisticData('power');
    const currentWater = generateRealisticData('water');
    const currentGas = generateRealisticData('gas');

    // Update displays
    document.getElementById('currentPower').textContent = `${currentPower.toFixed(2)} kW`;
    document.getElementById('currentWater').textContent = `${currentWater.toFixed(1)} L/h`;
    document.getElementById('currentGas').textContent = `${currentGas.toFixed(2)} m³/h`;

    // Update charts
    updateChart(window.powerChart, currentPower);
    updateChart(window.waterChart, currentWater);
    updateChart(window.gasChart, currentGas);
}

// Update charts with new data
function updateChart(chart, value) {
    chart.data.datasets[0].data.push(value);
    if (chart.data.datasets[0].data.length > 24) {
        chart.data.datasets[0].data.shift();
    }
    chart.update('none');
}

// Generate hour labels for charts
function generateHourLabels() {
    const labels = [];
    for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
    }
    return labels;
}

// Chart options
function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
}

// Update daily and monthly statistics
function updateStats() {
    // Generate realistic daily totals
    const powerDaily = (Math.random() * 15 + 10).toFixed(1);
    const waterDaily = (Math.random() * 200 + 150).toFixed(0);
    const gasDaily = (Math.random() * 3 + 2).toFixed(1);

    // Generate realistic monthly totals
    const powerMonthly = (powerDaily * 30 * (0.9 + Math.random() * 0.2)).toFixed(1);
    const waterMonthly = (waterDaily * 30 * (0.9 + Math.random() * 0.2)).toFixed(0);
    const gasMonthly = (gasDaily * 30 * (0.9 + Math.random() * 0.2)).toFixed(1);

    // Update displays
    document.getElementById('powerToday').textContent = `${powerDaily} kWh`;
    document.getElementById('powerMonth').textContent = `${powerMonthly} kWh`;
    document.getElementById('waterToday').textContent = `${waterDaily} L`;
    document.getElementById('waterMonth').textContent = `${waterMonthly} L`;
    document.getElementById('gasToday').textContent = `${gasDaily} m³`;
    document.getElementById('gasMonth').textContent = `${gasMonthly} m³`;

    // Calculate and update costs
    const dailyCost = (
        powerDaily * 0.15 + // Electricity cost per kWh
        waterDaily * 0.002 + // Water cost per L
        gasDaily * 0.8 // Gas cost per m³
    ).toFixed(2);

    const monthlyCost = (
        powerMonthly * 0.15 +
        waterMonthly * 0.002 +
        gasMonthly * 0.8
    ).toFixed(2);

    const monthlyForecast = (monthlyCost * 1.1).toFixed(2); // 10% margin

    document.getElementById('dailyCost').textContent = `${dailyCost} €`;
    document.getElementById('monthlyCost').textContent = `${monthlyCost} €`;
    document.getElementById('monthlyForecast').textContent = `${monthlyForecast} €`;
}