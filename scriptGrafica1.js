// Jose Manuel Sanchez Peno
// Descripción: Este script genera un gráfico de líneas para visualizar la evolución mensual de distintos tipos de viaje a partir de un dataset CSV externo.

// Cargar el archivo CSV desde GitHub
// Dataset original con columnas: MES, TIPOVIAJ, etc.
d3.csv("https://raw.githubusercontent.com/josemaunir/Actividad_1_Analisis_tendencias_en_D3/main/DATASET_HERRAMIENTAS.csv").then(datos => {
    // Convertir a número los campos necesarios
    datos.forEach(registro => {
        registro.MES = +registro.MES;
        registro.TIPOVIAJ = +registro.TIPOVIAJ;
    });

    // Diccionario de tipos de viaje para la leyenda
    const nombresTipos = {
        1: "Viajes de puente",
        2: "Viajes de fin de semana",
        3: "Trabajo",
        4: "Estudio",
        5: "Desplazamiento al centro de estudio",
        6: "Desplazamiento al centro de trabajo",
        7: "Vacaciones de verano",
        8: "Vacaciones de Navidad",
        9: "Vacaciones de Semana Santa",
        10: "Otros viajes"
    };

    const codigosTipos = [...new Set(datos.map(r => r.TIPOVIAJ))].sort();
    const nombresMeses = [
        "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Contar cuántos viajes hay por tipo y por mes
    const viajesPorTipo = codigosTipos.map(codigo => {
        const conteoMensual = Array(12).fill(0);
        datos.filter(r => r.TIPOVIAJ === codigo).forEach(r => {
            conteoMensual[r.MES - 1]++;
        });
        return {
            tipo: codigo,
            etiqueta: nombresTipos[codigo],
            valores: conteoMensual.map((total, idx) => ({ mes: idx + 1, nombreMes: nombresMeses[idx + 1], total }))
        };
    });

    // Dimensiones del gráfico
    const ancho = 800;
    const alto = 400;
    const margen = { top: 50, right: 250, bottom: 60, left: 60 };

    const svg = d3.select("#grafico-tipoviaje-mes")
        .append("svg")
        .attr("width", ancho)
        .attr("height", alto);

    // Escala para el eje X con nombres de meses
    const escalaX = d3.scalePoint()
        .domain(nombresMeses.slice(1))
        .range([margen.left, ancho - margen.right]);

    // Escala para el eje Y con valores máximos
    const escalaY = d3.scaleLinear()
        .domain([0, d3.max(viajesPorTipo, tipo => d3.max(tipo.valores, v => v.total))]).nice()
        .range([alto - margen.bottom, margen.top]);

    // Asignar color a cada línea
    const colores = d3.scaleOrdinal()
        .domain(codigosTipos)
        .range(d3.schemeCategory10);

    const generadorLinea = d3.line()
        .x(d => escalaX(d.nombreMes))
        .y(d => escalaY(d.total));

    // Dibujar ejes X e Y
    svg.append("g")
        .attr("transform", `translate(0,${alto - margen.bottom})`)
        .call(d3.axisBottom(escalaX))
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("transform", `translate(${margen.left},0)`)
        .call(d3.axisLeft(escalaY));

    // Dibujar líneas por cada tipo
    svg.selectAll(".linea-viaje")
        .data(viajesPorTipo)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", d => colores(d.tipo))
        .attr("stroke-width", 2)
        .attr("d", d => generadorLinea(d.valores));

    // Puntos con tooltip
    svg.selectAll(".puntos")
        .data(viajesPorTipo.flatMap(d => d.valores.map(v => ({ ...v, tipo: d.tipo, etiqueta: d.etiqueta }))))
        .enter()
        .append("circle")
        .attr("cx", d => escalaX(d.nombreMes))
        .attr("cy", d => escalaY(d.total))
        .attr("r", 3)
        .attr("fill", d => colores(d.tipo))
        .append("title")
        .text(d => `Mes: ${d.nombreMes}\n${d.etiqueta}\nViajes: ${d.total}`);

    // Título del gráfico
    svg.append("text")
        .attr("x", ancho / 2)
        .attr("y", margen.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Evolución mensual de los tipos de viaje");

    // Leyenda con nombres descriptivos
    const leyenda = svg.selectAll(".leyenda")
        .data(viajesPorTipo)
        .enter()
        .append("g")
        .attr("class", "leyenda")
        .attr("transform", (d, i) => `translate(${ancho - margen.right + 10},${margen.top + i * 20})`);

    leyenda.append("rect")
        .attr("x", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => colores(d.tipo));

    leyenda.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .text(d => d.etiqueta);
});