document.addEventListener("DOMContentLoaded", () => {
    const caballo = document.getElementById("caballo");
    const startRaceButton = document.getElementById("start-race");
    const stopRaceButton = document.getElementById("stop-race");
    const betAmountInput = document.getElementById("bet-amount");
    const resultText = document.getElementById("result");
    const multiplicadorText = document.getElementById("multiplicador");
    const saldoText = document.getElementById("saldo");
    const historialList = document.getElementById("historial");
    const depositModal = document.getElementById("deposit-modal");
    const closeModalButton = document.getElementById("close-modal");
    const depositButton = document.getElementById("deposit-button");
    const depositAmountInput = document.getElementById("deposit-amount");
    const withdrawModal = document.getElementById("withdraw-modal");
    const withdrawOpen = document.getElementById("withdraw-open");
    const withdrawClose = document.getElementById("withdraw-close");
    const withdrawInput = document.getElementById("withdraw-amount");
    const withdrawButton = document.getElementById("withdraw-button");
    const lossModal = document.getElementById("loss-modal");
    const closeLossModal = document.getElementById("close-loss-modal");
    const errorModal = document.getElementById("error-modal");
    const errorText = document.getElementById("error-text");
    const closeErrorModal = document.getElementById("close-error-modal");

    let running = false;
    let saldo = 0;
    let multiplicador = 1.00;
    let historialMultiplicadores = [];
    let moveInterval, multiplicadorInterval;
    /** Botones para iniciar y parar al caballo  */
    startRaceButton.addEventListener("click", iniciarCarrera);
    stopRaceButton.addEventListener("click", detenerCaballo);

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
        errorModal.classList.add("mostrar");
    }
    

    function iniciarCarrera() {
        if (running) return;

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

        multiplicadorInterval = setInterval(() => {
            multiplicador += 0.05;
            actualizarUI();
        }, 100);

        let position = 0;
        moveInterval = setInterval(() => {
            if (!running || position >= window.innerWidth - 150) {
                clearInterval(moveInterval);
                return;
            }
            position += 5;
            caballo.style.left = position + "px";
        }, 50);

        setTimeout(() => {
            if (running) {
                running = false;
                clearInterval(multiplicadorInterval);
                clearInterval(moveInterval);
                caballo.style.left = "0px";
                historialMultiplicadores.push(multiplicador);
                actualizarHistorial();
                lossModal.style.display = "block";
            }
        }, Math.random() * (10000 - 5000) + 5000);
    }

    function detenerCaballo() {
        if (!running) return;

        running = false;
        clearInterval(multiplicadorInterval);
        clearInterval(moveInterval);

        const betAmount = parseFloat(betAmountInput.value);
        saldo += betAmount * multiplicador;

        resultText.textContent = `¡Ganaste! Has ganado $${(betAmount * multiplicador).toFixed(2)}`;
        resultText.style.color = "green";

        historialMultiplicadores.push(multiplicador);
        actualizarHistorial();
        actualizarUI();
        caballo.style.left = "0px"; // Reinicia la posición del caballo
    }

    function abrirModal(modal) {
        modal.style.display = "block";
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
    closeModalButton.addEventListener("click", () => cerrarModal(depositModal));
    withdrawClose.addEventListener("click", () => cerrarModal(withdrawModal));
    closeLossModal.addEventListener("click", () => cerrarModal(lossModal));
    closeErrorModal.addEventListener("click", () => cerrarModal(errorModal));

    // CERRAR MODALES AL HACER CLIC FUERA
    window.addEventListener("click", (event) => {
        if (event.target === depositModal) cerrarModal(depositModal);
        if (event.target === withdrawModal) cerrarModal(withdrawModal);
        if (event.target === lossModal) cerrarModal(lossModal);
        if (event.target === errorModal) cerrarModal(errorModal);
    });

    
    saldoText.addEventListener("click", () => abrirModal(depositModal));

    actualizarUI();
});
