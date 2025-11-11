import { MEDICOS_INICIALES } from './data.js'; 

document.addEventListener('DOMContentLoaded', () => {
  const catalogoDiv = document.getElementById('catalogoProfesionales');

  // Mostrar siempre los médicos iniciales primero
  MEDICOS_INICIALES.forEach(medico => {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${medico.foto || './CSS/imagenes/default-doctor.jpg'}" class="card-img-top" alt="${medico.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title">${medico.nombre}</h5>
          <p class="card-text">${medico.especialidad}</p>
          <p class="card-text">${medico.descripcion || 'Sin descripción'}</p>
        </div>
      </div>
    `;
    catalogoDiv.appendChild(card);
  });

  // Luego agregamos los médicos que estén en LocalStorage, si los hay
  const medicosLocal = JSON.parse(localStorage.getItem('medicos')) || [];

  // Evitamos duplicados por id
  const inicialIds = MEDICOS_INICIALES.map(m => m.id);
  medicosLocal.forEach(medico => {
    if (!inicialIds.includes(medico.id)) {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${medico.foto || './CSS/imagenes/default-doctor.jpg'}" class="card-img-top" alt="${medico.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title">${medico.nombre}</h5>
            <p class="card-text">${medico.especialidad}</p>
            <p class="card-text">${medico.descripcion || 'Sin descripción'}</p>
          </div>
        </div>
      `;
      catalogoDiv.appendChild(card);
    }
  });
});