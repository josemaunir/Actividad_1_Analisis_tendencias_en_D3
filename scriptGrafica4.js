// Cargar datos
d3.csv("https://raw.githubusercontent.com/josemaunir/Actividad_1_Analisis_tendencias_en_D3/main/DATASET_HERRAMIENTAS.csv").then(data => {
    data.forEach(d => {
        d.count = +d.count;
    });

    // Mostrar título y nombre
    d3.select("body")
        .append("h2")
        .text("María Aranzazu Martorell - Gráfica 2")
        .style("color", "darkblue");
});
