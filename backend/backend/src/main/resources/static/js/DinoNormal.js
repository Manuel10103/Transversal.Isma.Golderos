document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
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

    // Botones para abrir modales
    const depositOpenBtn = document.getElementById("deposit-open");
    const withdrawOpenBtn = document.getElementById("withdraw-open");
    const closeModalBtn = document.getElementById("close-modal");
    const withdrawCloseBtn = document.getElementById("withdraw-close");
    const closeLossModalBtn = document.getElementById("close-loss-modal");

    let running = false;
    let saldo = 0; // Saldo inicial
    let multiplicador = 1.00;
    let historialMultiplicadores = [];
    let moveInterval, multiplicadorInterval;

    // Muestra el saldo y multiplicador en pantalla
    function actualizarUI() {
        saldoText.textContent = `Saldo: $${saldo.toFixed(2)}`;
        multiplicadorText.textContent = `x${multiplicador.toFixed(2)}`;
    }

    // Historial de últimos 5 multiplicadores
    function actualizarHistorial() {
        historialList.innerHTML = "";
        const ultimos = historialMultiplicadores.slice(-5).reverse();
        ultimos.forEach((mult) => {
            const span = document.createElement("span");
            span.textContent = `x${mult.toFixed(2)}`;
            historialList.appendChild(span);
        });
    }

    // Muestra un error temporal
    function mostrarError(mensaje) {
        console.log("ERROR:", mensaje);
        errorText.textContent = mensaje;
        errorModal.style.display = "flex";
        setTimeout(() => {
            errorModal.style.display = "none";
        }, 3000);
    }

    // Inicia la carrera
    function iniciarCarrera() {
        if (running) return;
        console.log("➡️ Iniciando carrera...");

        const betAmount = parseFloat(betAmountInput.value);
        console.log("Monto apostado:", betAmount);
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
        caballo.style.left = "0px";

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
                console.log("⏹️ Carrera detenida aleatoriamente");
                running = false;
                clearInterval(multiplicadorInterval);
                clearInterval(moveInterval);
                historialMultiplicadores.push(multiplicador);
                actualizarHistorial();
                lossModal.style.display = "block";
            }
        }, Math.random() * (10000 - 5000) + 5000);
    }

    // Detiene la carrera
    function detenerCaballo() {
        if (!running) return;
        console.log("⏹️ Parando la carrera manualmente");

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

        // Envía datos a la BBDD
        registrarApuesta(2, betAmount, ganancia, 10);
    }

    // Registra apuesta (ajusta IDs según tu lógica)
    function registrarApuesta(id_usuario, monto, ganancia, tiempo_jugado) {
        const resultado = ganancia > 0 ? "GANADO" : "PERDIDO";
        const id_juego = 2; 
        console.log("Registrando apuesta en back-end...");

        fetch("http://localhost:8080/api/registrarApuesta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario: id_usuario,
                id_juego: id_juego,
                monto: monto,
                resultado: resultado,
                ganancia: ganancia,
                tiempo_jugado: tiempo_jugado
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("✅ Apuesta registrada:", data);
        })
        .catch(error => {
            console.error("❌ Error al registrar apuesta:", error);
        });
    }

    // Abre un modal
    function abrirModal(modal) {
        console.log("➡️ Abriendo modal:", modal.id);
        modal.style.display = "flex";
    }
    
    // Cierra un modal
    function cerrarModal(modal) {
        console.log("⏹️ Cerrando modal:", modal.id);
        modal.style.display = "none";
    }

    // DEPÓSITO
    depositButton.addEventListener("click", () => {
        console.log("➡️ Botón depositar pulsado");
        const depositAmount = parseFloat(depositAmountInput.value);
        console.log("Monto a depositar:", depositAmount);

        if (isNaN(depositAmount) || depositAmount <= 0) {
            mostrarError("Introduce una cantidad válida para depositar.");
            return;
        }
        saldo += depositAmount;
        actualizarUI();
        cerrarModal(depositModal);
    });

    // RETIRO
    withdrawButton.addEventListener("click", () => {
        console.log("➡️ Botón retirar pulsado");
        const withdrawAmount = parseFloat(withdrawInput.value);
        console.log("Monto a retirar:", withdrawAmount);

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

    // BOTONES PARA ABRIR MODALES
    depositOpenBtn.addEventListener("click", () => abrirModal(depositModal));
    withdrawOpenBtn.addEventListener("click", () => abrirModal(withdrawModal));
    closeModalBtn.addEventListener("click", () => cerrarModal(depositModal));
    withdrawCloseBtn.addEventListener("click", () => cerrarModal(withdrawModal));
    if (closeLossModalBtn) {
        closeLossModalBtn.addEventListener("click", () => cerrarModal(lossModal));
    }

    // Cerrar modales si se hace clic fuera
    window.addEventListener("click", (event) => {
        if (event.target === depositModal) cerrarModal(depositModal);
        if (event.target === withdrawModal) cerrarModal(withdrawModal);
        if (event.target === lossModal) cerrarModal(lossModal);
        if (event.target === errorModal) cerrarModal(errorModal);
    });

    // Botones de iniciar/parar carrera
    startRaceButton.addEventListener("click", iniciarCarrera);
    stopRaceButton.addEventListener("click", detenerCaballo);

    // Muestra saldo inicial
    actualizarUI();
});
