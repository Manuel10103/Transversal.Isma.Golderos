document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const caballo = document.getElementById("caballo");
    const startRaceButton = document.getElementById("start-race");
    const stopRaceButton = document.getElementById("stop-race");
    const betAmountInput = document.getElementById("bet-amount");
    const resultText = document.getElementById("result");
    const multiplicadorText = document.getElementById("multiplicador");
    const saldoText = document.getElementById("saldo");
    const historialList = document.getElementById("historial");

    // Modales y botones para depósito/retiro
    const depositModal = document.getElementById("deposit-modal");
    const withdrawModal = document.getElementById("withdraw-modal");
    const depositButton = document.getElementById("deposit-button");
    const withdrawButton = document.getElementById("withdraw-button");
    const depositAmountInput = document.getElementById("deposit-amount");
    const withdrawInput = document.getElementById("withdraw-amount");
    const errorModal = document.getElementById("error-modal");
    const errorText = document.getElementById("error-text");
    const lossModal = document.getElementById("loss-modal");

    // Variables de estado
    let running = false;
    let saldo = 0; // Saldo real del usuario (obtenido desde la BD)
    let multiplicador = 1.00;
    let historialMultiplicadores = [];
    let moveInterval, multiplicadorInterval;

    // Actualiza la interfaz con el saldo y el multiplicador
    function actualizarUI() {
        saldoText.textContent = `Saldo: $${saldo.toFixed(2)}`;
        multiplicadorText.textContent = `x${multiplicador.toFixed(2)}`;
    }

    // Actualiza el historial de multiplicadores (últimos 5)
    function actualizarHistorial() {
        historialList.innerHTML = "";
        historialMultiplicadores.slice(-5).reverse().forEach(mult => {
            const span = document.createElement("span");
            span.textContent = `x${mult.toFixed(2)}`;
            historialList.appendChild(span);
        });
    }

    // Muestra un error en pantalla
    function mostrarError(mensaje) {
        errorText.textContent = mensaje;
        errorModal.style.display = "flex";
        setTimeout(() => { errorModal.style.display = "none"; }, 3000);
    }

    // Obtiene el saldo real del servidor 
    function obtenerSaldoServidor() {
        fetch('/usuarios/saldo', { credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error("No autenticado");
                return response.json();
            })
            .then(data => {
                saldo = parseFloat(data.saldo);
                if (isNaN(saldo)) saldo = 0;
                actualizarUI();
            })
            .catch(error => {
                console.error("Error obteniendo el saldo:", error);
            });
    }
    

    // Al cargar la página, sincroniza el saldo
    obtenerSaldoServidor();

    // Inicia la carrera
    function iniciarCarrera() {
        if (running) return;
        const betAmount = parseFloat(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > saldo) {
            mostrarError("Apuesta inválida o saldo insuficiente.");
            return;
        }

        // Descontar la apuesta (localmente, para la jugada)
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
                running = false;
                clearInterval(multiplicadorInterval);
                clearInterval(moveInterval);
                historialMultiplicadores.push(multiplicador);
                actualizarHistorial();
                lossModal.style.display = "block";
                // Para apuesta perdida: se envía el monto apostado y ganancia 0
                registrarJugada("PERDIDO", betAmount, 0);
                obtenerSaldoServidor();
            }
        }, Math.random() * (10000 - 5000) + 5000);
    }

    // Detiene la carrera cuando el usuario decide pararla (apuesta ganada)
    function detenerCaballo() {
        if (!running) return;
        running = false;
        clearInterval(multiplicadorInterval);
        clearInterval(moveInterval);

        const betAmount = parseFloat(betAmountInput.value);
        const ganancia = betAmount * multiplicador;
        resultText.textContent = `¡Ganaste! Has ganado $${ganancia.toFixed(2)}`;
        resultText.style.color = "green";

        historialMultiplicadores.push(multiplicador);
        actualizarHistorial();
        actualizarUI();
        caballo.style.left = "0px";

        // Registrar la jugada como ganada, enviando el monto y la ganancia
        registrarJugada("GANADO", betAmount, ganancia);
        obtenerSaldoServidor();
    }

    // Envía al back-end los datos de la jugada para que se actualice el saldo en la BD
    function registrarJugada(resultado, monto, ganancia) {
     
        fetch('/api/jugada/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // para enviar cookies de sesión
            body: JSON.stringify({
                monto: monto,
                ganancia: ganancia,
                resultado: resultado,
                fecha: new Date().toISOString()
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || err);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Jugada registrada:", data);
        })
        .catch(error => console.error("Error registrando la jugada:", error));
    }
    
    // Funciones para abrir y cerrar modales
    function abrirModal(modal) {
        modal.style.display = "flex";
    }
    function cerrarModal(modal) {
        modal.style.display = "none";
    }

    // Botón de depósito (local)
    depositButton.addEventListener("click", () => {
        const depositAmount = parseFloat(depositAmountInput.value);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            mostrarError("Introduce una cantidad válida para depositar.");
            return;
        }
        saldo += depositAmount;
        actualizarUI();
        cerrarModal(depositModal);
        // (Opcional) Aquí podrías llamar a un endpoint REST para depositar en la BD
    });

    // Botón de retiro (local)
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
        // (Opcional) Aquí podrías llamar a un endpoint REST para retirar en la BD
    });

    // Configura los botones para abrir y cerrar modales
    document.getElementById("deposit-open").addEventListener("click", () => abrirModal(depositModal));
    document.getElementById("withdraw-open").addEventListener("click", () => abrirModal(withdrawModal));
    document.getElementById("close-modal").addEventListener("click", () => cerrarModal(depositModal));
    document.getElementById("withdraw-close").addEventListener("click", () => cerrarModal(withdrawModal));
    document.getElementById("close-loss-modal").addEventListener("click", () => cerrarModal(lossModal));
    
    // Cierra modales si se hace clic fuera
    window.addEventListener("click", (event) => {
        if (event.target === depositModal) cerrarModal(depositModal);
        if (event.target === withdrawModal) cerrarModal(withdrawModal);
        if (event.target === lossModal) cerrarModal(lossModal);
        if (event.target === errorModal) cerrarModal(errorModal);
    });
    
    // Botones para iniciar y detener la carrera
    startRaceButton.addEventListener("click", iniciarCarrera);
    stopRaceButton.addEventListener("click", detenerCaballo);
    
    // Actualiza la UI al inicio
    actualizarUI();
    
    // (Opcional) Actualiza el saldo cada 2 segundos para mantener sincronización continua
    setInterval(obtenerSaldoServidor, 2000);
});
