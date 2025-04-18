// Gráfico de barras: tipos de viaje por mes
d3.csv("https://raw.githubusercontent.com/josemaunir/Actividad_1_Analisis_tendencias_en_D3/refs/heads/main/DATASET_HERRAMIENTAS.csv").then(data => {
    data.forEach(d => {
        d.MES = +d.MES;
        d.TIPOVIAJ = +d.TIPOVIAJ;
        d.count = +d.count;
    });

    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };

    const svg = d3.select("#grafico-viaje")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(data.map(d => `${d.MES}-${d.TIPOVIAJ}`))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(`${d.MES}-${d.TIPOVIAJ}`))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.count))
        .append("title")
        .text(d => `Mes: ${d.MES}, Tipo: ${d.TIPOVIAJ}, Viajes: ${d.count}`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text("Distribución de tipos de viaje por mes");
});
