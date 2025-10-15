import { MEDICOS_INICIALES } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Selecciones
  const formMedico = document.getElementById('formAltaMedico');
  const tbodyMedicos = document.getElementById('medicosRegistrados');
  const alertaMedicosDiv = document.getElementById('alertaMedicos');

  const formEspecialidad = document.getElementById('formEspecialidad');
  const inputNuevaEspecialidad = document.getElementById('nuevaEspecialidad');
  const listaEspecialidadesUl = document.getElementById('listaEspecialidades');
  const alertaEspecialidadesDiv = document.createElement('div');
  alertaEspecialidadesDiv.className = 'text-center my-2';
  formEspecialidad.parentNode.insertBefore(alertaEspecialidadesDiv, formEspecialidad.nextSibling);

  // Inicializar LocalStorage
  if (!localStorage.getItem('medicos')) {
    localStorage.setItem('medicos', JSON.stringify(MEDICOS_INICIALES));
  }
  let medicos = JSON.parse(localStorage.getItem('medicos'));

  let especialidades = [];
  // Cargar especialidades desde médicos existentes
  medicos.forEach(med => {
    if (!especialidades.includes(med.especialidad)) {
      especialidades.push(med.especialidad);
    }
  });

  // Guardar en LocalStorage
  function guardarLocalStorage() {
    localStorage.setItem('medicos', JSON.stringify(medicos));
  }

  // Mostrar alertas
  function mostrarAlerta(mensaje, contenedor) {
    contenedor.innerHTML = `<div class="alerta-mensaje">${mensaje}</div>`;
    setTimeout(() => contenedor.innerHTML = '', 5000);
  }

  // Mostrar médicos en tabla
  function mostrarMedicos() {
    if (medicos.length === 0) {
      tbodyMedicos.innerHTML = '<tr><td colspan="6" class="text-center">No hay médicos registrados</td></tr>';
      return;
    }

    tbodyMedicos.innerHTML = medicos.map((medico, index) => `
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
`).join('');

  }

  // Mostrar especialidades
  function mostrarEspecialidades() {
    listaEspecialidadesUl.innerHTML = '';
    especialidades.sort((a, b) => a.localeCompare(b)).forEach((esp, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = esp;

      const btnBorrar = document.createElement('button');
      btnBorrar.className = 'btn btn-sm btn-danger';
      btnBorrar.textContent = 'Eliminar';
      btnBorrar.addEventListener('click', () => {
        if (confirm(`¿Seguro que quieres eliminar la especialidad "${esp}"?`)) {
          especialidades.splice(index, 1);
          mostrarEspecialidades();
          mostrarAlerta('🗑️ Especialidad eliminada', alertaEspecialidadesDiv);
        }
      });

      li.appendChild(btnBorrar);
      listaEspecialidadesUl.appendChild(li);
    });
  }

  // Agregar médico
  function agregarMedico(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const obrasSociales = document.getElementById('obrasSociales').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!nombre || !especialidad || !telefono || !obrasSociales || !email) {
      mostrarAlerta("⚠️ Todos los campos son obligatorios.", alertaMedicosDiv);
      return;
    }

    // Foto genérica para nuevos médicos
    const nuevoMedico = { 
      nombre, 
      especialidad, 
      telefono, 
      obrasSociales, 
      email,
      foto: './CSS/imagenes/default-doctor.jpg'
    };

    medicos.push(nuevoMedico);
    guardarLocalStorage();
    mostrarMedicos();
    formMedico.reset();
    mostrarAlerta("✅ Médico registrado correctamente.", alertaMedicosDiv);

    // Agregar especialidad automáticamente si no existe
    if (!especialidades.includes(especialidad)) {
      especialidades.push(especialidad);
      mostrarEspecialidades();
    }
  }

  // Agregar especialidad manual
  function agregarEspecialidad(e) {
    e.preventDefault();
    let nuevaEsp = inputNuevaEspecialidad.value.trim();

    if (!nuevaEsp || nuevaEsp.length < 5 || nuevaEsp[0] !== nuevaEsp[0].toUpperCase()) {
      mostrarAlerta("⚠️ La especialidad debe empezar con mayúscula y tener más de 4 letras.", alertaEspecialidadesDiv);
      return;
    }

    if (especialidades.includes(nuevaEsp)) {
      mostrarAlerta("⚠️ Esta especialidad ya está en la lista.", alertaEspecialidadesDiv);
      return;
    }

    especialidades.push(nuevaEsp);
    mostrarEspecialidades();
    inputNuevaEspecialidad.value = '';
    mostrarAlerta("✅ Especialidad agregada.", alertaEspecialidadesDiv);
  }

  // Eliminar médico
  window.eliminarMedico = function(index) {
    if (confirm('¿Seguro que quieres eliminar este médico?')) {
      medicos.splice(index, 1);
      guardarLocalStorage();
      mostrarMedicos();
      mostrarAlerta("🗑️ Médico eliminado.", alertaMedicosDiv);
    }
  }

  // Editar médico
  window.editarMedico = function(index) {
    const medico = medicos[index];
    document.getElementById('nombre').value = medico.nombre;
    document.getElementById('especialidad').value = medico.especialidad;
    document.getElementById('telefono').value = medico.telefono;
    document.getElementById('obrasSociales').value = medico.obrasSociales;
    document.getElementById('email').value = medico.email;

    formMedico.removeEventListener('submit', agregarMedico);

    function actualizarMedico(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value.trim();
      const especialidad = document.getElementById('especialidad').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const obrasSociales = document.getElementById('obrasSociales').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!nombre || !especialidad || !telefono || !obrasSociales || !email) {
        mostrarAlerta("⚠️ Todos los campos son obligatorios.", alertaMedicosDiv);
        return;
      }

      medicos[index] = { 
        nombre, 
        especialidad, 
        telefono, 
        obrasSociales, 
        email,
        foto: medico.foto || './CSS/imagenes/default-doctor.jpg'
      };

      guardarLocalStorage();
      mostrarMedicos();
      formMedico.reset();
      mostrarAlerta("✏️ Médico actualizado correctamente.", alertaMedicosDiv);

      // Agregar especialidad si no existe
      if (!especialidades.includes(especialidad)) {
        especialidades.push(especialidad);
        mostrarEspecialidades();
      }

      formMedico.removeEventListener('submit', actualizarMedico);
      formMedico.addEventListener('submit', agregarMedico);
    }

    formMedico.addEventListener('submit', actualizarMedico);
  }

  // Eventos submit
  formMedico.addEventListener('submit', agregarMedico);
  formEspecialidad.addEventListener('submit', agregarEspecialidad);

  // Mostrar al cargar
  mostrarMedicos();
  mostrarEspecialidades();
});