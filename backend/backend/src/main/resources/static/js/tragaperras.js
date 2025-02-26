// Definición de símbolos (ajusta según tu lógica)
const symbols = [
    { name: 'cigarrillos', src: '/imagenes/Cigarrillos.png' },
    { name: 'boina',       src: '/imagenes/Boina.png' },
    { name: 'revolver',    src: '/imagenes/Revolver.png' },
    { name: 'bonus',       src: '/imagenes/bonus.png' },
    { name: 'wild',        src: '/imagenes/Wild.png' }
];

let saldo = 0; // Saldo que se maneja en el front
let resultados = [];

// Reloj
function updateClock() {
    const clock = document.getElementById("clock");
    if (clock) {
        clock.textContent = new Date().toLocaleTimeString();
    }
}
setInterval(updateClock, 1000);
updateClock();

window.addEventListener("load", function () {
    const ambiente = document.getElementById("ambiente");
    if (ambiente) {
        ambiente.loop = true;
        ambiente.play().catch(error => console.warn("La reproducción automática de audio puede estar bloqueada:", error));
    }
});

// Alternar blanco y negro
const fondoBtn = document.getElementById("blancoynegro");
if (fondoBtn) {
    fondoBtn.addEventListener("click", function () {
        document.body.classList.toggle('blanco-y-negro');
        const fondoOriginal = '/imagenes/Fondotragaperras.jpeg';
        const fondoBN = '/imagenes/Fondotragaperras-modified.jpeg';
        document.body.style.backgroundImage = document.body.classList.contains('blanco-y-negro') ? `url(${fondoBN})` : `url(${fondoOriginal})`;
    });
}

// Alternar música
let estadoMusica = true;
const toggleMusicBtn = document.getElementById("toggle-music");
if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener("click", function () {
        const ambiente = document.getElementById("ambiente");
        if (ambiente) {
            if (estadoMusica) {
                ambiente.pause();
            } else {
                ambiente.play();
            }
            estadoMusica = !estadoMusica;
            this.classList.toggle("muted", !estadoMusica);
        }
    });
}

// Control de volumen
const volumeControl = document.getElementById("volume-control");
if (volumeControl) {
    volumeControl.addEventListener("input", function () {
        const ambiente = document.getElementById("ambiente");
        if (ambiente) {
            ambiente.volume = this.value;
        }
    });
}

// Funciones de modales
function abrirModal(accion) {
    const modal = document.getElementById('dineroModal');
    if (modal) {
        document.getElementById('modal-title').textContent = accion;
        modal.style.display = 'flex';
    }
}
function cerrarModal() {
    const modal = document.getElementById('dineroModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
const closeBtns = document.querySelectorAll('.close');
closeBtns.forEach(btn => btn.addEventListener('click', cerrarModal));

function mostrarNecesitaSaldoModal() {
    const necesitaSaldoModal = document.getElementById('necesitaSaldoModal');
    if (necesitaSaldoModal) {
        necesitaSaldoModal.style.display = 'flex';
    }
}
function cerrarNecesitaSaldoModal() {
    const necesitaSaldoModal = document.getElementById('necesitaSaldoModal');
    if (necesitaSaldoModal) {
        necesitaSaldoModal.style.display = 'none';
    }
}
const cerrarNecesitaSaldoModalBtn = document.getElementById('cerrar-necesita-saldo');
if (cerrarNecesitaSaldoModalBtn) {
    cerrarNecesitaSaldoModalBtn.addEventListener('click', cerrarNecesitaSaldoModal);
}

// Actualizar saldo en pantalla
function actualizarSaldo() {
    const saldoElemento = document.getElementById("saldo");
    if (saldoElemento) {
        saldoElemento.textContent = `Saldo: €${saldo.toFixed(2)}`;
    }
}

// Confirmar ingreso/retiro
const confirmarBtn = document.getElementById('confirmar');
if (confirmarBtn) {
    confirmarBtn.addEventListener('click', function () {
        const montoInput = document.getElementById('monto');
        const monto = parseFloat(montoInput.value);
        const title = document.getElementById('modal-title').innerText;

        if (isNaN(monto) || monto <= 0) {
            mostrarErrorModal('Por favor, introduce un número válido mayor a 0.');
            return;
        }

        if (title === 'Ingresar Dinero') {
            saldo += monto;
        } else if (title === 'Retirar Dinero') {
            if (saldo >= monto) {
                saldo -= monto;
            } else {
                mostrarNecesitaSaldoModal();
                return;
            }
        }
        actualizarSaldo();
        cerrarModal();
    });
}

function mostrarErrorModal(mensaje) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('error-message');
    if (errorModal && errorMessage) {
        errorMessage.textContent = mensaje;
        errorModal.style.display = 'flex';
    }
}
function cerrarErrorModal() {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.style.display = 'none';
    }
}
const cerrarErrorModalBtn = document.getElementById('cerrar-error-modal');
if (cerrarErrorModalBtn) {
    cerrarErrorModalBtn.addEventListener('click', cerrarErrorModal);
}

// Función para girar la máquina tragaperras
function spinReels() {
    const costoPorTirada = 1;
    if (saldo < costoPorTirada) {
        mostrarNecesitaSaldoModal();
        return;
    }

    saldo -= costoPorTirada;
    actualizarSaldo();

    const reels = document.querySelectorAll('.reel');
    const results = [];

    reels.forEach((reel) => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.innerHTML = `<img src="${randomSymbol.src}" alt="${randomSymbol.name}">`;
        results.push(randomSymbol.name);
    });

    checkForWin(results);
    registrarJugada(results);
}

// NUEVO: Registrar jugada enviando el nombre real del usuario
function registrarJugada(resultados) {
    const usernameInput = document.getElementById("username");
    const username = usernameInput ? usernameInput.value : "Invitado";

    fetch('/api/jugada/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: username,
            saldo: saldo,
            resultado: resultados,
            fecha: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => console.log("Jugada registrada:", data))
    .catch(error => console.error("Error registrando la jugada:", error));
}

function checkForWin(results) {
    const premios = {
        revolver: 0.50,
        boina: 10,
        cigarrillos: 5,
        bonus: 1.00
    };

    if (results.every(symbol => symbol === 'revolver')) {
        saldo += premios.revolver;
        mostrarModalPremio('¡Felicidades! Todos los carriles "revolver", has ganado 0.50 monedas.');
    } else if (results.every(symbol => symbol === 'boina')) {
        saldo += premios.boina;
        mostrarModalPremio('¡Premio! Todos los carriles muestran "boina", has ganado 10 monedas.');
    } else if (results.every(symbol => symbol === 'cigarrillos')) {
        saldo += premios.cigarrillos;
        mostrarModalPremio('¡Premio! Todos los carriles muestran "cigarrillos", has ganado 5 monedas.');
    } else if (results.includes('bonus')) {
        saldo += premios.bonus;
        mostrarModalPremio('Bonus: Has ganado 1 moneda por obtener al menos un símbolo "bonus".');
    } else {
        console.log('No hubo premio esta vez.');
    }
    actualizarSaldo();
}

function mostrarModalPremio(mensaje) {
    const premioModal = document.getElementById('premioModal');
    const premioMessage = document.getElementById('premio-message');
    if (premioModal && premioMessage) {
        premioMessage.textContent = mensaje;
        premioModal.style.display = 'flex';
    }
}
const closePremio = document.querySelector('.close-premio');
if (closePremio) {
    closePremio.addEventListener('click', () => {
        const premioModal = document.getElementById('premioModal');
        if (premioModal) premioModal.style.display = 'none';
    });
}

const ruedaButton = document.getElementById('rueda-button');
if (ruedaButton) {
    ruedaButton.addEventListener('click', spinReels);
}

// Obtener saldo del back-end al cargar la página
fetch('/api/usuario/saldo', { credentials: 'include' })
  .then(response => {
      if (!response.ok) throw new Error("No autenticado");
      return response.json();
  })
  .then(data => {
      console.log("Saldo recibido:", data);
      saldo = parseFloat(data.saldo);
      if (isNaN(saldo)) {
          console.error("Saldo obtenido es NaN. Se asigna 0.");
          saldo = 0;
      }
      actualizarUI();
  })
  .catch(error => {
      console.error("Error obteniendo el saldo:", error);
  });

  function obtenerSaldoServidor() {
    fetch('/api/usuario/saldo', { credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error("No autenticado");
        return response.json();
      })
      .then(data => {
        // data.saldo: BigDecimal en el servidor, por ejemplo "300.00"
        saldo = parseFloat(data.saldo);
        if (isNaN(saldo)) {
          saldo = 0;
        }
        actualizarUI(); // Función que pinta el saldo en pantalla
      })
      .catch(error => {
        console.error("Error al obtener saldo:", error);
      });
  }
  