import { MEDICOS_INICIALES } from "./data.js";
import { OBRAS_SOCIALES, VALORES_CONSULTA, DESCUENTOS_OS } from "./dataValores.js";

document.addEventListener("DOMContentLoaded", () => {
  /*** ELEMENTOS DOM ***/
  const selectEspecialidad = document.getElementById("especialidad");
  const selectMedico = document.getElementById("medico");
  const selectObraSocial = document.getElementById("obraSocial");
  const selectHora = document.getElementById("hora");
  const inputValorConsulta = document.getElementById("valorConsulta");
  const inputPorcentaje = document.getElementById("porcentaje");
  const inputValorFinal = document.getElementById("valorFinal");
  const form = document.getElementById("formReservaTurno");
  const mensajeDiv = document.getElementById("mensajeReserva");
  const tablaTurnos = document.getElementById("tablaTurnos");

  /*** DATOS BASE ***/
  const medicosGuardados = JSON.parse(localStorage.getItem("medicos")) || [];
  const todosLosMedicos = [...MEDICOS_INICIALES, ...medicosGuardados];

  /*** MÉDICOS ÚNICOS ***/
  const medicosUnicosMap = new Map();
  todosLosMedicos.forEach(m => {
    if (!medicosUnicosMap.has(m.nombre)) medicosUnicosMap.set(m.nombre, m);
  });
  const medicosUnicos = Array.from(medicosUnicosMap.values());

  /*** RELLENAR SELECTS INICIALES ***/
  function actualizarSelects() {
    // Especialidades únicas
    const especialidadesUnicas = [...new Set(medicosUnicos.map(m => m.especialidad))];
    selectEspecialidad.innerHTML = '<option value="">Seleccione especialidad...</option>';
    especialidadesUnicas.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = e;
      selectEspecialidad.appendChild(opt);
    });

    // Médicos únicos
    selectMedico.innerHTML = '<option value="">Seleccione médico...</option>';
    medicosUnicos.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.nombre;
      opt.textContent = m.nombre;
      selectMedico.appendChild(opt);
    });
  }
  actualizarSelects();

  /*** GENERAR HORARIOS ***/
  function generarHorarios() {
    selectHora.innerHTML = '<option value="">Seleccione hora</option>';
    for (let h = 8; h < 20; h++) {
      ["00", "30"].forEach(min => {
        const horaStr = `${h.toString().padStart(2, "0")}:${min}`;
        const opt = document.createElement("option");
        opt.value = horaStr;
        opt.textContent = horaStr;
        selectHora.appendChild(opt);
      });
    }
  }
  generarHorarios();

  /*** RELACIONES MÉDICO ↔ ESPECIALIDAD ***/
  selectMedico.addEventListener("change", () => {
    const medicoSel = medicosUnicos.find(m => m.nombre === selectMedico.value);
    selectEspecialidad.value = medicoSel ? medicoSel.especialidad : "";
    actualizarObrasSociales();
    actualizarValorConsulta();
  });

  selectEspecialidad.addEventListener("change", () => {
    const med = medicosUnicos.find(m => m.especialidad === selectEspecialidad.value);
    selectMedico.value = med ? med.nombre : "";
    actualizarObrasSociales();
    actualizarValorConsulta();
  });

  selectObraSocial.addEventListener("change", actualizarDescuentoYTotal);

  /*** FUNCIONES AUXILIARES ***/
  function actualizarValorConsulta() {
    const esp = selectEspecialidad.value;
    const valor = VALORES_CONSULTA[esp] || 0;
    inputValorConsulta.value = valor;
    actualizarDescuentoYTotal();
  }

  function actualizarObrasSociales() {
    selectObraSocial.innerHTML = '<option value="">Seleccione...</option>';
    const medicoSel = medicosUnicos.find(m => m.nombre === selectMedico.value);
    if (!medicoSel || !medicoSel.obrasSociales) return;

    let lista = medicoSel.obrasSociales;
    if (typeof lista === 'string') lista = lista.split(',').map(s => s.trim()).filter(Boolean);
    else if (!Array.isArray(lista)) lista = [];

    lista.forEach(nombreOS => {
      const os = OBRAS_SOCIALES.find(o => o.nombre === nombreOS) ||
                 OBRAS_SOCIALES.find(o => o.nombre && o.nombre.toLowerCase().trim() === String(nombreOS).toLowerCase().trim());
      if (os) {
        const opt = document.createElement("option");
        opt.value = os.nombre;
        opt.textContent = os.nombre;
        selectObraSocial.appendChild(opt);
      }
    });
  }

  function actualizarDescuentoYTotal() {
    const obra = selectObraSocial.value;
    const valorBase = Number(inputValorConsulta.value) || 0;
    const normalize = s => s ? s.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";
    let descuento = 0;
    if (obra) {
      const key = Object.keys(DESCUENTOS_OS).find(k => normalize(k) === normalize(obra));
      descuento = key ? DESCUENTOS_OS[key] : 0;
    }
    inputPorcentaje.value = descuento;
    const valorFinal = valorBase - (valorBase * (descuento / 100));
    inputValorFinal.value = valorFinal ? valorFinal.toFixed(2) : "";
  }

  function fechaValida(fecha) {
    const hoy = new Date();
    const seleccionada = new Date(fecha + "T00:00");
    const diaSemana = seleccionada.getDay();
    return (
      seleccionada >= hoy &&
      seleccionada.getFullYear() <= 2030 &&
      diaSemana !== 0 &&
      diaSemana !== 6
    );
  }

  /*** GUARDAR TURNO (USUARIO LOGUEADO) ***/
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuarioLogueado) {
      mostrarMensaje("⚠️ No hay usuario logueado.", "error");
      return;
    }

    const fecha = document.getElementById("fecha").value;
    const hora = selectHora.value;
    const medico = selectMedico.value;
    const especialidad = selectEspecialidad.value;
    const obra = selectObraSocial.value;

    if (!fecha || !hora || !medico || !especialidad || !obra) {
      mostrarMensaje("⚠️ Todos los campos son obligatorios.", "error");
      return;
    }

    if (!fechaValida(fecha)) {
      mostrarMensaje("⚠️ La fecha no es válida. No puede ser fin de semana, anterior a hoy ni posterior a 2030.", "error");
      return;
    }

    const turnosPublicos = JSON.parse(localStorage.getItem("turnosPublicos")) || [];

    // Validar duplicados
    const existe = turnosPublicos.some(t => t.medico === medico && t.fecha === fecha && t.hora === hora);
    if (existe) {
      mostrarMensaje("⚠️ Ese turno ya está reservado para ese médico, fecha y hora.", "error");
      return;
    }

    // ID consecutivo
    const maxId = turnosPublicos.length ? Math.max(...turnosPublicos.map(t => Number(t.id) || 0)) : 0;
    const nuevoId = maxId + 1;

    const nuevoTurno = {
      id: nuevoId,
      dni: usuarioLogueado.dni,
      paciente: usuarioLogueado.nombre,
      medico,
      especialidad,
      obraSocial: obra,
      fecha,
      hora,
      valorConsulta: Number(inputValorConsulta.value),
      descuento: Number(inputPorcentaje.value),
      total: Number(inputValorFinal.value)
    };

    turnosPublicos.push(nuevoTurno);
    localStorage.setItem("turnosPublicos", JSON.stringify(turnosPublicos));

    mostrarTurnos();
    mostrarMensaje(`
      <strong>✅ Reserva confirmada:</strong><br>
      ${usuarioLogueado.nombre}, tu turno es el <b>${fecha}</b> a las <b>${hora}</b> hs<br>
      con el Dr./Dra. <b>${medico}</b>.<br>¡Te esperamos!
    `, "success");

    form.reset();
    inputValorConsulta.value = "";
    inputPorcentaje.value = "";
    inputValorFinal.value = "";
  });

  /*** MOSTRAR TURNOS EN TABLA ***/
  function mostrarTurnos() {
    const turnos = JSON.parse(localStorage.getItem("turnosPublicos")) || [];
    tablaTurnos.innerHTML = "";
    turnos.forEach(t => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.id}</td>
        <td>${t.dni}</td>
        <td>${t.paciente}</td>
        <td>${t.medico}</td>
        <td>${t.especialidad}</td>
        <td>${t.obraSocial}</td>
        <td>$${t.total}</td>
      `;
      tablaTurnos.appendChild(tr);
    });
  }

  /*** MOSTRAR MENSAJES ***/
  function mostrarMensaje(texto, tipo = "error") {
    mensajeDiv.innerHTML = texto;
    mensajeDiv.style.display = "block";
    if (tipo === "error") {
      mensajeDiv.style.backgroundColor = "#f8d7da";
      mensajeDiv.style.color = "#721c24";
      mensajeDiv.style.border = "1px solid #f5c6cb";
    } else {
      mensajeDiv.style.backgroundColor = "#d4edda";
      mensajeDiv.style.color = "#155724";
      mensajeDiv.style.border = "1px solid #c3e6cb";
    }
    mensajeDiv.style.padding = "10px";
    mensajeDiv.style.borderRadius = "8px";
    mensajeDiv.style.marginTop = "10px";
    mensajeDiv.style.textAlign = "center";
  }

  mostrarTurnos();
});