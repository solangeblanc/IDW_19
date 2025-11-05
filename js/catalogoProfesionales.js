document.addEventListener('DOMContentLoaded', () => {
  const catalogoDiv = document.getElementById('catalogoProfesionales');

  // Leer médicos desde LocalStorage
  const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

  if (medicos.length === 0) {
    catalogoDiv.innerHTML = `
      <p class="text-center text-muted">No hay profesionales cargados actualmente.</p>
    `;
    return;
  }

  // Renderizar cards dinámicamente
  medicos.forEach(medico => {
    const card = document.createElement('div');
    card.className = 'col-md-4';

    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${medico.foto || './CSS/imagenes/default-doctor.jpg'}" 
             class="card-img-top" 
             alt="${medico.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title">${medico.nombre}</h5>
          <p class="card-text">${medico.especialidad}</p>
        </div>
      </div>
    `;

    catalogoDiv.appendChild(card);
  });
});