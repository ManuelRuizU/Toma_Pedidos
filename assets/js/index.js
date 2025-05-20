
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = urlParams.get("categoria");

    if (categoriaSeleccionada) {
        const targetElement = document.querySelector(`[data-categoria="${categoriaSeleccionada}"]`);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            targetElement.style.transition = "background-color 0.5s ease-in-out";
            targetElement.style.backgroundColor = "#ffebbb";

            setTimeout(() => {
                targetElement.style.backgroundColor = "";
            }, 2000);
        } else {
            console.warn(`No se encontró la categoría: ${categoriaSeleccionada}`);
        }
    }
});
