document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const restartBtn = document.getElementById('restartBtn');
    const resetBtn = document.getElementById('resetBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const statusDot = document.querySelector('.status-dot');

    // Variables d'estat
    let isConnected = true;
    let isRestarting = false;

    // Funció per actualitzar l'estat de connexió
    const updateConnectionStatus = (connected) => {
        isConnected = connected;
        connectionStatus.textContent = connected ? 'Connectat' : 'Desconnectat';
        statusDot.style.backgroundColor = connected ? '#2ecc71' : '#e74c3c';
    };

    // Funció per reiniciar el router
    const restartRouter = async () => {
        if (isRestarting) return;
        
        isRestarting = true;
        restartBtn.disabled = true;
        restartBtn.textContent = 'Reiniciant...';
        
        updateConnectionStatus(false);

        // Simulació del procés de reinici
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        updateConnectionStatus(true);
        restartBtn.disabled = false;
        restartBtn.textContent = 'Reiniciar Router';
        isRestarting = false;
    };

    // Funció per restablir la configuració
    const resetRouter = () => {
        if (confirm('Esteu segur que voleu restablir la configuració del router? Aquesta acció no es pot desfer.')) {
            alert('Iniciant el procés de restabliment. El router es reiniciarà automàticament.');
            restartRouter();
        }
    };

    // Event listeners
    restartBtn.addEventListener('click', restartRouter);
    resetBtn.addEventListener('click', resetRouter);

    // Actualització periòdica de l'estat
    setInterval(() => {
        // Aquí es podria afegir una crida API real per obtenir l'estat del router
        document.getElementById('uptime').textContent = getUptime();
        document.getElementById('speed').textContent = getRandomSpeed();
    }, 5000);

    // Funcions d'utilitat
    function getUptime() {
        const now = new Date();
        const hours = now.getHours();
        const days = Math.floor(Math.random() * 10);
        return `${days} dies, ${hours} hores`;
    }

    function getRandomSpeed() {
        const speed = Math.floor(Math.random() * 500) + 100;
        return `${speed} Mbps`;
    }
});