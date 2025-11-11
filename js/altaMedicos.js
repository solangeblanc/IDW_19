import { MEDICOS_INICIALES } from './data.js';
import { VALORES_CONSULTA, DESCUENTOS_OS, OBRAS_SOCIALES } from './dataValores.js';

document.addEventListener('DOMContentLoaded', () => {
  /*** ELEMENTOS DOM ***/
  const formMedico = document.getElementById('formAltaMedico');
  const tbodyMedicos = document.getElementById('medicosRegistrados');
  const alertaMedicosDiv = document.getElementById('alertaMedicos');

  const formEspecialidad = document.getElementById('formEspecialidad');
  const inputNuevaEspecialidad = document.getElementById('nuevaEspecialidad');
  const alertaEspecialidadesDiv = document.getElementById('alertaEspecialidades');

  const formTurno = document.getElementById('formAltaTurno');
  const selectMedicoTurno = document.getElementById('medicoTurno');
  const selectEspecialidadTurno = document.getElementById('especialidadTurno');
  const selectObraSocialTurno = document.getElementById('obraSocialTurno');
  const inputValorConsultaTurno = document.getElementById('valorConsultaTurno');
  const inputPorcentajeDescuentoTurno = document.getElementById('porcentajeDescuentoTurno');
  const inputValorFinalTurno = document.getElementById('valorFinalTurno');
  const selectHoraTurno = document.getElementById('horaTurno');
  const tbodyTurnos = document.getElementById('turnosRegistrados');
  const alertaTurnosDiv = document.getElementById('alertaTurnos');

  /*** DATOS BASE ***/
  let medicos = JSON.parse(localStorage.getItem('medicos')) || [];

  // Si no hay nada en localStorage, usamos los médicos iniciales
  if (medicos.length === 0) {
    medicos = [...MEDICOS_INICIALES];
    localStorage.setItem('medicos', JSON.stringify(medicos));
  }

  let especialidades = [...new Set(medicos.map(m => m.especialidad))];
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  let obrasSociales = OBRAS_SOCIALES.map(os => ({
  id: os.id,
  nombre: os.nombre,
  descripcion: os.descripcion,
  porcentaje: DESCUENTOS_OS[os.nombre] || 0  // <- asignamos el % desde tu objeto
}));
localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));

  const obrasStorage = JSON.parse(localStorage.getItem('obrasSociales'));
  if (obrasStorage && obrasStorage.length > 0) {
    obrasSociales = obrasStorage;
  } else {
    obrasSociales = OBRAS_SOCIALES.map((os, idx) => ({
      id: os.id || idx + 1,
      nombre: os.nombre,
      porcentaje: os.porcentaje || 0
    }));
    localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
  }

  // Variable para edición de especialidades
  let editEspecialidadId = null;

  // Asegurar estructura con id + nombre en especialidades
  especialidades = especialidades.map((esp, idx) =>
    typeof esp === 'string' ? { id: idx + 1, nombre: esp } : esp
  );

  /*** CONSTANTES ***/
  const FERIADOS = [
    '2025-01-01', '2025-02-03', '2025-02-04', '2025-03-24', '2025-04-02',
    '2025-05-01', '2025-05-25', '2025-06-20', '2025-07-09',
    '2025-12-08', '2025-12-25'
  ];

  /*** FUNCIONES AUXILIARES ***/
  const normalize = str =>
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";

  const guardarMedicos = () => localStorage.setItem('medicos', JSON.stringify(medicos));
  const guardarTurnos = () => localStorage.setItem('turnos', JSON.stringify(turnos));

  const mostrarAlerta = (msg, contenedor) => {
    contenedor.innerHTML = `<div class="alerta-mensaje">${msg}</div>`;
    setTimeout(() => contenedor.innerHTML = "", 5000);
  };

  /*** GENERACIÓN DE HORARIOS ***/
  function generarHorarios() {
    selectHoraTurno.innerHTML = '<option value="">Seleccione...</option>';
    
    for (let h = 8; h < 20; h++) {
      ['00', '30'].forEach(m => {
        const opt = document.createElement('option');
        opt.value = `${String(h).padStart(2, '0')}:${m}`;
        opt.textContent = `${String(h).padStart(2, '0')}:${m}`;
        selectHoraTurno.appendChild(opt);
      });
    }
  }

  /*** CARGAR SELECT DE ESPECIALIDADES ***/
  function cargarSelectEspecialidades() {
    const select = document.getElementById('especialidad');
    if (!select) return;

    select.innerHTML = '<option value="">Seleccione...</option>';

    Object.keys(VALORES_CONSULTA).forEach(especialidad => {
      const option = document.createElement('option');
      option.value = especialidad;
      option.textContent = especialidad;
      select.appendChild(option);
    });
  }

  /*** CRUD OBRAS SOCIALES ***/
function mostrarObrasSociales() {
  const listaObrasUl = document.getElementById('listaObrasSociales');
  listaObrasUl.innerHTML = '';

  obrasSociales
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .forEach(os => {
      const fila = document.createElement('tr');

      // Columna ID
      const tdId = document.createElement('td');
      tdId.textContent = os.id;

      // Columna nombre
      const tdNombre = document.createElement('td');
      tdNombre.textContent = os.nombre;

      // Columna porcentaje de descuento
      const tdPorcentaje = document.createElement('td');
      tdPorcentaje.textContent = os.porcentaje || 0;

      // Columna acciones
      const tdAcciones = document.createElement('td');

      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn btn-sm btn-warning me-2';
      btnEditar.textContent = 'Editar';
      btnEditar.addEventListener('click', () => {
        document.getElementById('nuevaObraSocial').value = os.nombre;
        document.getElementById('porcentajeObraSocial').value = os.porcentaje || 0;
        editObraSocialId = os.id;
      });

      const btnBorrar = document.createElement('button');
      btnBorrar.className = 'btn btn-sm btn-danger';
      btnBorrar.textContent = 'Eliminar';
      btnBorrar.addEventListener('click', () => {
        if (confirm(`¿Eliminar obra social "${os.nombre}"?`)) {
          obrasSociales = obrasSociales.filter(o => o.id !== os.id);
          localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
          mostrarObrasSociales();
          mostrarAlerta('🗑️ Obra social eliminada.', alertaEspecialidadesDiv);
          actualizarSelectsTurnos();
        }
      });

      tdAcciones.appendChild(btnEditar);
      tdAcciones.appendChild(btnBorrar);

      fila.appendChild(tdId);
      fila.appendChild(tdNombre);
      fila.appendChild(tdPorcentaje);
      fila.appendChild(tdAcciones);
      listaObrasUl.appendChild(fila);
    });

  actualizarSelectsTurnos();
}

function agregarObraSocial(e) {
  e.preventDefault();
  const nombre = document.getElementById('nuevaObraSocial').value.trim();
  const porcentaje = parseFloat(document.getElementById('porcentajeObraSocial').value) || 0;

  if (!nombre || nombre.length < 3 || nombre[0] !== nombre[0].toUpperCase()) {
    mostrarAlerta("⚠️ El nombre debe empezar con mayúscula y tener al menos 3 letras.", alertaEspecialidadesDiv);
    return;
  }

  if (editObraSocialId !== null) {
    // Modo edición
    const idx = obrasSociales.findIndex(o => o.id === editObraSocialId);
    if (idx !== -1) {
      // Evitar duplicado
      if (obrasSociales.some((o, i) => i !== idx && o.nombre === nombre)) {
        mostrarAlerta("⚠️ Ya existe otra obra social con ese nombre.", alertaEspecialidadesDiv);
        return;
      }
      obrasSociales[idx].nombre = nombre;
      obrasSociales[idx].porcentaje = porcentaje;
      mostrarAlerta("✏️ Obra social actualizada.", alertaEspecialidadesDiv);
    }
    editObraSocialId = null;
  } else {
    // Modo crear
    if (obrasSociales.some(o => o.nombre === nombre)) {
      mostrarAlerta("⚠️ Esta obra social ya está en la lista.", alertaEspecialidadesDiv);
      return;
    }
    const maxId = obrasSociales.length ? Math.max(...obrasSociales.map(o => o.id)) : 0;
    obrasSociales.push({ id: maxId + 1, nombre, porcentaje });
    mostrarAlerta("✅ Obra social agregada.", alertaEspecialidadesDiv);
  }

  localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
  document.getElementById('nuevaObraSocial').value = '';
  document.getElementById('porcentajeObraSocial').value = '';
  mostrarObrasSociales();
  actualizarSelectsTurnos();
}

// Variable global para edición
let editObraSocialId = null;

// Event listener
const formObraSocial = document.getElementById('formObraSocial');
formObraSocial.addEventListener('submit', agregarObraSocial);

// Inicialización
mostrarObrasSociales();

  /*** CRUD MÉDICOS ***/
  function mostrarMedicos() {
    if (medicos.length === 0) {
      tbodyMedicos.innerHTML = `<tr><td colspan="9" class="text-center">No hay médicos registrados</td></tr>`;
    } else {
      tbodyMedicos.innerHTML = medicos.map((med, idx) => `
        <tr>
          <td>${med.nombre}</td>
          <td>${med.matricula || '-'}</td>
          <td>${med.id || '-'}</td>
          <td>${med.especialidad}</td>
          <td>${med.valorConsulta || (VALORES_CONSULTA[med.especialidad] || '-')}</td>
          <td>${med.telefono}</td>
          <td>${Array.isArray(med.obrasSociales) ? med.obrasSociales.join(', ') : med.obrasSociales}</td>
          <td>${med.email}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" onclick="editarMedico(${idx})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${idx})">Eliminar</button>
          </td>
        </tr>
      `).join('');
    }
    actualizarSelectsTurnos();
  }

  function agregarMedico(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const obrasSociales = document.getElementById('obrasSociales').value.trim();
    const email = document.getElementById('email').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    if (!nombre || !especialidad || !telefono || !obrasSociales || !email) {
      mostrarAlerta("⚠️ Todos los campos son obligatorios.", alertaMedicosDiv);
      return;
    }

    const maxId = medicos.length ? Math.max(...medicos.map(m => m.id || 0)) : 0;
    const nuevoId = maxId + 1;

    const maxMatricula = medicos.length ? Math.max(...medicos.map(m => m.matricula || 0)) : 10000;
    const nuevaMatricula = maxMatricula + 1;

    const inputFoto = document.getElementById('foto');
    const crearMedico = (foto) => {
      const nuevoMedico = {
        id: nuevoId,
        matricula: nuevaMatricula,
        nombre,
        especialidad,
        telefono,
        obrasSociales,
        email,
        descripcion,
        valorConsulta: VALORES_CONSULTA[especialidad] || 15000,
        foto
      };

      medicos.push(nuevoMedico);
      
      if (!especialidades.some(e => e.nombre === especialidad)) {
        const maxEspId = especialidades.length ? Math.max(...especialidades.map(e => e.id)) : 0;
        especialidades.push({ id: maxEspId + 1, nombre: especialidad });
      }

      guardarMedicos();
      mostrarMedicos();
      mostrarEspecialidades();
      formMedico.reset();
      mostrarAlerta("✅ Médico registrado correctamente.", alertaMedicosDiv);
    };

    if (inputFoto.files && inputFoto.files[0]) {
      const reader = new FileReader();
      reader.onload = function (event) {
        crearMedico(event.target.result);
      };
      reader.readAsDataURL(inputFoto.files[0]);
    } else {
      crearMedico('./CSS/imagenes/default-doctor.jpg');
    }
  }

  window.editarMedico = function (idx) {
    const med = medicos[idx];

    // Rellenamos los inputs
    document.getElementById('nombre').value = med.nombre;
    document.getElementById('especialidad').value = med.especialidad;
    document.getElementById('telefono').value = med.telefono;
    document.getElementById('obrasSociales').value = med.obrasSociales;
    document.getElementById('email').value = med.email;
    document.getElementById('descripcion').value = med.descripcion || '';
    document.getElementById('valorConsulta').value = med.valorConsulta || VALORES_CONSULTA[med.especialidad] || 15000;
    document.getElementById('matricula').value = med.matricula || '';

    // Quitamos el listener anterior
    formMedico.removeEventListener('submit', agregarMedico);

    function actualizar(e) {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const especialidad = document.getElementById('especialidad').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const obrasSociales = document.getElementById('obrasSociales').value.trim();
      const email = document.getElementById('email').value.trim();
      const descripcion = document.getElementById('descripcion').value.trim();
      const valorConsulta = parseFloat(document.getElementById('valorConsulta').value) || VALORES_CONSULTA[especialidad] || 15000;
      const matricula = document.getElementById('matricula').value || med.matricula;

      // Actualizamos el médico
      medicos[idx] = {
        ...med,
        nombre,
        especialidad,
        telefono,
        obrasSociales,
        email,
        descripcion,
        valorConsulta,
        matricula
      };

      // Si es una especialidad nueva, la agregamos
      if (!especialidades.some(e => e.nombre === especialidad)) {
        const nuevoId = especialidades.length ? Math.max(...especialidades.map(e => e.id)) + 1 : 1;
        especialidades.push({ id: nuevoId, nombre: especialidad });
      }

      guardarMedicos();
      mostrarMedicos();
      mostrarEspecialidades();
      formMedico.reset();
      mostrarAlerta("✏️ Médico actualizado correctamente.", alertaMedicosDiv);

      // Volvemos a agregar el listener original
      formMedico.removeEventListener('submit', actualizar);
      formMedico.addEventListener('submit', agregarMedico);
    }

    formMedico.addEventListener('submit', actualizar);
  };

  window.eliminarMedico = function (idx) {
    if (confirm('¿Eliminar este médico?')) {
      medicos.splice(idx, 1);
      guardarMedicos();
      mostrarMedicos();
      mostrarAlerta('🗑️ Médico eliminado.', alertaMedicosDiv);
    }
  };

  /*** CRUD ESPECIALIDADES ***/
  function mostrarEspecialidades() {
    const listaEspecialidadesUl = document.getElementById('listaEspecialidades');
    listaEspecialidadesUl.innerHTML = '';

    especialidades
      .slice()
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .forEach(esp => {
        const fila = document.createElement('tr');

        // Columna ID
        const tdId = document.createElement('td');
        tdId.textContent = esp.id;

        // Columna nombre
        const tdNombre = document.createElement('td');
        tdNombre.textContent = esp.nombre;

        // Columna acciones
        const tdAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-sm btn-warning me-2';
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => {
          inputNuevaEspecialidad.value = esp.nombre;
          editEspecialidadId = esp.id;
          inputNuevaEspecialidad.focus();
        });

        const btnBorrar = document.createElement('button');
        btnBorrar.className = 'btn btn-sm btn-danger';
        btnBorrar.textContent = 'Eliminar';
        btnBorrar.addEventListener('click', () => {
          if (confirm(`¿Eliminar especialidad "${esp.nombre}"?`)) {
            especialidades = especialidades.filter(e => e.id !== esp.id);
            mostrarEspecialidades();
            mostrarAlerta('🗑️ Especialidad eliminada.', alertaEspecialidadesDiv);
            actualizarSelectsTurnos();
          }
        });

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnBorrar);

        fila.appendChild(tdId);
        fila.appendChild(tdNombre);
        fila.appendChild(tdAcciones);
        listaEspecialidadesUl.appendChild(fila);
      });

    actualizarSelectsTurnos();
  }

  function agregarEspecialidad(e) {
    e.preventDefault();
    const nombre = inputNuevaEspecialidad.value.trim();
    
    if (!nombre || nombre.length < 5 || nombre[0] !== nombre[0].toUpperCase()) {
      mostrarAlerta("⚠️ La especialidad debe empezar con mayúscula y tener más de 4 letras.", alertaEspecialidadesDiv);
      return;
    }

    if (editEspecialidadId !== null) {
      // Modo edición
      const idx = especialidades.findIndex(e => e.id === editEspecialidadId);
      
      if (idx !== -1) {
        // Evitar duplicado con otra especialidad
        if (especialidades.some((e, i) => i !== idx && e.nombre === nombre)) {
          mostrarAlerta("⚠️ Ya existe otra especialidad con ese nombre.", alertaEspecialidadesDiv);
          return;
        }
        especialidades[idx].nombre = nombre;
        mostrarAlerta("✏️ Especialidad actualizada.", alertaEspecialidadesDiv);
      }
      editEspecialidadId = null;
    } else {
      // Modo crear
      if (especialidades.some(e => e.nombre === nombre)) {
        mostrarAlerta("⚠️ Esta especialidad ya está en la lista.", alertaEspecialidadesDiv);
        return;
      }
      const maxId = especialidades.length ? Math.max(...especialidades.map(e => e.id)) : 0;
      especialidades.push({ id: maxId + 1, nombre });
      mostrarAlerta("✅ Especialidad agregada.", alertaEspecialidadesDiv);
    }

    inputNuevaEspecialidad.value = '';
    mostrarEspecialidades();
  }

  /*** GESTIÓN DE TURNOS ***/
  function actualizarSelectsTurnos() {
    // Select de médicos
    selectMedicoTurno.innerHTML = '<option value="">Seleccione...</option>';
    medicos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.nombre;
      opt.textContent = m.nombre;
      selectMedicoTurno.appendChild(opt);
    });

    // Select de especialidades
    selectEspecialidadTurno.innerHTML = '<option value="">Seleccione...</option>';
    especialidades.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.nombre;
      opt.textContent = e.nombre;
      selectEspecialidadTurno.appendChild(opt);
    });
  }

  function cargarObrasSociales(medico) {
    selectObraSocialTurno.innerHTML = '<option value="">Seleccione...</option>';
    if (!medico) return;

    const med = medicos.find(m => m.nombre === medico);
    if (med && med.obrasSociales) {
      const obras = Array.isArray(med.obrasSociales)
        ? med.obrasSociales
        : med.obrasSociales.split(',').map(o => o.trim());
      
      obras.forEach(os => {
        const opt = document.createElement('option');
        opt.value = os;
        opt.textContent = os;
        selectObraSocialTurno.appendChild(opt);
      });
    }
  }

  function calcularTotal() {
    const especialidad = selectEspecialidadTurno.value;
    const obraSocial = selectObraSocialTurno.value;

    const valorKey = Object.keys(VALORES_CONSULTA).find(k => normalize(k) === normalize(especialidad));
    const valor = valorKey ? VALORES_CONSULTA[valorKey] : 0;

    const descKey = Object.keys(DESCUENTOS_OS).find(k => normalize(k) === normalize(obraSocial));
    const descuento = descKey ? DESCUENTOS_OS[descKey] : 0;

    inputValorConsultaTurno.value = valor;
    inputPorcentajeDescuentoTurno.value = descuento;
    inputValorFinalTurno.value = (valor - valor * (descuento / 100)).toFixed(2);
  }

  function validarTurno(paciente, medico, especialidad, obraSocial, fecha, hora, idxEdicion = null) {
    // Validar nombre del paciente
    const palabras = paciente.split(' ').filter(p => p.length > 0);
    const nombreValido = palabras.length >= 2 &&
      palabras.every(p => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(p)) &&
      paciente.replace(/\s/g, '').length > 4;

    if (!nombreValido) {
      return "⚠️ El nombre del paciente debe tener al menos dos palabras, empezar con mayúscula y más de 4 letras.";
    }

    // Validar campos obligatorios
    if (!medico || !especialidad || !obraSocial || !fecha || !hora) {
      return "⚠️ Complete todos los campos.";
    }

    // Validar fecha y hora
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const [h, m] = hora.split(':').map(Number);
    const fechaHora = new Date(anio, mes - 1, dia, h, m);
    const ahora = new Date();

    // Validar sábados y domingos
    const diaSemana = fechaHora.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      return "⚠️ No se pueden sacar turnos los sábados ni domingos.";
    }

    // Validar feriados
    const fechaStr = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    if (FERIADOS.includes(fechaStr)) {
      return "⚠️ No se pueden sacar turnos en feriados.";
    }

    // Validar fecha futura
    if (fechaHora < ahora) {
      return "⚠️ La fecha y hora no pueden ser anteriores a la actual.";
    }

    // Validar horario
    if (h < 8 || h > 20) {
      return "⚠️ La hora del turno debe estar entre 08:00 y 20:00.";
    }

    // Validar año
    if (fechaHora.getFullYear() > 2030) {
      return "⚠️ El año no puede ser mayor a 2030.";
    }

    // Validar turno duplicado
    const existe = turnos.some((t, i) =>
      i !== idxEdicion &&
      t.medico === medico &&
      t.fecha === fecha &&
      t.hora === hora
    );

    if (existe) {
      return `⚠️ Ya existe un turno para ${medico} el ${fecha} a las ${hora}.`;
    }

    return null;
  }

    function mostrarTurnos() {
    // Traer turnos de pacientes
    const turnosPublicos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];

    // Combinar ambos arrays
    const todosLosTurnos = [
      ...turnos.map(t => ({ ...t, idVisual: t.id + "t" })), // internos
      ...turnosPublicos.map(t => ({ ...t, idVisual: t.id + "r" })) // reservas
    ];

    if (!todosLosTurnos.length) {
      tbodyTurnos.innerHTML = `<tr><td colspan="9" class="text-center">No hay turnos registrados</td></tr>`;
      return;
    }

    tbodyTurnos.innerHTML = '';
    todosLosTurnos.forEach((t, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.idVisual}</td>
        <td>${t.paciente || "-"}</td>
        <td>${t.medico}</td>
        <td>${t.especialidad}</td>
        <td>${t.obraSocial || "-"}</td>
        <td>${t.fecha}</td>
        <td>${t.hora}</td>
        <td>$${t.total || ""}</td>
        <td>
          ${t.idVisual.endsWith('t') ? `
            <button class="btn btn-warning btn-sm me-2" onclick="editarTurno(${i})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${i})">Eliminar</button>
          ` : ''}
        </td>
      `;
      tbodyTurnos.appendChild(tr);
    });
  }

  function agregarTurno(e) {
    e.preventDefault();

    const paciente = document.getElementById('nombrePaciente').value.trim();
    const medico = selectMedicoTurno.value;
    const especialidad = selectEspecialidadTurno.value;
    const obraSocial = selectObraSocialTurno.value;
    const fecha = document.getElementById('fechaTurno').value;
    const hora = selectHoraTurno.value;
    const valor = parseFloat(inputValorConsultaTurno.value) || 0;
    const descuento = parseFloat(inputPorcentajeDescuentoTurno.value) || 0;
    const total = parseFloat(inputValorFinalTurno.value) || 0;

    const error = validarTurno(paciente, medico, especialidad, obraSocial, fecha, hora);
    if (error) {
      mostrarAlerta(error, alertaTurnosDiv);
      return;
    }

    // Generar ID único
    const maxId = turnos.length ? Math.max(...turnos.map(t => t.id || 0)) : 0;
    const nuevoId = maxId + 1;

    turnos.push({
      id: nuevoId,
      paciente,
      medico,
      especialidad,
      obraSocial,
      fecha,
      hora,
      valor,
      descuento,
      total
    });

    guardarTurnos();
    mostrarTurnos();
    formTurno.reset();
    selectObraSocialTurno.innerHTML = '<option value="">Seleccione...</option>';
    mostrarAlerta("✅ Turno registrado correctamente.", alertaTurnosDiv);
  }

  window.editarTurno = function (i) {
    const t = turnos[i];
    
    document.getElementById('nombrePaciente').value = t.paciente;
    selectMedicoTurno.value = t.medico;
    selectMedicoTurno.dispatchEvent(new Event('change'));
    selectObraSocialTurno.value = t.obraSocial;
    document.getElementById('fechaTurno').value = t.fecha;
    selectHoraTurno.value = t.hora;
    inputValorConsultaTurno.value = t.valor;
    inputPorcentajeDescuentoTurno.value = t.descuento;
    inputValorFinalTurno.value = t.total;

    formTurno.onsubmit = e => {
      e.preventDefault();

      const paciente = document.getElementById('nombrePaciente').value.trim();
      const medico = selectMedicoTurno.value;
      const especialidad = selectEspecialidadTurno.value;
      const obraSocial = selectObraSocialTurno.value;
      const fecha = document.getElementById('fechaTurno').value;
      const hora = selectHoraTurno.value;
      const valor = parseFloat(inputValorConsultaTurno.value) || 0;
      const descuento = parseFloat(inputPorcentajeDescuentoTurno.value) || 0;
      const total = parseFloat(inputValorFinalTurno.value) || 0;

      const error = validarTurno(paciente, medico, especialidad, obraSocial, fecha, hora, i);
      if (error) {
        mostrarAlerta(error, alertaTurnosDiv);
        return;
      }

      turnos[i] = {
        id: turnos[i].id,
        paciente,
        medico,
        especialidad,
        obraSocial,
        fecha,
        hora,
        valor,
        descuento,
        total
      };

      guardarTurnos();
      mostrarTurnos();
      formTurno.reset();
      selectObraSocialTurno.innerHTML = '<option value="">Seleccione...</option>';
      mostrarAlerta("✏️ Turno actualizado correctamente.", alertaTurnosDiv);

      formTurno.onsubmit = agregarTurno;
    };
  };

  window.eliminarTurno = function (i) {
    if (confirm('¿Eliminar este turno?')) {
      turnos.splice(i, 1);
      guardarTurnos();
      mostrarTurnos();
      mostrarAlerta('🗑️ Turno eliminado.', alertaTurnosDiv);
    }
  };

  /*** EVENT LISTENERS ***/
  formMedico.addEventListener('submit', agregarMedico);
  formEspecialidad.addEventListener('submit', agregarEspecialidad);
  formTurno.addEventListener('submit', agregarTurno);

  selectMedicoTurno.addEventListener('change', () => {
    const med = medicos.find(m => m.nombre === selectMedicoTurno.value);
    if (med) {
      selectEspecialidadTurno.value = med.especialidad;
      cargarObrasSociales(med.nombre);
    } else {
      selectEspecialidadTurno.value = '';
      selectObraSocialTurno.innerHTML = '<option value="">Seleccione...</option>';
    }
    calcularTotal();
  });

  selectEspecialidadTurno.addEventListener('change', () => {
    const med = medicos.find(m => normalize(m.especialidad) === normalize(selectEspecialidadTurno.value));
    if (med) {
      selectMedicoTurno.value = med.nombre;
      cargarObrasSociales(med.nombre);
    } else {
      selectMedicoTurno.value = '';
      selectObraSocialTurno.innerHTML = '<option value="">Seleccione...</option>';
    }
    calcularTotal();
  });

  selectObraSocialTurno.addEventListener('change', calcularTotal);

  // Autocompletar valor de consulta al seleccionar especialidad
  const especialidadInput = document.getElementById('especialidad');
  if (especialidadInput) {
    especialidadInput.addEventListener('change', (e) => {
      const especialidadSeleccionada = e.target.value;
      const valor = VALORES_CONSULTA[especialidadSeleccionada] || '';
      const inputValorConsulta = document.getElementById('valorConsulta');
      if (inputValorConsulta) {
        inputValorConsulta.value = valor;
      }
    });
  }

  /*** INICIALIZACIÓN ***/
  mostrarMedicos();
  mostrarEspecialidades();
  mostrarTurnos();
  generarHorarios();
  cargarSelectEspecialidades();
});