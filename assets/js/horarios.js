
document.addEventListener("DOMContentLoaded", function () {
    const selectHorario = document.getElementById("horario");

    // Define el rango de horarios (por ejemplo, de 12:00 PM a 10:00 PM)
    const horaInicio = 13 * 60; // 12:00 PM en minutos
    const horaFin = 24 * 60; // 10:00 PM en minutos
    const intervalo = 20; // Intervalo de 20 minutos

    for (let minutos = horaInicio; minutos <= horaFin; minutos += intervalo) {
        let horas = Math.floor(minutos / 60);
        let min = minutos % 60;
        let ampm = horas >= 12 ? "PM" : "AM";

        // Convertir a formato 12 horas
        if (horas > 12) horas -= 12;

        let horaFormateada = `${horas}:${min.toString().padStart(2, "0")} ${ampm}`;

        let option = document.createElement("option");
        option.value = horaFormateada;
        option.textContent = horaFormateada;
        selectHorario.appendChild(option);
    }
});
