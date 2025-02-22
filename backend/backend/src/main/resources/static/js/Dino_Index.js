document.addEventListener("DOMContentLoaded", () => {
    const caballo = document.getElementById("caballo");
    const startRaceButton = document.getElementById("start-race");
    const stopRaceButton = document.getElementById("stop-race");
    const betAmountInput = document.getElementById("bet-amount");
    const resultText = document.getElementById("result");
    const multiplicadorText = document.getElementById("multiplicador");
    const saldoText = document.getElementById("saldo");
    const historialList = document.getElementById("historial");

    // Modales y botones
    const depositModal = document.getElementById("deposit-modal");
    const withdrawModal = document.getElementById("withdraw-modal");
    const depositButton = document.getElementById("deposit-button");
    const withdrawButton = document.getElementById("withdraw-button");
    const depositAmountInput = document.getElementById("deposit-amount");
    const withdrawInput = document.getElementById("withdraw-amount");
    const errorModal = document.getElementById("error-modal");
    const errorText = document.getElementById("error-text");
    const lossModal = document.getElementById("loss-modal");

    let running = false;
    let saldo = 0; // Saldo inicial de prueba
    let multiplicador = 1.00;
    let historialMultiplicadores = [];
    let moveInterval, multiplicadorInterval;

    function actualizarUI() {
        saldoText.textContent = `Saldo: $${saldo.toFixed(2)}`;
        multiplicadorText.textContent = `x${multiplicador.toFixed(2)}`;
    }

    function actualizarHistorial() {
        historialList.innerHTML = "";
        historialMultiplicadores.slice(-5).reverse().forEach((mult) => {
            const span = document.createElement("span");
            span.textContent = `x${mult.toFixed(2)}`;
            historialList.appendChild(span);
        });
    }

    function mostrarError(mensaje) {
        errorText.textContent = mensaje;
        errorModal.style.display = "flex";
        setTimeout(() => errorModal.style.display = "none", 3000);
    }

    function iniciarCarrera() {
        if (running) return;

        console.log("🚀 Iniciando carrera...");
        const betAmount = parseFloat(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > saldo) {
            mostrarError("Apuesta inválida o saldo insuficiente.");
            return;
        }

        saldo -= betAmount;
        actualizarUI();
        running = true;
        multiplicador = 1.00;
        resultText.textContent = "";
        multiplicadorText.style.visibility = "visible";
        caballo.style.left = "0px"; // Reiniciar posición

        // 🔹 Iniciar el multiplicador
        multiplicadorInterval = setInterval(() => {
            multiplicador += 0.05;
            actualizarUI();
        }, 100);

        // 🔹 Mover el caballo
        let position = 0;
        moveInterval = setInterval(() => {
            console.log(`🏇 Caballo en posición: ${position}`);
            if (!running || position >= window.innerWidth - 150) {
                clearInterval(moveInterval);
                return;
            }
            position += 5;
            caballo.style.left = position + "px";
        }, 50);

        // 🔹 Detener la carrera aleatoriamente entre 5s y 10s
        setTimeout(() => {
            if (running) {
                running = false;
                clearInterval(multiplicadorInterval);
                clearInterval(moveInterval);
                historialMultiplicadores.push(multiplicador);
                actualizarHistorial();
                lossModal.style.display = "block";
                console.log("🏁 Carrera finalizada.");
            }
        }, Math.random() * (10000 - 5000) + 5000);
    }

    function detenerCaballo() {
        if (!running) return;

        running = false;
        clearInterval(multiplicadorInterval);
        clearInterval(moveInterval);

        const betAmount = parseFloat(betAmountInput.value);
        const ganancia = betAmount * multiplicador;
        saldo += ganancia;

        resultText.textContent = `¡Ganaste! Has ganado $${ganancia.toFixed(2)}`;
        resultText.style.color = "green";

        historialMultiplicadores.push(multiplicador);
        actualizarHistorial();
        actualizarUI();
        caballo.style.left = "0px"; 
    }

    function abrirModal(modal) {
        modal.style.display = "flex";
    }
    
    function cerrarModal(modal) {
        modal.style.display = "none";
    }

    depositButton.addEventListener("click", () => {
        const depositAmount = parseFloat(depositAmountInput.value);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            mostrarError("Introduce una cantidad válida para depositar.");
            return;
        }

        saldo += depositAmount;
        actualizarUI();
        cerrarModal(depositModal);
    });

    withdrawButton.addEventListener("click", () => {
        const withdrawAmount = parseFloat(withdrawInput.value);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            mostrarError("Introduce una cantidad válida para retirar.");
            return;
        }

        if (withdrawAmount > saldo) {
            mostrarError("No tienes suficiente saldo para retirar esa cantidad.");
            return;
        }

        saldo -= withdrawAmount;
        actualizarUI();
        cerrarModal(withdrawModal);
    });

    // EVENTOS PARA ABRIR Y CERRAR MODALES
    document.getElementById("deposit-open").addEventListener("click", () => abrirModal(depositModal));
    document.getElementById("withdraw-open").addEventListener("click", () => abrirModal(withdrawModal));
    document.getElementById("close-modal").addEventListener("click", () => cerrarModal(depositModal));
    document.getElementById("withdraw-close").addEventListener("click", () => cerrarModal(withdrawModal));

    // CERRAR MODALES AL HACER CLIC FUERA
    window.addEventListener("click", (event) => {
        if (event.target === depositModal) cerrarModal(depositModal);
        if (event.target === withdrawModal) cerrarModal(withdrawModal);
        if (event.target === lossModal) cerrarModal(lossModal);
        if (event.target === errorModal) cerrarModal(errorModal);
    });

    startRaceButton.addEventListener("click", iniciarCarrera);
    stopRaceButton.addEventListener("click", detenerCaballo);

    actualizarUI();
});
