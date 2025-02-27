document.addEventListener("DOMContentLoaded", () => {
    // ====================
    // Elementos del DOM
    // ====================
    const ruedaButton = document.getElementById("rueda-button");      // Botón para girar
    const saldoText = document.getElementById("saldo");                // Muestra el saldo
    const slotMachineContainer = document.getElementById("slot-machine"); // Contenedor para los reels
    const resultText = document.getElementById("result");              // Muestra el resultado
  
    // Elementos opcionales para modales de depósito/retiro
    const depositModal = document.getElementById("deposit-modal");
    const withdrawModal = document.getElementById("withdraw-modal");
    const depositButton = document.getElementById("deposit-button");
    const withdrawButton = document.getElementById("withdraw-button");
    const depositAmountInput = document.getElementById("deposit-amount");
    const withdrawInput = document.getElementById("withdraw-amount");
    const errorModal = document.getElementById("error-modal");
    const errorText = document.getElementById("error-text");
    const closeErrorModal = document.getElementById("close-error-modal");
  
    // ====================
    // Variables de estado
    // ====================
    let saldo = 0;          // Saldo real del usuario (se sincroniza con la BD)
    const fixedBet = 1;     // Apuesta fija de 1€
    const symbols = [
      { name: 'cigarrillos', src: '/imagenes/Cigarrillos.png' },
      { name: 'boina',       src: '/imagenes/Boina.png' },
      { name: 'revolver',    src: '/imagenes/Revolver.png' },
      { name: 'bonus',       src: '/imagenes/bonus.png' },
      { name: 'wild',        src: '/imagenes/Wild.png' }
    ];
  
    // ====================
    // Funciones auxiliares
    // ====================
    
    // Actualiza la UI con el saldo actual
    function actualizarUI() {
      if (saldoText) {
        saldoText.textContent = `Saldo: €${saldo.toFixed(2)}`;
      }
    }
  
    // Muestra un mensaje de error (en modal o en consola)
    function mostrarError(mensaje) {
      if (errorText && errorModal) {
        errorText.textContent = mensaje;
        errorModal.style.display = "flex";
        setTimeout(() => { errorModal.style.display = "none"; }, 3000);
      } else {
        console.error(mensaje);
      }
    }
  
    // Obtiene el saldo real del servidor (se espera que el endpoint devuelva un JSON: { "saldo": "670.00" })
    function obtenerSaldoServidor() {
      fetch('/usuarios/saldo', { credentials: 'include' })
        .then(response => {
          if (!response.ok) throw new Error("No autenticado");
          return response.json();
        })
        .then(data => {
          saldo = parseFloat(data.saldo) || 0;
          actualizarUI();
        })
        .catch(error => console.error("Error obteniendo el saldo:", error));
    }
  
    // Llamar al cargar la página para sincronizar el saldo
    obtenerSaldoServidor();
  
    // Función que "anima" los reels durante un tiempo (por ejemplo, 2 segundos)
    function animarReelsDurante(duration) {
      return new Promise(resolve => {
        const intervalId = setInterval(() => {
          if (slotMachineContainer) {
            // Vacía el contenedor y añade 3 imágenes aleatorias para simular el giro
            slotMachineContainer.innerHTML = "";
            for (let i = 0; i < 3; i++) {
              const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
              const img = document.createElement("img");
              img.src = randomSymbol.src;
              img.alt = randomSymbol.name;
              img.style.width = "80px";
              img.style.margin = "0 5px";
              slotMachineContainer.appendChild(img);
            }
          }
        }, 100);
        setTimeout(() => {
          clearInterval(intervalId);
          resolve();
        }, duration);
      });
    }
  
    // Función que genera el resultado final (3 símbolos fijos) y los muestra en el contenedor
    function generarResultadoFinal() {
      const resultados = [];
      if (slotMachineContainer) {
        slotMachineContainer.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          resultados.push(randomSymbol.name);
          const img = document.createElement("img");
          img.src = randomSymbol.src;
          img.alt = randomSymbol.name;
          img.style.width = "80px";
          img.style.margin = "0 5px";
          slotMachineContainer.appendChild(img);
        }
      }
      return resultados;
    }
  
    // Función para registrar la jugada en el back-end (actualiza el saldo en BD)
    function registrarJugada(resultado, monto, ganancia) {
      return fetch('/api/jugada/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          monto: monto,
          ganancia: ganancia,
          resultado: resultado,
          fecha: new Date().toISOString()
        })
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || err); });
          }
          return response.json();
        })
        .then(data => {
          console.log("Jugada registrada, nuevo saldo:", data.saldo);
        })
        .catch(error => console.error("Error registrando la jugada:", error));
    }
  
    // ====================
    // Función principal: spinSlots
    // ====================
    function spinSlots() {
      // Verifica si hay saldo suficiente para apostar 1€
      if (fixedBet > saldo) {
        resultText.textContent = "Saldo insuficiente para apostar 1€.";
        resultText.style.color = "red";
        return;
      }
  
      // Descuenta la apuesta fija (1€) del saldo local y actualiza la UI
      saldo -= fixedBet;
      actualizarUI();
      resultText.textContent = "";
  
      // Inicia la animación de giro durante 2 segundos
      animarReelsDurante(2000).then(() => {
        // Genera el resultado final: 3 símbolos
        const resultados = generarResultadoFinal();
        let ganancia = 0;
        // Si los 3 símbolos son iguales, gana 5 veces la apuesta
        if (resultados[0] === resultados[1] && resultados[1] === resultados[2]) {
          ganancia = fixedBet * 5;
          resultText.textContent = `¡Ganaste! Premio: €${ganancia.toFixed(2)}`;
          resultText.style.color = "green";
        } else {
          resultText.textContent = "No ganaste, inténtalo de nuevo.";
          resultText.style.color = "red";
        }
        // Actualiza el saldo local (suma la ganancia si hubiera)
        saldo += ganancia;
        actualizarUI();
        // Registra la jugada en el back-end y luego sincroniza el saldo
        registrarJugada(ganancia > 0 ? "GANADO" : "PERDIDO", fixedBet, ganancia)
          .then(() => obtenerSaldoServidor());
      });
    }
  
    // ====================
    // Configuración de eventos
    // ====================
    if (ruedaButton) {
      ruedaButton.addEventListener("click", spinSlots);
    } else {
      console.error("No se encontró el botón con id 'rueda-button'. Verifica tu HTML.");
    }
  
    // --------------------
    // Opcional: Código para modales de depósito/retiro
    // --------------------
    function abrirModal(modal) {
      modal.style.display = "flex";
    }
    function cerrarModal(modal) {
      modal.style.display = "none";
    }
    depositButton && depositButton.addEventListener("click", () => {
      const depositAmount = parseFloat(depositAmountInput.value);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        mostrarError("Introduce una cantidad válida para depositar.");
        return;
      }
      saldo += depositAmount;
      actualizarUI();
      cerrarModal(depositModal);
      // Aquí podrías llamar a un endpoint REST para actualizar el depósito en la BD
    });
    withdrawButton && withdrawButton.addEventListener("click", () => {
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
      // Aquí podrías llamar a un endpoint REST para actualizar el retiro en la BD
    });
    document.getElementById("deposit-open")?.addEventListener("click", () => abrirModal(depositModal));
    document.getElementById("withdraw-open")?.addEventListener("click", () => abrirModal(withdrawModal));
    document.getElementById("close-modal")?.addEventListener("click", () => cerrarModal(depositModal));
    document.getElementById("withdraw-close")?.addEventListener("click", () => cerrarModal(withdrawModal));
    document.getElementById("close-loss-modal")?.addEventListener("click", () => {
      const lossModalElem = document.getElementById("loss-modal");
      if (lossModalElem) cerrarModal(lossModalElem);
    });
    window.addEventListener("click", (event) => {
      if (event.target === depositModal) cerrarModal(depositModal);
      if (event.target === withdrawModal) cerrarModal(withdrawModal);
      if (event.target === document.getElementById("loss-modal")) cerrarModal(document.getElementById("loss-modal"));
      if (event.target === errorModal) cerrarModal(errorModal);
    });
  
    // (Opcional) Sincroniza el saldo cada 2 segundos para mantenerlo actualizado
    setInterval(obtenerSaldoServidor, 2000);
  
    actualizarUI();
  });
  