// main.js
fetch('/skills.json')
  .then(response => response.json())
  .then(data => {
    createHexagons(data);  // Llamamos a la función que creará los hexágonos
  })
  .catch(error => console.error("Error al cargar el JSON", error));

function createHexagons(skills) {
  const container = document.getElementById('hexagon-container');
  const isAdmin = container.getAttribute('adminValue'); //devuelve un string en vez de un booleano
  console.log('Admin value: ', isAdmin);
  
  skills.forEach(skill => {
    const hexagonWrapper = document.createElement('div');
    hexagonWrapper.classList.add('svg-wrapper');
    hexagonWrapper.setAttribute('data-id', skill.id);
    hexagonWrapper.setAttribute('data-description', skill.description); // Agrega descripción para mostrarla en el hover

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '0 0 100 100');
  
    const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    hexagon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
    hexagon.classList.add('hexagon');
  
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', '50%');
    text.setAttribute('y', '20%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'black');
    text.setAttribute('font-size', '10');

    if (skill.pendingEvidences >= 0){
      const evidenceCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      evidenceCircle.setAttribute('cx', '15'); // Coordenada x del centro
      evidenceCircle.setAttribute('cy', '15'); // Coordenada y del centro
      evidenceCircle.setAttribute('r', '10'); // Radio del círculo
      evidenceCircle.setAttribute('fill', 'red'); // Color rojo

      // Añadir el texto dentro del círculo
      const evidenceText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      evidenceText.setAttribute('x', '15');
      evidenceText.setAttribute('y', '20'); // Ajusta la posición vertical
      evidenceText.setAttribute('text-anchor', 'middle');
      evidenceText.setAttribute('fill', 'white'); // Texto blanco
      evidenceText.setAttribute('font-size', '10');
      evidenceText.setAttribute('font-weight', 'bold');
      evidenceText.textContent = skill.pendingEvidences;

      svg.appendChild(evidenceCircle); // Añadir el círculo al SVG
      svg.appendChild(evidenceText);  // Añadir el texto dentro del círculo
    }

  
    const lines = skill.text.split("\n\n\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute('x', '50%');
      tspan.setAttribute('dy', '1.2em');
      tspan.setAttribute('font-weight', 'bold');
      tspan.textContent = line;
      text.appendChild(tspan);
    });
  
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    icon.setAttribute('x', '35%');
    icon.setAttribute('y', '60%');
    icon.setAttribute('width', '30');
    icon.setAttribute('height', '30');
    icon.setAttribute('href', skill.icon);
  
    // Crear contenedor para los íconos adicionales (lápiz y cuaderno)
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('icons');

    if (isAdmin === 'true'){
      const pencilIcon = document.createElement('span');
      pencilIcon.classList.add('icon-pencil');
      pencilIcon.textContent = '✏️';
      iconsContainer.appendChild(pencilIcon);
    }

    const notebookIcon = document.createElement('span');
    notebookIcon.classList.add('icon-notebook');
    notebookIcon.textContent = '📒';
    
    // Evento para redirigir a la página del cuaderno
    notebookIcon.addEventListener('click', () => {
      window.location.href = `/skill/${skill.id}`;  // Redirige a la página de la habilidad
    });

    iconsContainer.appendChild(notebookIcon);
  
    svg.appendChild(hexagon);
    svg.appendChild(text);
    svg.appendChild(icon);
  
    // Añadir el contenedor de íconos al wrapper
    hexagonWrapper.appendChild(svg);
    hexagonWrapper.appendChild(iconsContainer);
    
    container.appendChild(hexagonWrapper);
  });
  
  const descriptionBox = document.getElementById('description-box');
  const descriptionTitle = document.getElementById('description-title');
  const descriptionText = document.getElementById('description-text');
  
  document.querySelectorAll('.svg-wrapper').forEach(hexagon => {
    hexagon.addEventListener('mouseenter', () => {
      const skill = skills.find(s => s.id === hexagon.getAttribute('data-id'));
      descriptionTitle.textContent = skill.text;  // Título de la habilidad
      descriptionText.textContent = skill.description;  // Descripción de la habilidad
  
      descriptionBox.style.display = 'block'; // Muestra la caja en una posición fija
    });
  
    hexagon.addEventListener('mouseleave', () => {
      descriptionBox.style.display = 'none'; // Oculta la caja cuando el ratón se retira del hexágono
    });
  });

}
