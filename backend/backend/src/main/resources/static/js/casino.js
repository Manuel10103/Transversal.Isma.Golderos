const games = [
    { id: "game1", images: ["/imagenes/tragaperras.webp", "/imagenes/logo.jpg"], text: ["Tragaperras", "Informaciontragaperras"] },
    { id: "game2", images: ["/imagenes/carreraCaballo.webp", "/imagenes/logo.jpg"], text: ["Carreras de caballos", "Carreras premium"] },
    { id: "game3", images: ["/imagenes/ruleta.webp", "/imagenes/logo.jpg"], text: ["Ruleta clásica", "Informacion"] }
];

games.forEach(game => {
    let imgElement = document.getElementById(game.id);
    let textElement = document.getElementById(`info${game.id.charAt(5)}`);

    // Asegurar que la imagen comienza con la primera del array
    imgElement.src = game.images[0];
    imgElement.dataset.index = 0;

    // Evento al pasar el ratón
    imgElement.addEventListener("mouseenter", () => {
        imgElement.src = game.images[1]; // Cambia a la segunda imagen
        textElement.innerText = game.text[1];
    });

    // Evento al quitar el ratón
    imgElement.addEventListener("mouseleave", () => {
        imgElement.src = game.images[0]; // Vuelve a la imagen original
        textElement.innerText = game.text[0];
    });
});
