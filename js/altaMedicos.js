// Selecciones
const form = document.getElementById('formAltaMedico');
const tabla = document.getElementById('medicosRegistrados');
const alertaDiv = document.getElementById('alertaMedicos');

// Inicializar LocalStorage si no existe
if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify([]));
}

let medicos = JSON.parse(localStorage.getItem('medicos'));

// Guardar en LocalStorage
function guardarLocalStorage() {
  localStorage.setItem('medicos', JSON.stringify(medicos));
}

// Mostrar alerta
function mostrarAlerta(mensaje) {
  alertaDiv.innerHTML = `<div class="alerta-mensaje" style="background:#fff3cd; padding:10px; border:1px solid #ffeeba;">${mensaje}</div>`;
  setTimeout(() => alertaDiv.innerHTML = '', 3000);
}

// Mostrar médicos en tabla
function mostrarMedicos() {
  tabla.innerHTML = '';

  if (medicos.length === 0) {
    alertaDiv.innerHTML = '<div class="alerta-mensaje">No hay médicos registrados</div>';
    return;
  }

  tabla.innerHTML = `
    <table class="table table-striped table-bordered">
      <thead class="table-primary">
        <tr>
          <th>Nombre</th>
          <th>Especialidad</th>
          <th>Teléfono</th>
          <th>Obras Sociales</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${medicos.map((medico, index) => `
          <tr>
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.obrasSociales}</td>
            <td>${medico.email}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" onclick="editarMedico(${index})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${index})">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Agregar médico con validación
function agregarMedico(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const especialidad = document.getElementById('especialidad').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const obrasSociales = document.getElementById('obrasSociales').value.trim();
  const email = document.getElementById('email').value.trim();

  // Validación: todos los campos son obligatorios
  if (!nombre || !especialidad || !telefono || !obrasSociales || !email) {
    mostrarAlerta("⚠️ Todos los campos son obligatorios.");
    return;
  }

  const nuevoMedico = { nombre, especialidad, telefono, obrasSociales, email };
  medicos.push(nuevoMedico);
  guardarLocalStorage();
  mostrarMedicos();
  form.reset();
  mostrarAlerta("✅ Médico registrado correctamente.");
}

// Agregar médico
form.addEventListener('submit', agregarMedico);

// Funciones editar y eliminar
window.eliminarMedico = function(index) {
  if (confirm('¿Seguro que quieres eliminar este médico?')) {
    medicos.splice(index, 1);
    guardarLocalStorage();
    mostrarMedicos();
    mostrarAlerta("🗑️ Médico eliminado.");
  }
}

window.editarMedico = function(index) {
  const medico = medicos[index];
  document.getElementById('nombre').value = medico.nombre;
  document.getElementById('especialidad').value = medico.especialidad;
  document.getElementById('telefono').value = medico.telefono;
  document.getElementById('obrasSociales').value = medico.obrasSociales;
  document.getElementById('email').value = medico.email;

  // Cambiar submit para actualizar en vez de agregar
  form.removeEventListener('submit', agregarMedico);

  function actualizarMedico(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const obrasSociales = document.getElementById('obrasSociales').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validación
    if (!nombre || !especialidad || !telefono || !obrasSociales || !email) {
      mostrarAlerta("⚠️ Todos los campos son obligatorios.");
      return;
    }

    medicos[index] = { nombre, especialidad, telefono, obrasSociales, email };
    guardarLocalStorage();
    mostrarMedicos();
    form.reset();
    mostrarAlerta("✏️ Médico actualizado correctamente.");

    form.removeEventListener('submit', actualizarMedico);
    form.addEventListener('submit', agregarMedico);
  }

  form.addEventListener('submit', actualizarMedico);
}

// Mostrar médicos al cargar la página
mostrarMedicos();