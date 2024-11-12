// main.js
fetch('/skills.json')
  .then(response => response.json())
  .then(data => {
    createHexagons(data);  // Llamamos a la función que creará los hexágonos
  })
  .catch(error => console.error("Error al cargar el JSON", error));

function createHexagons(skills) {
  const container = document.getElementById('hexagon-container');

  skills.forEach(skill => {
    // Crear el contenedor para cada hexágono
    const hexagonWrapper = document.createElement('div');
    hexagonWrapper.classList.add('svg-wrapper');
    hexagonWrapper.setAttribute('data-id', skill.id);
    hexagonWrapper.setAttribute('data-custom', 'false');

    // Crear el SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '0 0 100 100');

    // Crear el hexágono
    const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    hexagon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
    hexagon.classList.add('hexagon');

    // Crear el texto
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', '50%');
    text.setAttribute('y', '20%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'black');
    text.setAttribute('font-size', '10');

    // Crear y agregar las líneas de texto (tspan)
    const lines = skill.text.split("\n\n\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute('x', '50%');
      tspan.setAttribute('dy', '1.2em');
      tspan.setAttribute('font-weight', 'bold');
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    // Crear la imagen del ícono
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    icon.setAttribute('x', '35%');
    icon.setAttribute('y', '60%');
    icon.setAttribute('width', '30');
    icon.setAttribute('height', '30');
    icon.setAttribute('href', skill.icon);

    // Agregar los elementos al SVG
    svg.appendChild(hexagon);
    svg.appendChild(text);
    svg.appendChild(icon);

    // Agregar el SVG al contenedor del hexágono
    hexagonWrapper.appendChild(svg);
    container.appendChild(hexagonWrapper);
  });
}
