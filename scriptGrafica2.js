// Jose Manuel Sanchez Peno
// Descripción: Este script genera un gráfico de barras horizontales para visualizar la frecuencia de motivos de viaje.

// Cargar el dataset desde GitHub
d3.csv("https://raw.githubusercontent.com/josemaunir/Actividad_1_Analisis_tendencias_en_D3/main/DATASET_HERRAMIENTAS.csv").then(datos => {
    // Asegurar que el campo de motivo es numérico
    datos.forEach(d => {
        d.MOTIV = +d.MOTIV;
    });

    // Diccionario completo de motivos de viaje
    const motivosTexto = {
        1: "Turismo de sol y playa",
        2: "Turismo cultural",
        3: "Turismo de naturaleza",
        4: "Turismo gastronómico",
        5: "Turismo deportivo",
        6: "Turismo termal y de bienestar",
        7: "Otro tipo de turismo de ocio",
        8: "Visitas a familiares o amigos",
        9: "Turismo de compras",
        10: "Desplazamiento al centro de estudios habitual",
        11: "Otros motivos de educación y formación",
        12: "Tratamiento de salud",
        13: "Motivos religiosos o peregrinaciones",
        14: "Incentivos",
        15: "Otros motivos personales",
        16: "Congresos, ferias y convenciones",
        17: "Desplazamiento al centro de trabajo",
        18: "Otros motivos profesionales"
    };

    // Agrupar datos por motivo y contar ocurrencias
    const resumenMotivos = Array.from(
        d3.rollup(datos, v => v.length, d => d.MOTIV),
        ([codigo, cantidad]) => ({
            codigo: codigo,
            motivo: motivosTexto[codigo] || `Motivo ${codigo}`,
            total: cantidad
        })
    ).sort((a, b) => b.total - a.total); // ordenar de mayor a menor

    // Dimensiones del gráfico
    const ancho = 700;
    const alto = 450;
    const margen = { top: 30, right: 40, bottom: 40, left: 280 };

    const svg = d3.select("#grafico-motivos")
        .append("svg")
        .attr("width", ancho)
        .attr("height", alto);

    const escalaY = d3.scaleBand()
        .domain(resumenMotivos.map(d => d.motivo))
        .range([margen.top, alto - margen.bottom])
        .padding(0.2);

    const escalaX = d3.scaleLinear()
        .domain([0, d3.max(resumenMotivos, d => d.total)]).nice()
        .range([margen.left, ancho - margen.right]);

    // Ejes
    svg.append("g")
        .attr("transform", `translate(0,${alto - margen.bottom})`)
        .call(d3.axisBottom(escalaX));

    svg.append("g")
        .attr("transform", `translate(${margen.left},0)`)
        .call(d3.axisLeft(escalaY));

    // Barras
    svg.selectAll("rect")
        .data(resumenMotivos)
        .enter()
        .append("rect")
        .attr("x", margen.left)
        .attr("y", d => escalaY(d.motivo))
        .attr("width", d => escalaX(d.total) - margen.left)
        .attr("height", escalaY.bandwidth())
        .attr("fill", "#4682b4")
        .append("title")
        .text(d => `${d.motivo}: ${d.total} viajes`);

    // Título del gráfico
    svg.append("text")
        .attr("x", ancho / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Motivos más frecuentes de viaje");
});
