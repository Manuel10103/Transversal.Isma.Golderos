// Reproducción de música al cargar
window.addEventListener("load", function () {
    const ambiente = document.getElementById("ambiente");
    ambiente.loop = true;
    ambiente.play().catch(error => console.warn("La reproducción automática de audio puede estar bloqueada:", error));
});

// Alterna blanco y negro para el fondo
document.getElementById("blancoynegro").addEventListener("click", function () {
    document.body.classList.toggle('blanco-y-negro');
    const fondoOriginal = '/imagenes/Fondotragaperras.jpeg';
    const fondoBN = '/imagenes/Fondotragaperras-modified.jpeg';
    document.body.style.backgroundImage = document.body.classList.contains('blanco-y-negro') ? `url(${fondoBN})` : `url(${fondoOriginal})`;
});

// Alternar música
let estadoMusica = true;
document.getElementById("toggle-music").addEventListener("click", function () {
    const ambiente = document.getElementById("ambiente");
    if (estadoMusica) {
        ambiente.pause();
    } else {
        ambiente.play();
    }
    estadoMusica = !estadoMusica;
    this.classList.toggle("muted", !estadoMusica);
});

// Control de volumen
document.getElementById("volume-control").addEventListener("input", function () {
    document.getElementById("ambiente").volume = this.value;
});

// Actualizar hora cada segundo
function updateClock() {
    document.getElementById("clock").textContent = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Modal para el saldo
let saldo = 0;

function abrirModal(accion) {
    const modal = document.getElementById('dineroModal');
    document.getElementById('modal-title').textContent = accion;
    modal.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('dineroModal').style.display = 'none';
}

// Eventos para cerrar modales
document.querySelector('.close').addEventListener('click', cerrarModal);

document.getElementById('ingresar-dinero').addEventListener('click', function () {
    abrirModal('Ingresar Dinero');
});

document.getElementById('retirar-dinero').addEventListener('click', function () {
    abrirModal('Retirar Dinero');
});

// Función para mostrar el modal de error
function mostrarErrorModal(mensaje) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = mensaje;
    errorModal.style.display = 'flex';
}

// Función para cerrar el modal de error
function cerrarErrorModal() {
    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'none';
}

// Vincular el botón de cierre del modal de error
document.getElementById('cerrar-error-modal').addEventListener('click', cerrarErrorModal);

// Función para mostrar el modal de error
function mostrarErrorModal(mensaje) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = mensaje;
    errorModal.style.display = 'flex';
}

// Función para cerrar el modal de error
function cerrarErrorModal() {
    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'none';
}

// Vincular el botón de cierre del modal de error
document.getElementById('cerrar-error-modal').addEventListener('click', cerrarErrorModal);

// Actualización del evento para confirmar el monto
document.getElementById('confirmar').addEventListener('click', function () {
    const monto = parseFloat(document.getElementById('monto').value);
    const title = document.getElementById('modal-title').innerText;

    if (isNaN(monto) || monto <= 0) {
        // Mostrar el modal de error en lugar de un alert
        mostrarErrorModal('Por favor, introduce un numero valido mayor a 0.');
        return;
    }

    if (title === 'Ingresar Dinero') {
        saldo += monto;
    } else if (title === 'Retirar Dinero') {
        if (saldo >= monto) {
            saldo -= monto;
        } else {
            mostrarNecesitaSaldoModal(); // Mostrar "Necesitas más saldo" directamente
            return;
        }
    }

    actualizarSaldo();
    cerrarModal();
});


// Función para mostrar el modal "Necesitas más saldo"
function mostrarNecesitaSaldoModal() {
    const necesitaSaldoModal = document.getElementById('necesitaSaldoModal');
    necesitaSaldoModal.style.display = 'flex';
}

// Función para cerrar el modal de "Necesitas más saldo"
function cerrarNecesitaSaldoModal() {
    const necesitaSaldoModal = document.getElementById('necesitaSaldoModal');
    necesitaSaldoModal.style.display = 'none';
}

// Vincular botón para cerrar el modal de "Necesitas más saldo"
document.getElementById('cerrar-necesita-saldo').addEventListener('click', cerrarNecesitaSaldoModal);

// Actualizar saldo en pantalla
function actualizarSaldo() {
    document.getElementById("saldo").textContent = `Saldo: $${saldo.toFixed(2)}`;
}
// Lista de símbolos y sus rutas o emojis
const symbols = [
    { name: 'boina', src: '/imagenes/boina.png' },
    { name: 'boina', src: '/imagenes/boina.png' },
    { name: 'boina', src: '/imagenes/boina.png' },
    { name: 'boina', src: '/imagenes/boina.png' },
    { name: 'boina', src: '/imagenes/boina.png' },
    { name: 'boina', src: '/imagenes/boina.png' },
    { name: 'boina', src: '/imagenes/boina.png' },
    { name: 'boina', src: '/imagenes/boina.png' },

    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },
    { name: 'revolver', src: '/imagenes/Revolver.png' },

    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    { name: 'cigarrillos', src: '/imagenes/cigarrillos.png' },
    
    { name: 'Wild', src: '/imagenes/Wild.png' },

    { name: 'bonus', src: '/imagenes/Bonus.png' },

    { name: 'revolveremoti', emoji: '🔫' },
    { name: 'revolveremoti', emoji: '🔫' },
    { name: 'revolveremoti', emoji: '🔫' },
    { name: 'revolveremoti', emoji: '🔫' },
    { name: 'revolveremoti', emoji: '🔫' },

    { name: 'sombrero', emoji: '🎩' },
    { name: 'sombrero', emoji: '🎩' },
    { name: 'sombrero', emoji: '🎩' },
    { name: 'sombrero', emoji: '🎩' },
    { name: 'sombrero', emoji: '🎩' },

];

// Función para girar los carriles
function spinReels() {
    const costoPorTirada = 1;

    if (saldo >= costoPorTirada) {
        saldo -= costoPorTirada;
        actualizarSaldo();

        const reels = document.querySelectorAll('.reel');
        const results = []; // Almacenar nombres de los símbolos

        reels.forEach((reel) => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

            // Mostrar emoji o imagen según esté definido
            if (randomSymbol.emoji) {
                reel.innerHTML = `<span style="font-size: 2rem;">${randomSymbol.emoji}</span>`;
            } else {
                reel.innerHTML = `<img src="${randomSymbol.src}" alt="${randomSymbol.name}">`;
            }

            results.push(randomSymbol.name); // Almacenar el nombre del símbolo
        });

        checkForWin(results); // Verificar si hay premios
    } else {
        mostrarNecesitaSaldoModal(); // Mostrar directamente "Necesitas más saldo"
    }
}

// Mostrar el modal de felicitaciones (revólveres)
function mostrarModalFelicitaciones() {
    const felicitacionesModal = document.getElementById('felicitacionesModal');
    felicitacionesModal.style.display = 'flex';

    // Cerrar modal al hacer clic en la X o en el fondo
    const cerrarModal = () => {
        felicitacionesModal.style.display = 'none';
    };

    document.querySelector('.close-felicitaciones').addEventListener('click', cerrarModal);
    felicitacionesModal.addEventListener('click', cerrarModal);
}

// Mostrar el modal genérico para otros premios
function mostrarModalPremio(mensaje) {
    const premioModal = document.getElementById('premioModal');
    document.getElementById('premio-message').textContent = mensaje;
    premioModal.style.display = 'flex';

    // Cerrar modal al hacer clic en la X o en el fondo
    const cerrarModal = () => {
        premioModal.style.display = 'none';
    };

    document.querySelector('.close-premio').addEventListener('click', cerrarModal);
    premioModal.addEventListener('click', cerrarModal);
}
// Lógica para verificar premios
function checkForWin(results) {
    const revolverPrize = 0.50; // Premio por 4 revólveres
    const boinaPrize = 10;     // Premio por 4 boinas
    const cigarrillosPrize = 5; // Premio por 4 cigarrillos
    const bonusPrize = 1.00;   // Premio por al menos un símbolo "bonus"

    if (results.every(symbol => symbol === 'revolver')) {
        saldo += revolverPrize;
        actualizarSaldo();
        mostrarModalFelicitaciones(); // Modal específico para revólveres
    } else if (results.every(symbol => symbol === 'boina')) {
        saldo += boinaPrize;
        actualizarSaldo();
        mostrarModalPremio('¡Premio! Todos los carriles muestran "boina", has ganado 10 monedas.');
    } else if (results.every(symbol => symbol === 'cigarrillos')) {
        saldo += cigarrillosPrize;
        actualizarSaldo();
        mostrarModalPremio('¡Premio! Todos los carriles muestran "cigarrillos", has ganado 5 monedas.');
    } else if (results.includes('bonus')) {
        saldo += bonusPrize;
        actualizarSaldo();
        mostrarModalPremio('Bonus Has ganado 1 moneda por obtener al menos un simbolo "bonus".');
    } else {
        console.log('No hubo premio esta vez.');
    }
}


// Actualizar saldo en pantalla
function actualizarSaldo() {
    document.getElementById("saldo").textContent = `Saldo: $${saldo.toFixed(2)}`;
}

// Evento para el botón de giro
document.getElementById('rueda-button').addEventListener('click', spinReels);



// Objeto con las traducciones
const traducciones = {
    es: {
      title: "Bienvenidos a mi página",
      description: "Esta es una página de ejemplo."
    },
    en: {
      title: "Welcome to my page",
      description: "This is a sample page."
    }
  };
  
  // Función para cambiar el idioma
  function cambiarIdioma() {
    document.getElementById("title").innerText = traducciones.en.title;
    document.getElementById("description").innerText = traducciones.en.description;
    document.documentElement.lang = "en"; // Cambia el atributo lang del HTML a inglés
  }
  