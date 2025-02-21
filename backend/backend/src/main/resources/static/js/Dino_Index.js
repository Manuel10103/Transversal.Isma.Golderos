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
    const withdrawModal = document.getElementById("withdraw-modal");
    const depositButton = document.getElementById("deposit-button");
    const withdrawButton = document.getElementById("withdraw-button");
    const depositAmountInput = document.getElementById("deposit-amount");
    const withdrawInput = document.getElementById("withdraw-amount");
    const errorModal = document.getElementById("error-modal");
    const errorText = document.getElementById("error-text");
    const closeErrorModal = document.getElementById("close-error-modal");

    let running = false;
    let saldo = 0;
    let multiplicador = 1.00;
    let historialMultiplicadores = [];
    let moveInterval, multiplicadorInterval;
    const idUsuario = 1; 

    // Obtener saldo del usuario al cargar la página
    function obtenerSaldo() {
        $.ajax({
            url: "backend/php/obtener_saldo.php",
            type: "POST",
            success: function(response) {
                let data = JSON.parse(response);
                if (data.status === "success") {
                    saldo = parseFloat(data.saldo);
                    actualizarUI();
                } else {
                    alert("Error al obtener saldo.");
                }
            }
        });
    }

    function actualizarSaldo(nuevoSaldo) {
        $.ajax({
            url: "backend/php/actualizar_saldo.php",
            type: "POST",
            data: { nuevo_saldo: nuevoSaldo },
            success: function(response) {
                console.log(response);
            }
        });
    }

    function registrarApuesta(monto, resultado, ganancia, tiempo) {
        $.ajax({
            url: "backend/php/registrar_apuesta.php",
            type: "POST",
            data: {
                monto: monto,
                resultado: resultado,
                ganancia: ganancia,
                tiempo_jugado: tiempo
            },
            success: function(response) {
                let data = JSON.parse(response);
                if (data.status === "success") {
                    alert(`Apuesta registrada. Nuevo saldo: $${data.nuevo_saldo}`);
                    obtenerSaldo();
                } else {
                    alert("Error al registrar la apuesta.");
                }
            }
        });
    }

    function manejarDepositoRetiro(monto, tipo) {
        $.ajax({
            url: "backend/php/depositar_retirar.php",
            type: "POST",
            data: { monto: monto, tipo: tipo },
            success: function(response) {
                let data = JSON.parse(response);
                if (data.status === "success") {
                    alert(`${tipo} realizado con éxito.`);
                    obtenerSaldo();
                } else {
                    alert("Error: " + data.message);
                }
            }
        });
    }

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
    }

    function iniciarCarrera() {
        if (running) return;

        let betAmount = parseFloat(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > saldo) {
            mostrarError("Apuesta inválida o saldo insuficiente.");
            return;
        }

        saldo -= betAmount;
        actualizarSaldo(saldo);
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
                mostrarError("¡Perdiste! Intenta de nuevo.");
            }
        }, Math.random() * (10000 - 5000) + 5000);
    }

    function detenerCarrera() {
        if (!running) return;

        running = false;
        clearInterval(multiplicadorInterval);
        clearInterval(moveInterval);

        let betAmount = parseFloat(betAmountInput.value);
        let ganancia = betAmount * multiplicador;
        saldo += ganancia;

        actualizarSaldo(saldo);
        registrarApuesta(betAmount, "GANADO", ganancia, Math.floor(Math.random() * 100));
        actualizarUI();
        caballo.style.left = "0px";
    }

    depositButton.addEventListener("click", () => {
        let depositAmount = parseFloat(depositAmountInput.value);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            mostrarError("Introduce una cantidad válida para depositar.");
            return;
        }

        manejarDepositoRetiro(depositAmount, "DEPOSITO");
    });

    withdrawButton.addEventListener("click", () => {
        let withdrawAmount = parseFloat(withdrawInput.value);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            mostrarError("Introduce una cantidad válida para retirar.");
            return;
        }

        if (withdrawAmount > saldo) {
            mostrarError("No tienes suficiente saldo para retirar esa cantidad.");
            return;
        }

        manejarDepositoRetiro(withdrawAmount, "RETIRO");
    });

    obtenerSaldo(); 
    actualizarUI();
    startRaceButton.addEventListener("click", iniciarCarrera);
    stopRaceButton.addEventListener("click", detenerCarrera);
});
