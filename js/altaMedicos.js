import { MEDICOS_INICIALES } from './data.js';

document.addEventListener('DOMContentLoaded', () => {

  /*** ELEMENTOS DOM ***/
  const formMedico = document.getElementById('formAltaMedico');
  const tbodyMedicos = document.getElementById('medicosRegistrados');
  const alertaMedicosDiv = document.getElementById('alertaMedicos');

  const formEspecialidad = document.getElementById('formEspecialidad');
  const inputNuevaEspecialidad = document.getElementById('nuevaEspecialidad');
  const listaEspecialidadesUl = document.getElementById('listaEspecialidades');
  const alertaEspecialidadesDiv = document.getElementById('alertaEspecialidades');

  const formTurno = document.getElementById('formAltaTurno');
  const selectMedicoTurno = document.getElementById('medicoTurno');
  const selectEspecialidadTurno = document.getElementById('especialidadTurno');
  const tbodyTurnos = document.getElementById('turnosRegistrados');
  const alertaTurnosDiv = document.getElementById('alertaTurnos');

  /*** LOCAL STORAGE ***/
  if (!localStorage.getItem('medicos')) localStorage.setItem('medicos', JSON.stringify(MEDICOS_INICIALES));
  let medicos = JSON.parse(localStorage.getItem('medicos'));

  let especialidades = [];
  medicos.forEach(m => { if (!especialidades.includes(m.especialidad)) especialidades.push(m.especialidad); });

  let turnos = localStorage.getItem('turnos') ? JSON.parse(localStorage.getItem('turnos')) : [];

  /*** FUNCIONES AUXILIARES ***/
  function guardarMedicos() { localStorage.setItem('medicos', JSON.stringify(medicos)); }
  function guardarTurnos() { localStorage.setItem('turnos', JSON.stringify(turnos)); }

  function mostrarAlerta(mensaje, contenedor) {
    contenedor.innerHTML = `<div class="alerta-mensaje">${mensaje}</div>`;
    setTimeout(() => contenedor.innerHTML = '', 5000);
  }

  /*** MÉDICOS ***/
  function mostrarMedicos() {
    tbodyMedicos.innerHTML = medicos.length ? medicos.map((med, idx) => `
      <tr>
        <td>${med.nombre}</td>
        <td>${med.especialidad}</td>
        <td>${med.telefono}</td>
        <td>${med.obrasSociales}</td>
        <td>${med.email}</td>
        <td>
          <button class="btn btn-warning btn-sm me-2" onclick="editarMedico(${idx})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${idx})">Eliminar</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="6" class="text-center">No hay médicos registrados</td></tr>`;
    actualizarSelectsTurnos();
  }

  /*** ESPECIALIDADES ***/
  function mostrarEspecialidades() {
    listaEspecialidadesUl.innerHTML = '';
    especialidades.sort().forEach((esp, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = esp;
      const btnBorrar = document.createElement('button');
      btnBorrar.className = 'btn btn-sm btn-danger';
      btnBorrar.textContent = 'Eliminar';
      btnBorrar.addEventListener('click', () => {
        if (confirm(`¿Eliminar especialidad "${esp}"?`)) {
          especialidades.splice(idx, 1);
          mostrarEspecialidades();
          mostrarAlerta('🗑️ Especialidad eliminada', alertaEspecialidadesDiv);
        }
      });
      li.appendChild(btnBorrar);
      listaEspecialidadesUl.appendChild(li);
    });
    actualizarSelectsTurnos();
  }

  /*** TURNOS ***/
  function actualizarSelectsTurnos() {
    if (selectMedicoTurno) {
      selectMedicoTurno.innerHTML = '<option value="">Seleccione...</option>';
      medicos.forEach(m => { const opt = document.createElement('option'); opt.value = m.nombre; opt.textContent = m.nombre; selectMedicoTurno.appendChild(opt); });
    }
    if (selectEspecialidadTurno) {
      selectEspecialidadTurno.innerHTML = '<option value="">Seleccione...</option>';
      especialidades.forEach(e => { const opt = document.createElement('option'); opt.value = e; opt.textContent = e; selectEspecialidadTurno.appendChild(opt); });
    }
  }

  function mostrarTurnos() {
  const turnosValidos = turnos.filter(t => t != null);
  tbodyTurnos.innerHTML = turnosValidos.length
    ? turnosValidos.map((t, idx) => `
      <tr>
        <td>${t.paciente}</td>
        <td>${t.medico}</td>
        <td>${t.especialidad}</td>
        <td>${t.fecha}</td>
        <td>${t.hora}</td>
        <td>
          <button class="btn btn-warning btn-sm me-2" onclick="editarTurno(${idx})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${idx})">Eliminar</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="6" class="text-center">No hay turnos registrados</td></tr>`;
}

  /*** CRUD MÉDICOS ***/
  function agregarMedico(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const obrasSociales = document.getElementById('obrasSociales').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!nombre || !especialidad || !telefono || !obrasSociales || !email) { mostrarAlerta("⚠️ Todos los campos son obligatorios.", alertaMedicosDiv); return; }
    const nuevoMedico = { nombre, especialidad, telefono, obrasSociales, email, foto: './CSS/imagenes/default-doctor.jpg' };
    medicos.push(nuevoMedico);
    if (!especialidades.includes(especialidad)) especialidades.push(especialidad);
    guardarMedicos();
    mostrarMedicos();
    mostrarEspecialidades();
    formMedico.reset();
    mostrarAlerta("✅ Médico registrado correctamente.", alertaMedicosDiv);
  }

 window.eliminarTurno = function(idx) {
  if (confirm('¿Eliminar este turno?')) {
    turnos.splice(idx, 1);  // correcta
    guardarTurnos();
    mostrarTurnos();
    mostrarAlerta('🗑️ Turno eliminado.', alertaTurnosDiv);
  }
}

  window.editarMedico = function(idx) {
    const med = medicos[idx];
    document.getElementById('nombre').value = med.nombre;
    document.getElementById('especialidad').value = med.especialidad;
    document.getElementById('telefono').value = med.telefono;
    document.getElementById('obrasSociales').value = med.obrasSociales;
    document.getElementById('email').value = med.email;

    formMedico.removeEventListener('submit', agregarMedico);

    function actualizar(e) {
      e.preventDefault();
      medicos[idx] = {
        nombre: document.getElementById('nombre').value.trim(),
        especialidad: document.getElementById('especialidad').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        obrasSociales: document.getElementById('obrasSociales').value.trim(),
        email: document.getElementById('email').value.trim(),
        foto: med.foto
      };
      if (!especialidades.includes(medicos[idx].especialidad)) especialidades.push(medicos[idx].especialidad);
      guardarMedicos();
      mostrarMedicos();
      mostrarEspecialidades();
      formMedico.reset();
      mostrarAlerta("✏️ Médico actualizado correctamente.", alertaMedicosDiv);
      formMedico.removeEventListener('submit', actualizar);
      formMedico.addEventListener('submit', agregarMedico);
    }

    formMedico.addEventListener('submit', actualizar);
  }

    window.eliminarMedico = function(idx) {
    if (confirm('¿Eliminar este médico?')) {
      medicos.splice(idx, 1);
      guardarMedicos();
      mostrarMedicos();
      mostrarAlerta('🗑️ Médico eliminado.', alertaMedicosDiv);
    }
  }

  /*** CRUD ESPECIALIDADES ***/
  let editEspecialidadIndex = null; // índice de edición activo

function mostrarEspecialidades() {
  listaEspecialidadesUl.innerHTML = '';
  especialidades.sort().forEach((esp, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const spanTexto = document.createElement('span');
    spanTexto.textContent = esp;

    const divBotones = document.createElement('div');

    // Botón Editar
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-sm btn-warning me-2';
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => {
      inputNuevaEspecialidad.value = esp; // cargar en input
      editEspecialidadIndex = idx; // guardar índice
    });

    // Botón Eliminar
    const btnBorrar = document.createElement('button');
    btnBorrar.className = 'btn btn-sm btn-danger';
    btnBorrar.textContent = 'Eliminar';
    btnBorrar.addEventListener('click', () => {
      if (confirm(`¿Eliminar especialidad "${esp}"?`)) {
        especialidades.splice(idx, 1);
        mostrarEspecialidades();
        mostrarAlerta('🗑️ Especialidad eliminada.', alertaEspecialidadesDiv);
      }
    });

    divBotones.appendChild(btnEditar);
    divBotones.appendChild(btnBorrar);

    li.appendChild(spanTexto);
    li.appendChild(divBotones);
    listaEspecialidadesUl.appendChild(li);
  });
}

// Modificar el submit del form para soportar edición
function agregarEspecialidad(e) {
  e.preventDefault();
  let esp = inputNuevaEspecialidad.value.trim();
  if (!esp || esp.length < 5 || esp[0] !== esp[0].toUpperCase()) {
    mostrarAlerta("⚠️ La especialidad debe empezar con mayúscula y tener más de 4 letras.", alertaEspecialidadesDiv);
    return;
  }

  if (editEspecialidadIndex !== null) {
    especialidades[editEspecialidadIndex] = esp;
    editEspecialidadIndex = null;
    mostrarAlerta("✏️ Especialidad actualizada.", alertaEspecialidadesDiv);
  } else {
    if (especialidades.includes(esp)) {
      mostrarAlerta("⚠️ Esta especialidad ya está en la lista.", alertaEspecialidadesDiv);
      return;
    }
    especialidades.push(esp);
    mostrarAlerta("✅ Especialidad agregada.", alertaEspecialidadesDiv);
  }

  inputNuevaEspecialidad.value = '';
  mostrarEspecialidades();
}

  /*** CRUD TURNOS COMPLETO ***/
  function agregarTurno(e) {
  e.preventDefault();

  const paciente = document.getElementById('nombrePaciente').value.trim();
  const medico = selectMedicoTurno.value;
  const especialidad = selectEspecialidadTurno.value;
  const fecha = document.getElementById('fechaTurno').value;
  const hora = document.getElementById('horaTurno').value;

  // Validaciones del nombre del paciente
  const palabras = paciente.split(' ').filter(p => p.length > 0);
  const nombreValido = palabras.length >= 2 && palabras.every(p => /^[A-ZÁÉÍÓÚÑ]/.test(p)) && paciente.replace(/\s/g,'').length > 4;
  if (!nombreValido) {
    mostrarAlerta("⚠️ El nombre del paciente debe tener al menos dos palabras, comenzar con mayúscula y tener más de 4 letras.", alertaTurnosDiv);
    return;
  }

  // Campos obligatorios
  if (!medico || !especialidad || !fecha || !hora) {
    mostrarAlerta("⚠️ Complete todos los campos.", alertaTurnosDiv);
    return;
  }

  // Validación de horario primero
  const [h, m] = hora.split(':').map(Number);
  if (h < 8 || h > 20) {
    mostrarAlerta("⚠️ La hora del turno debe estar entre las 08:00 y las 20:00.", alertaTurnosDiv);
    return;
  }

  // Validación de fecha y hora combinadas
  const fechaHora = new Date(`${fecha}T${hora}`);
  const ahora = new Date();
  if (fechaHora < ahora) {
    mostrarAlerta("⚠️ La fecha y hora del turno no pueden ser anteriores a la actual.", alertaTurnosDiv);
    return;
  }

  if (fechaHora.getFullYear() > 2030) {
    mostrarAlerta("⚠️ El año del turno no puede ser mayor a 2030.", alertaTurnosDiv);
    return;
  }

  // Edición de turno
  if (formTurno.dataset.editIndex !== undefined) {
    const idx = formTurno.dataset.editIndex;
    turnos[idx] = { paciente, medico, especialidad, fecha, hora };
    mostrarAlerta("✏️ Turno actualizado correctamente.", alertaTurnosDiv);
    delete formTurno.dataset.editIndex;
    formTurno.removeEventListener('submit', actualizarTurnoListener);
    formTurno.addEventListener('submit', agregarTurno);
  } else {
    turnos.push({ paciente, medico, especialidad, fecha, hora });
    mostrarAlerta("✅ Turno registrado.", alertaTurnosDiv);
  }

  guardarTurnos();
  mostrarTurnos();
  formTurno.reset();
}

  // Listener de edición temporal
  let actualizarTurnoListener;

  window.editarTurno = function(idx) {
    const t = turnos[idx];
    document.getElementById('nombrePaciente').value = t.paciente;
    selectMedicoTurno.value = t.medico;
    selectEspecialidadTurno.value = t.especialidad;
    document.getElementById('fechaTurno').value = t.fecha;
    document.getElementById('horaTurno').value = t.hora;

    formTurno.removeEventListener('submit', agregarTurno);
    formTurno.dataset.editIndex = idx;

    actualizarTurnoListener = function(e) {
      e.preventDefault();
      turnos[idx] = {
        paciente: document.getElementById('nombrePaciente').value.trim(),
        medico: selectMedicoTurno.value,
        especialidad: selectEspecialidadTurno.value,
        fecha: document.getElementById('fechaTurno').value,
        hora: document.getElementById('horaTurno').value
      };
      guardarTurnos();
      mostrarTurnos();
      formTurno.reset();
      mostrarAlerta("✏️ Turno actualizado correctamente.", alertaTurnosDiv);
      delete formTurno.dataset.editIndex;
      formTurno.removeEventListener('submit', actualizarTurnoListener);
      formTurno.addEventListener('submit', agregarTurno);
    };

    formTurno.addEventListener('submit', actualizarTurnoListener);
  }

  window.eliminarTurno = function(idx) {
    if (confirm('¿Eliminar este turno?')) { turnos.splice(idx, 1); guardarTurnos(); mostrarTurnos(); mostrarAlerta('🗑️ Turno eliminado.', alertaTurnosDiv); }
  }

  /*** AUTOCOMPLETE CRUZADO ***/
  if (selectMedicoTurno && selectEspecialidadTurno) {
    selectMedicoTurno.addEventListener('change', () => {
      const med = medicos.find(m => m.nombre === selectMedicoTurno.value);
      if (med) selectEspecialidadTurno.value = med.especialidad;
    });

    selectEspecialidadTurno.addEventListener('change', () => {
      const med = medicos.find(m => m.especialidad === selectEspecialidadTurno.value);
      if (med) selectMedicoTurno.value = med.nombre;
    });
  }

  /*** EVENTOS ***/
  if (formMedico) formMedico.addEventListener('submit', agregarMedico);
  if (formEspecialidad) formEspecialidad.addEventListener('submit', agregarEspecialidad);
  if (formTurno) formTurno.addEventListener('submit', agregarTurno);

  /*** MOSTRAR INICIAL ***/
  mostrarMedicos();
  mostrarEspecialidades();
  mostrarTurnos();

});