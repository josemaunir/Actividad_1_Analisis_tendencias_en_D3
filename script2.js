// Gráfico de pastel: motivos más frecuentes
d3.csv("motivos_frecuencia.csv").then(data => {
    data.forEach(d => {
        d.count = +d.count;
    });

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#grafico-motivos")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.count);
    const data_ready = pie(data);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.MOTIV))
        .append("title")
        .text(d => `Motivo: ${d.data.MOTIV}\nFrecuencia: ${d.data.count}`);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -height / 2 + 20)
        .style("font-size", "16px")
        .text("Motivos más frecuentes de viaje");
});
