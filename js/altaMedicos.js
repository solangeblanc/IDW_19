const alertaDiv = document.getElementById('alertaMedicos');
const tablaDiv = document.getElementById('medicosRegistrados');

if (!localStorage.getItem('medicos')) {
  localStorage.setItem('medicos', JSON.stringify([]));
}

const medicos = JSON.parse(localStorage.getItem('medicos'));


function mostrarMedicos() {
  const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
  if (medicos.length === 0) {
    tablaDiv.innerHTML = '';
    alertaDiv.innerHTML = '<div class="alerta-mensaje">No hay médicos registrados</div>';
    return;
  }

  alertaDiv.innerHTML = '';
  tablaDiv.innerHTML = `
    <table class="table table-striped">
      <thead><tr><th>Nombre</th><th>Especialidad</th><th>Teléfono</th><th>Obras Sociales</th><th>Email</th></tr></thead>
      <tbody>
        ${medicos.map(m => `
          <tr>
            <td>${m.nombre}</td>
            <td>${m.especialidad}</td>
            <td>${m.telefono}</td>
            <td>${m.obrasSociales}</td>
            <td>${m.email}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  `;
}
mostrarMedicos();