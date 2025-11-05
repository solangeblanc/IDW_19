const form = document.getElementById("formReservarTurno");
const medicoSelect = document.getElementById("medicoTurno");
const horaSelect = document.getElementById("horaTurno");
const alerta = document.getElementById("alertaReservar");

// Cargar médicos desde localStorage y mostrar nombre + especialidad
function cargarMedicos() {
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];

  medicos.forEach(medico => {
    const option = document.createElement("option");
    option.value = medico.nombre;
    option.textContent = `${medico.nombre} (${medico.especialidad})`;
    option.dataset.especialidad = medico.especialidad;
    medicoSelect.appendChild(option);
  });
}

// Generar horarios cada 30 minutos entre 08:00 y 20:00
function generarHorarios() {
  const inicio = 8 * 60;
  const fin = 20 * 60;

  for (let min = inicio; min < fin; min += 30) {
    const hora = String(Math.floor(min / 60)).padStart(2, "0");
    const minutos = String(min % 60).padStart(2, "0");
    const option = document.createElement("option");
    option.value = `${hora}:${minutos}`;
    option.textContent = `${hora}:${minutos}`;
    horaSelect.appendChild(option);
  }
}

// Validar si el turno es en día hábil
function esDiaHabil(fechaStr) {
  const dia = new Date(fechaStr).getDay();
  return dia >= 1 && dia <= 5;
}

// Verificar si el turno ya existe
function turnoSuperpuesto(medico, fecha, hora) {
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  return turnos.some(turno =>
    turno.medico === medico &&
    turno.fecha === fecha &&
    turno.hora === hora
  );
}

// Guardar turno
function guardarTurno(turno) {
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  turnos.push(turno);
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

form.addEventListener("submit", e => {
  e.preventDefault();
  alerta.textContent = "";

  const nombre = document.getElementById("nombrePaciente").value.trim();
  const medico = medicoSelect.value;
  const especialidad = medicoSelect.selectedOptions[0].dataset.especialidad;
  const fecha = document.getElementById("fechaTurno").value;
  const hora = horaSelect.value;

  if (!nombre || !medico || !especialidad || !fecha || !hora) {
    alerta.textContent = "Todos los campos son obligatorios.";
    return;
  }

  if (!esDiaHabil(fecha)) {
    alerta.textContent = "Solo se permiten turnos de lunes a viernes.";
    return;
  }

  if (turnoSuperpuesto(medico, fecha, hora)) {
    alerta.textContent = "Ya existe un turno para ese médico en ese horario.";
    return;
  }

  guardarTurno({ nombre, medico, especialidad, fecha, hora });
  alerta.textContent = "✅ Turno reservado con éxito.";
  form.reset();
});

cargarMedicos();
generarHorarios();

