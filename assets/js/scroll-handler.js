
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");

    if (categoria) {
        const elemento = document.getElementById(categoria);
        if (elemento) {
            elemento.scrollIntoView({ behavior: "smooth" });
        } else {
            console.warn(`No se encontró el elemento con id: ${categoria}`);
        }
    }
});
