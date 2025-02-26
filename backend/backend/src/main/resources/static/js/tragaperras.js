// Reproducción de música al cargar
window.addEventListener("load", function () {
    const ambiente = document.getElementById("ambiente");
    if (ambiente) {
        ambiente.loop = true;
        ambiente.play().catch(error => console.warn("La reproducción automática de audio puede estar bloqueada:", error));
    }
});

// Alterna blanco y negro para el fondo
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

// Actualizar hora cada segundo
function updateClock() {
    const clock = document.getElementById("clock");
    if (clock) {
        clock.textContent = new Date().toLocaleTimeString();
    }
}
setInterval(updateClock, 1000);
updateClock();

// Modal para el saldo
let saldo = 0;

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

// Eventos para cerrar modales
const closeBtns = document.querySelectorAll('.close');
closeBtns.forEach(btn => btn.addEventListener('click', cerrarModal));

const ingresarBtn = document.getElementById('ingresar-dinero');
if (ingresarBtn) {
    ingresarBtn.addEventListener('click', function () {
        abrirModal('Ingresar Dinero');
    });
}

const retirarBtn = document.getElementById('retirar-dinero');
if (retirarBtn) {
    retirarBtn.addEventListener('click', function () {
        abrirModal('Retirar Dinero');
    });
}

// Función para mostrar el modal de error
function mostrarErrorModal(mensaje) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('error-message');
    if (errorModal && errorMessage) {
        errorMessage.textContent = mensaje;
        errorModal.style.display = 'flex';
    }
}

// Función para cerrar el modal de error
function cerrarErrorModal() {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.style.display = 'none';
    }
}

// Vincular el botón de cierre del modal de error
const cerrarErrorModalBtn = document.getElementById('cerrar-error-modal');
if (cerrarErrorModalBtn) {
    cerrarErrorModalBtn.addEventListener('click', cerrarErrorModal);
}

// Confirmar el monto
const confirmarBtn = document.getElementById('confirmar');
if (confirmarBtn) {
    confirmarBtn.addEventListener('click', function () {
        const monto = parseFloat(document.getElementById('monto').value);
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

// Modal para "Necesitas más saldo"
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
        saldoElemento.textContent = `Saldo: $${saldo.toFixed(2)}`;
    }
}

// Función para girar los carriles
function spinReels() {
    const costoPorTirada = 1;

    if (saldo >= costoPorTirada) {
        saldo -= costoPorTirada;
        actualizarSaldo();

        const reels = document.querySelectorAll('.reel');
        const results = [];

        reels.forEach((reel) => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.innerHTML = randomSymbol.emoji ? `<span style="font-size: 2rem;">${randomSymbol.emoji}</span>` : `<img src="${randomSymbol.src}" alt="${randomSymbol.name}">`;
            results.push(randomSymbol.name);
        });

        checkForWin(results);
        registrarJugada(results);
    } else {
        mostrarNecesitaSaldoModal();
    }
}

// Función para registrar la jugada
function registrarJugada(resultados) {
    fetch('/api/jugada/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: "usuario_logueado",
            saldo: saldo,
            resultado: resultados,
            fecha: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => console.log("Jugada registrada:", data))
    .catch(error => console.error("Error registrando la jugada:", error));
}

// Verificar premios
function checkForWin(results) {
    const premios = {
        revolver: 0.50,
        boina: 10,
        cigarrillos: 5,
        bonus: 1.00
    };

    if (results.every(symbol => symbol === 'revolver')) {
        saldo += premios.revolver;
        mostrarModalFelicitaciones();
    } else if (results.every(symbol => symbol === 'boina')) {
        saldo += premios.boina;
        mostrarModalPremio('¡Premio! Todos los carriles muestran "boina", has ganado 10 monedas.');
    } else if (results.every(symbol => symbol === 'cigarrillos')) {
        saldo += premios.cigarrillos;
        mostrarModalPremio('¡Premio! Todos los carriles muestran "cigarrillos", has ganado 5 monedas.');
    } else if (results.includes('bonus')) {
        saldo += premios.bonus;
        mostrarModalPremio('Bonus Has ganado 1 moneda por obtener al menos un simbolo "bonus".');
    } else {
        console.log('No hubo premio esta vez.');
    }
}

// Evento para el botón de giro
const ruedaButton = document.getElementById('rueda-button');
if (ruedaButton) {
    ruedaButton.addEventListener('click', spinReels);
}

// Obtener saldo al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/usuario/saldo')
        .then(response => response.json())
        .then(data => {
            saldo = parseFloat(data.saldo);
            actualizarSaldo();
        })
        .catch(error => {
            console.error("Error obteniendo el saldo:", error);
            mostrarErrorModal("No se pudo obtener el saldo. Inténtalo más tarde.");
        });
        
});
