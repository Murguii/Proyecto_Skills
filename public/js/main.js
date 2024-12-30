// main.js

fetch('/skills/api')
    .then(response => response.json())
    .then(data => {
      createHexagons(data);  // Llamamos a la función que creará los hexágonos
    })
    .catch(error => console.error("Error al cargar el JSON", error));

async function createHexagons(skills) {
  const container = document.getElementById('hexagon-container');
  const isAdmin = container.getAttribute('adminValue'); // Devuelve un string en vez de un booleano
  console.log('Admin value: ', isAdmin);

  for (const skill of skills) {
    const pendingCount = await consultarSinVerificar(skill.id); // Pendientes de verificar
    const completedCount = await consultarVerificados(skill.id); // Completados y verificados
    const hexagonWrapper = document.createElement('div');
    hexagonWrapper.classList.add('svg-wrapper');
    hexagonWrapper.setAttribute('data-id', skill.id);
    hexagonWrapper.setAttribute('data-description', skill.description);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '0 0 100 100');

    const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    hexagon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
    hexagon.classList.add('hexagon');

    // Verificar si hay alguna evidencia rechazada y si hay más de una evidencia aprobada
    if (!skill.anyEvidenceRejected && skill.approvedEvidenceCount > 1) {
      hexagon.classList.add('green'); // Añade la clase green
      hexagon.classList.remove('white'); // Quita la clase white si está presente
    } else {
      hexagon.classList.add('white'); // Añade la clase white
      hexagon.classList.remove('green'); // Quita la clase green si está presente
    }

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', '50%');
    text.setAttribute('y', '20%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'black');
    text.setAttribute('font-size', '10');

    // Añade el hexágono primero
    svg.appendChild(hexagon);

    // Círculo rojo (pendientes)
    const evidenceCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    evidenceCircle.setAttribute('cx', '15'); // Coordenada x del centro
    evidenceCircle.setAttribute('cy', '15'); // Coordenada y del centro
    evidenceCircle.setAttribute('r', '10'); // Radio del círculo
    evidenceCircle.setAttribute('fill', 'red'); // Color rojo

    const evidenceText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    evidenceText.setAttribute('x', '15');
    evidenceText.setAttribute('y', '20'); // Ajusta la posición vertical
    evidenceText.setAttribute('text-anchor', 'middle');
    evidenceText.setAttribute('fill', 'white'); // Texto blanco
    evidenceText.setAttribute('font-size', '10');
    evidenceText.setAttribute('font-weight', 'bold');
    evidenceText.textContent = pendingCount || 0;

    svg.appendChild(evidenceCircle);
    svg.appendChild(evidenceText);

    // Círculo verde (completadas)
    const completedCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    completedCircle.setAttribute('cx', '85'); // Coordenada x del centro (derecha)
    completedCircle.setAttribute('cy', '15'); // Coordenada y del centro
    completedCircle.setAttribute('r', '10'); // Radio del círculo
    completedCircle.setAttribute('fill', 'green'); // Color verde

    const completedText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    completedText.setAttribute('x', '85');
    completedText.setAttribute('y', '20'); // Ajusta la posición vertical
    completedText.setAttribute('text-anchor', 'middle');
    completedText.setAttribute('fill', 'white');
    completedText.setAttribute('font-size', '10');
    completedText.setAttribute('font-weight', 'bold');
    completedText.textContent = completedCount || 0;

    svg.appendChild(completedCircle);
    svg.appendChild(completedText);

    // Añade texto descriptivo al SVG
    const lines = skill.text.split("\n\n\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute('x', '50%');
      tspan.setAttribute('dy', '1.2em');
      tspan.setAttribute('font-weight', 'bold');
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    svg.appendChild(text);

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    icon.setAttribute('x', '35%');
    icon.setAttribute('y', '60%');
    icon.setAttribute('width', '30');
    icon.setAttribute('height', '30');
    icon.setAttribute('href', skill.icon);

    svg.appendChild(icon);

    // Crear contenedor para los íconos adicionales (lápiz y cuaderno)
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('icons');

    if (isAdmin === 'true') {
      const pencilIcon = document.createElement('span');
      pencilIcon.classList.add('icon-pencil');
      pencilIcon.textContent = '✏️';

      pencilIcon.addEventListener('click', () => {
        console.log(skill.set);
        console.log(skill.id);
        window.location.href = `/skills/${skill.set}/edit/${skill.id}`; // Redirige a la página para editar la habilidad
      });

      iconsContainer.appendChild(pencilIcon);
    }

    const notebookIcon = document.createElement('span');
    notebookIcon.classList.add('icon-notebook');
    notebookIcon.textContent = '📒';

    // Evento para redirigir a la página del cuaderno
    notebookIcon.addEventListener('click', () => {
      window.location.href = `/skills/${skill.set}/view/${skill.id}`; // Redirige a la página de la habilidad
    });

    iconsContainer.appendChild(notebookIcon);

    hexagonWrapper.appendChild(svg);
    hexagonWrapper.appendChild(iconsContainer);

    container.appendChild(hexagonWrapper);
  }

  const descriptionBox = document.getElementById('description-box');
  const descriptionTitle = document.getElementById('description-title');
  const descriptionText = document.getElementById('description-text');

  document.querySelectorAll('.svg-wrapper').forEach(hexagon => {
    hexagon.addEventListener('mouseenter', () => {
      const skill = skills.find(s => s.id === hexagon.getAttribute('data-id'));
      descriptionTitle.textContent = skill.text; // Título de la habilidad
      descriptionText.textContent = skill.description; // Descripción de la habilidad

      descriptionBox.style.display = 'block'; // Muestra la caja en una posición fija
    });

    hexagon.addEventListener('mouseleave', () => {
      descriptionBox.style.display = 'none'; // Oculta la caja cuando el ratón se retira del hexágono
    });
  });
}

async function consultarSinVerificar(id) {
  try {
    const response = await fetch(`http://localhost:3000/skills/pending-count/${id}`);
    const data = await response.json();
    const count = String(data.count);
    return count;
  } catch (error) {
    console.error('Error al consultar los datos de pendientes:', error);
  }
}

async function consultarVerificados(id) {
  try {
    const response = await fetch(`http://localhost:3000/skills/completed-count/${id}`);
    const data = await response.json();
    const count = String(data.count);
    return count;
  } catch (error) {
    console.error('Error al consultar los datos verificados:', error);
  }
}
/*
fetch('/skills/api')
    .then(response => response.json())
    .then(data => {
      createHexagons(data);  // Llamamos a la función que creará los hexágonos
    })
    .catch(error => console.error("Error al cargar el JSON", error));

async function createHexagons(skills) {
  const container = document.getElementById('hexagon-container');
  const isAdmin = container.getAttribute('adminValue'); // Devuelve un string en vez de un booleano
  console.log('Admin value: ', isAdmin);

  for (const skill of skills) {
    const pendingCount = await consultarSinVerificar(skill.id); // Pendientes de verificar
    const completedCount = await consultarVerificados(skill.id); // Completados y verificados
    const hexagonWrapper = document.createElement('div');
    hexagonWrapper.classList.add('svg-wrapper');
    hexagonWrapper.setAttribute('data-id', skill.id);
    hexagonWrapper.setAttribute('data-description', skill.description);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '0 0 100 100');

    const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    hexagon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
    hexagon.classList.add('hexagon');

    // Verificar si no hay evidencias rechazadas
    if (skill.rejectedEvidences === 0) {
      hexagon.setAttribute('fill', 'green'); // Cambia el color a verde
    }

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', '50%');
    text.setAttribute('y', '20%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'black');
    text.setAttribute('font-size', '10');

    // Añade el hexágono primero
    svg.appendChild(hexagon);

    // Círculo rojo (pendientes)
    const evidenceCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    evidenceCircle.setAttribute('cx', '15'); // Coordenada x del centro
    evidenceCircle.setAttribute('cy', '15'); // Coordenada y del centro
    evidenceCircle.setAttribute('r', '10'); // Radio del círculo
    evidenceCircle.setAttribute('fill', 'red'); // Color rojo

    const evidenceText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    evidenceText.setAttribute('x', '15');
    evidenceText.setAttribute('y', '20'); // Ajusta la posición vertical
    evidenceText.setAttribute('text-anchor', 'middle');
    evidenceText.setAttribute('fill', 'white'); // Texto blanco
    evidenceText.setAttribute('font-size', '10');
    evidenceText.setAttribute('font-weight', 'bold');
    evidenceText.textContent = pendingCount || 0;

    svg.appendChild(evidenceCircle);
    svg.appendChild(evidenceText);

    // Círculo verde (completadas)
    const completedCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    completedCircle.setAttribute('cx', '85'); // Coordenada x del centro (derecha)
    completedCircle.setAttribute('cy', '15'); // Coordenada y del centro
    completedCircle.setAttribute('r', '10'); // Radio del círculo
    completedCircle.setAttribute('fill', 'green'); // Color verde

    const completedText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    completedText.setAttribute('x', '85');
    completedText.setAttribute('y', '20'); // Ajusta la posición vertical
    completedText.setAttribute('text-anchor', 'middle');
    completedText.setAttribute('fill', 'white');
    completedText.setAttribute('font-size', '10');
    completedText.setAttribute('font-weight', 'bold');
    completedText.textContent = completedCount || 0;

    svg.appendChild(completedCircle);
    svg.appendChild(completedText);

    // Añade texto descriptivo al SVG
    const lines = skill.text.split("\n\n\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute('x', '50%');
      tspan.setAttribute('dy', '1.2em');
      tspan.setAttribute('font-weight', 'bold');
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    svg.appendChild(text);

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    icon.setAttribute('x', '35%');
    icon.setAttribute('y', '60%');
    icon.setAttribute('width', '30');
    icon.setAttribute('height', '30');
    icon.setAttribute('href', skill.icon);

    svg.appendChild(icon);

    // Crear contenedor para los íconos adicionales (lápiz y cuaderno)
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('icons');

    if (isAdmin === 'true') {
      const pencilIcon = document.createElement('span');
      pencilIcon.classList.add('icon-pencil');
      pencilIcon.textContent = '✏️';

      pencilIcon.addEventListener('click', () => {
        console.log(skill.set);
        console.log(skill.id);
        window.location.href = `/skills/${skill.set}/edit/${skill.id}`; // Redirige a la página para editar la habilidad
      });

      iconsContainer.appendChild(pencilIcon);
    }

    const notebookIcon = document.createElement('span');
    notebookIcon.classList.add('icon-notebook');
    notebookIcon.textContent = '📒';

    // Evento para redirigir a la página del cuaderno
    notebookIcon.addEventListener('click', () => {
      window.location.href = `/skills/${skill.set}/view/${skill.id}`; // Redirige a la página de la habilidad
    });

    iconsContainer.appendChild(notebookIcon);

    hexagonWrapper.appendChild(svg);
    hexagonWrapper.appendChild(iconsContainer);

    container.appendChild(hexagonWrapper);
  }

  const descriptionBox = document.getElementById('description-box');
  const descriptionTitle = document.getElementById('description-title');
  const descriptionText = document.getElementById('description-text');

  document.querySelectorAll('.svg-wrapper').forEach(hexagon => {
    hexagon.addEventListener('mouseenter', () => {
      const skill = skills.find(s => s.id === hexagon.getAttribute('data-id'));
      descriptionTitle.textContent = skill.text; // Título de la habilidad
      descriptionText.textContent = skill.description; // Descripción de la habilidad

      descriptionBox.style.display = 'block'; // Muestra la caja en una posición fija
    });

    hexagon.addEventListener('mouseleave', () => {
      descriptionBox.style.display = 'none'; // Oculta la caja cuando el ratón se retira del hexágono
    });
  });
}

/*async function createHexagons(skills) {
  const container = document.getElementById('hexagon-container');
  const isAdmin = container.getAttribute('adminValue'); // Devuelve un string en vez de un booleano
  console.log('Admin value: ', isAdmin);

  for (const skill of skills) {
    const pendingCount = await consultarSinVerificar(skill.id); // Pendientes de verificar
    const completedCount = await consultarVerificados(skill.id); // Completados y verificados
    const hexagonWrapper = document.createElement('div');
    hexagonWrapper.classList.add('svg-wrapper');
    hexagonWrapper.setAttribute('data-id', skill.id);
    hexagonWrapper.setAttribute('data-description', skill.description);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '0 0 100 100');

    const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    hexagon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
    hexagon.classList.add('hexagon');

    if (skill.allEvidencesApproved) {
      hexagon.setAttribute('fill', 'green'); // Cambia el color a verde
    }

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', '50%');
    text.setAttribute('y', '20%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'black');
    text.setAttribute('font-size', '10');

    // Añade el hexágono primero
    svg.appendChild(hexagon);

    // Círculo rojo (pendientes)
    const evidenceCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    evidenceCircle.setAttribute('cx', '15'); // Coordenada x del centro
    evidenceCircle.setAttribute('cy', '15'); // Coordenada y del centro
    evidenceCircle.setAttribute('r', '10'); // Radio del círculo
    evidenceCircle.setAttribute('fill', 'red'); // Color rojo

    const evidenceText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    evidenceText.setAttribute('x', '15');
    evidenceText.setAttribute('y', '20'); // Ajusta la posición vertical
    evidenceText.setAttribute('text-anchor', 'middle');
    evidenceText.setAttribute('fill', 'white'); // Texto blanco
    evidenceText.setAttribute('font-size', '10');
    evidenceText.setAttribute('font-weight', 'bold');
    evidenceText.textContent = pendingCount || 0;

    svg.appendChild(evidenceCircle);
    svg.appendChild(evidenceText);

    // Círculo verde (completadas)
    const completedCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    completedCircle.setAttribute('cx', '85'); // Coordenada x del centro (derecha)
    completedCircle.setAttribute('cy', '15'); // Coordenada y del centro
    completedCircle.setAttribute('r', '10'); // Radio del círculo
    completedCircle.setAttribute('fill', 'green'); // Color verde

    const completedText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    completedText.setAttribute('x', '85');
    completedText.setAttribute('y', '20'); // Ajusta la posición vertical
    completedText.setAttribute('text-anchor', 'middle');
    completedText.setAttribute('fill', 'white');
    completedText.setAttribute('font-size', '10');
    completedText.setAttribute('font-weight', 'bold');
    completedText.textContent = completedCount || 0;

    svg.appendChild(completedCircle);
    svg.appendChild(completedText);

    // Añade texto descriptivo al SVG
    const lines = skill.text.split("\n\n\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute('x', '50%');
      tspan.setAttribute('dy', '1.2em');
      tspan.setAttribute('font-weight', 'bold');
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    svg.appendChild(text);

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    icon.setAttribute('x', '35%');
    icon.setAttribute('y', '60%');
    icon.setAttribute('width', '30');
    icon.setAttribute('height', '30');
    icon.setAttribute('href', skill.icon);

    svg.appendChild(icon);

    // Crear contenedor para los íconos adicionales (lápiz y cuaderno)
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('icons');

    if (isAdmin === 'true') {
      const pencilIcon = document.createElement('span');
      pencilIcon.classList.add('icon-pencil');
      pencilIcon.textContent = '✏️';

      pencilIcon.addEventListener('click', () => {
        console.log(skill.set);
        console.log(skill.id);
        window.location.href = `/skills/${skill.set}/edit/${skill.id}`; // Redirige a la página para editar la habilidad
      });

      iconsContainer.appendChild(pencilIcon);
    }

    const notebookIcon = document.createElement('span');
    notebookIcon.classList.add('icon-notebook');
    notebookIcon.textContent = '📒';

    // Evento para redirigir a la página del cuaderno
    notebookIcon.addEventListener('click', () => {
      window.location.href = `/skills/${skill.set}/view/${skill.id}`; // Redirige a la página de la habilidad
    });

    iconsContainer.appendChild(notebookIcon);

    hexagonWrapper.appendChild(svg);
    hexagonWrapper.appendChild(iconsContainer);

    container.appendChild(hexagonWrapper);
  }

  const descriptionBox = document.getElementById('description-box');
  const descriptionTitle = document.getElementById('description-title');
  const descriptionText = document.getElementById('description-text');

  document.querySelectorAll('.svg-wrapper').forEach(hexagon => {
    hexagon.addEventListener('mouseenter', () => {
      const skill = skills.find(s => s.id === hexagon.getAttribute('data-id'));
      descriptionTitle.textContent = skill.text; // Título de la habilidad
      descriptionText.textContent = skill.description; // Descripción de la habilidad

      descriptionBox.style.display = 'block'; // Muestra la caja en una posición fija
    });

    hexagon.addEventListener('mouseleave', () => {
      descriptionBox.style.display = 'none'; // Oculta la caja cuando el ratón se retira del hexágono
    });
  });
}*/
/*
async function consultarSinVerificar(id) {
  try {
    const response = await fetch(`http://localhost:3000/skills/pending-count/${id}`);
    const data = await response.json();
    const count = String(data.count);
    return count;
  } catch (error) {
    console.error('Error al consultar los datos de pendientes:', error);
  }
}

async function consultarVerificados(id) {
  try {
    const response = await fetch(`http://localhost:3000/skills/completed-count/${id}`);
    const data = await response.json();
    const count = String(data.count);
    return count;
  } catch (error) {
    console.error('Error al consultar los datos verificados:', error);
  }
}

// loadEvidences
async function loadEvidencesInTable() {
  fetch(`/skills/getEvidences/${skillId}`)
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById('evidenceTableBody');
        tableBody.innerHTML = ''; // Limpia cualquier fila existente

        data.evidences.forEach(evidence => {
          const row = document.createElement('tr');

          const userColumn = document.createElement('td');
          userColumn.textContent = data.username; // Asegúrate de que 'user' es una propiedad de la evidencia
          row.appendChild(userColumn);

          const evidenceColumn = document.createElement('td');
          evidenceColumn.textContent = evidence.evidence; // Asegúrate de que 'description' es una propiedad de la evidencia
          row.appendChild(evidenceColumn);

          // Crear la celda donde estarán los botones de aceptar y rechazar
          let actionData = document.createElement('td');
          actionData.className = 'buttonTd';

          let acceptButton = document.createElement('button');
          acceptButton.textContent = 'Approve';
          acceptButton.className = 'acceptButton';
          acceptButton.addEventListener('click', () => {
            fetch(`/skills/approveEvidence/${skillId}/${evidence._id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: null
            })
                .then(response => response.json())
                .then(data => {
                  console.log('Success:', data);
                  loadEvidencesInTable(); // Recargar la tabla después de la aprobación
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
          });

          let rejectButton = document.createElement('button');
          rejectButton.textContent = 'Reject';
          rejectButton.className = 'rejectButton';
          rejectButton.addEventListener('click', () => {
            fetch(`/skills/rejectEvidence/${skillId}/${evidence._id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: null
            })
                .then(response => response.json())
                .then(data => {
                  console.log('Success:', data);
                  loadEvidencesInTable(); // Recargar la tabla después del rechazo
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
          });

          // Añadir los botones a la celda
          actionData.appendChild(acceptButton);
          actionData.appendChild(rejectButton);
          row.appendChild(actionData);

          // Añadir la fila a la tabla
          tableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error al cargar las evidencias:', error));
}



// main.js
/*fetch('/skills/api')
  .then(response => response.json())
  .then(data => {
    createHexagons(data);  // Llamamos a la función que creará los hexágonos
  })
  .catch(error => console.error("Error al cargar el JSON", error));


async function createHexagons(skills) {
  const container = document.getElementById('hexagon-container');
  const isAdmin = container.getAttribute('adminValue'); // Devuelve un string en vez de un booleano
  console.log('Admin value: ', isAdmin);

  for (const skill of skills) {
    const pendingCount = await consultarSinVerificar(skill.id); // Pendientes de verificar
    const completedCount = await consultarVerificados(skill.id); // Completados y verificados
    const hexagonWrapper = document.createElement('div');
    hexagonWrapper.classList.add('svg-wrapper');
    hexagonWrapper.setAttribute('data-id', skill.id);
    hexagonWrapper.setAttribute('data-description', skill.description);

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

    // Añade el hexágono primero
    svg.appendChild(hexagon);

    // Círculo rojo (pendientes)
    const evidenceCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    evidenceCircle.setAttribute('cx', '15'); // Coordenada x del centro
    evidenceCircle.setAttribute('cy', '15'); // Coordenada y del centro
    evidenceCircle.setAttribute('r', '10'); // Radio del círculo
    evidenceCircle.setAttribute('fill', 'red'); // Color rojo

    const evidenceText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    evidenceText.setAttribute('x', '15');
    evidenceText.setAttribute('y', '20'); // Ajusta la posición vertical
    evidenceText.setAttribute('text-anchor', 'middle');
    evidenceText.setAttribute('fill', 'white'); // Texto blanco
    evidenceText.setAttribute('font-size', '10');
    evidenceText.setAttribute('font-weight', 'bold');
    evidenceText.textContent = pendingCount || 0;

    svg.appendChild(evidenceCircle);
    svg.appendChild(evidenceText);

    // Círculo verde (completadas)
    const completedCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    completedCircle.setAttribute('cx', '85'); // Coordenada x del centro (derecha)
    completedCircle.setAttribute('cy', '15'); // Coordenada y del centro
    completedCircle.setAttribute('r', '10'); // Radio del círculo
    completedCircle.setAttribute('fill', 'green'); // Color verde

    const completedText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    completedText.setAttribute('x', '85');
    completedText.setAttribute('y', '20'); // Ajusta la posición vertical
    completedText.setAttribute('text-anchor', 'middle');
    completedText.setAttribute('fill', 'white');
    completedText.setAttribute('font-size', '10');
    completedText.setAttribute('font-weight', 'bold');
    completedText.textContent = completedCount || 0;

    svg.appendChild(completedCircle);
    svg.appendChild(completedText);

    // Añade texto descriptivo al SVG
    const lines = skill.text.split("\n\n\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute('x', '50%');
      tspan.setAttribute('dy', '1.2em');
      tspan.setAttribute('font-weight', 'bold');
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    svg.appendChild(text);

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    icon.setAttribute('x', '35%');
    icon.setAttribute('y', '60%');
    icon.setAttribute('width', '30');
    icon.setAttribute('height', '30');
    icon.setAttribute('href', skill.icon);

    svg.appendChild(icon);

    // Crear contenedor para los íconos adicionales (lápiz y cuaderno)
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('icons');

    if (isAdmin === 'true') {
      const pencilIcon = document.createElement('span');
      pencilIcon.classList.add('icon-pencil');
      pencilIcon.textContent = '✏️';

      pencilIcon.addEventListener('click', () => {
        console.log(skill.set);
        console.log(skill.id);
        window.location.href = `/skills/${skill.set}/edit/${skill.id}`; // Redirige a la página para editar la habilidad
      });

      iconsContainer.appendChild(pencilIcon);
    }

    const notebookIcon = document.createElement('span');
    notebookIcon.classList.add('icon-notebook');
    notebookIcon.textContent = '📒';

    // Evento para redirigir a la página del cuaderno
    notebookIcon.addEventListener('click', () => {
      window.location.href = `/skills/${skill.set}/view/${skill.id}`; // Redirige a la página de la habilidad
    });

    iconsContainer.appendChild(notebookIcon);

    hexagonWrapper.appendChild(svg);
    hexagonWrapper.appendChild(iconsContainer);

    container.appendChild(hexagonWrapper);
  }

  const descriptionBox = document.getElementById('description-box');
  const descriptionTitle = document.getElementById('description-title');
  const descriptionText = document.getElementById('description-text');

  document.querySelectorAll('.svg-wrapper').forEach(hexagon => {
    hexagon.addEventListener('mouseenter', () => {
      const skill = skills.find(s => s.id === hexagon.getAttribute('data-id'));
      descriptionTitle.textContent = skill.text; // Título de la habilidad
      descriptionText.textContent = skill.description; // Descripción de la habilidad

      descriptionBox.style.display = 'block'; // Muestra la caja en una posición fija
    });

    hexagon.addEventListener('mouseleave', () => {
      descriptionBox.style.display = 'none'; // Oculta la caja cuando el ratón se retira del hexágono
    });
  });
}


async function consultarSinVerificar(id) {
  try {
      const response = await fetch(`http://localhost:3000/skills/pending-count/${id}`);

      // Asegúrate de que la respuesta es en formato JSON
      const data = await response.json();

    const count = String(data.count);
    //console.log('Total de elementos con completed=true y verified=true:', count);
    return count;
      // Aquí puedes hacer lo que necesites con `data.count`
  } catch (error) {
      console.error('Error al consultar los datos de pendientes:', error);
  }
}

async function consultarVerificados(id) {
  try {
      const response = await fetch(`http://localhost:3000/skills/completed-count/${id}`);

      // Asegúrate de que la respuesta es en formato JSON
      const data = await response.json();

      const count = String(data.count);
      //console.log('Total de elementos con completed=true y verified=true:', count);
      return count;
      // Aquí puedes hacer lo que necesites con `data.count`
  } catch (error) {
      console.error('Error al consultar los datos verificados:', error);
  }
}

*/