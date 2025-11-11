import { MEDICOS_INICIALES } from './data.js';
import { VALORES_CONSULTA, DESCUENTOS_OS } from './dataValores.js';

document.addEventListener('DOMContentLoaded', () => {
  /*** ELEMENTOS DOM ***/
  const formTurno = document.getElementById('formTurnoPublico');
  const selectMedico = document.getElementById('medicoTurno');
  const selectEspecialidad = document.getElementById('especialidadTurno');
  const selectObraSocial = document.getElementById('obraSocialTurno');
  const selectHora = document.getElementById('horaTurno');
  const inputValor = document.getElementById('valorConsultaTurno');
  const inputDesc = document.getElementById('porcentajeDescuentoTurno');
  const inputTotal = document.getElementById('valorFinalTurno');
  const alertaDiv = document.getElementById('alertaTurnoPublico');
  const tbodyTurnos = document.getElementById('turnosPublicos');

  /*** DATOS BASE ***/
  let medicos = JSON.parse(localStorage.getItem('medicos')) || MEDICOS_INICIALES;
  let especialidades = [...new Set(medicos.map(m => m.especialidad))];
  let turnos = JSON.parse(localStorage.getItem('turnosPublicos')) || [];

  /*** FUNCIONES AUXILIARES ***/
  const normalize = str =>
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";

  const guardarTurnos = () => localStorage.setItem('turnosPublicos', JSON.stringify(turnos));

  const mostrarAlerta = msg => {
    alertaDiv.innerHTML = `<div class="alerta-mensaje">${msg}</div>`;
    setTimeout(() => alertaDiv.innerHTML = "", 4000);
  };

  /*** HORARIOS ***/
  function generarHorarios() {
    selectHora.innerHTML = '<option value="">Seleccione...</option>';
    for (let h = 8; h < 20; h++) {
      ['00', '30'].forEach(m => {
        const opt = document.createElement('option');
        opt.value = `${String(h).padStart(2,'0')}:${m}`;
        opt.textContent = opt.value;
        selectHora.appendChild(opt);
      });
    }
  }

  /*** SELECTS MÉDICO Y ESPECIALIDAD ***/
  function actualizarSelects() {
    selectMedico.innerHTML = '<option value="">Seleccione...</option>';
    medicos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.nombre;
      opt.textContent = `${m.nombre} (${m.especialidad})`;
      selectMedico.appendChild(opt);
    });

    selectEspecialidad.innerHTML = '<option value="">Seleccione...</option>';
    especialidades.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e;
      opt.textContent = e;
      selectEspecialidad.appendChild(opt);
    });
  }

  function cargarObrasSociales(medico) {
    selectObraSocial.innerHTML = '<option value="">Seleccione...</option>';
    if (!medico) return;
    const med = medicos.find(m => m.nombre === medico);
    if (med && med.obrasSociales) {
      const obras = Array.isArray(med.obrasSociales) ? med.obrasSociales : med.obrasSociales.split(',').map(o=>o.trim());
      obras.forEach(os => {
        const opt = document.createElement('option');
        opt.value = os;
        opt.textContent = os;
        selectObraSocial.appendChild(opt);
      });
    }
  }

  /*** CALCULAR TOTAL ***/
  function calcularTotal() {
    const especialidad = selectEspecialidad.value;
    const obraSocial = selectObraSocial.value;

    const valorKey = Object.keys(VALORES_CONSULTA).find(k => normalize(k) === normalize(especialidad));
    const valor = valorKey ? VALORES_CONSULTA[valorKey] : 0;

    const descKey = Object.keys(DESCUENTOS_OS).find(k => normalize(k) === normalize(obraSocial));
    const descuento = descKey ? DESCUENTOS_OS[descKey] : 0;

    inputValor.value = valor;
    inputDesc.value = descuento;
    inputTotal.value = (valor - valor*(descuento/100)).toFixed(2);
  }

  /*** VALIDACIÓN DE TURNOS ***/
  function validarTurno(paciente, medico, especialidad, obraSocial, fecha, hora) {
    if (!paciente || !medico || !especialidad || !obraSocial || !fecha || !hora) return "⚠️ Complete todos los campos.";
    const [anio,mes,dia]=fecha.split('-').map(Number);
    const [h,m]=hora.split(':').map(Number);
    const fechaHora=new Date(anio,mes-1,dia,h,m);
    const ahora=new Date();
    if(fechaHora<ahora) return "⚠️ La fecha y hora no pueden ser anteriores a la actual.";
    if(h<8||h>20) return "⚠️ La hora del turno debe estar entre 08:00 y 20:00.";
    const existe = turnos.some(t=>t.medico===medico && t.fecha===fecha && t.hora===hora);
    if(existe) return `⚠️ Ya existe un turno para ${medico} el ${fecha} a las ${hora}.`;
    return null;
  }

  /*** MOSTRAR TURNOS ***/
  function mostrarTurnos() {
    tbodyTurnos.innerHTML='';
    if(!turnos.length) {
      tbodyTurnos.innerHTML=`<tr><td colspan="7" class="text-center">No hay turnos registrados</td></tr>`;
      return;
    }
    turnos.forEach(t=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`
        <td>${t.paciente}</td>
        <td>${t.medico}</td>
        <td>${t.especialidad}</td>
        <td>${t.obraSocial}</td>
        <td>${t.fecha}</td>
        <td>${t.hora}</td>
        <td>$${t.total}</td>
      `;
      tbodyTurnos.appendChild(tr);
    });
  }

  /*** AGREGAR TURNO ***/
  function agregarTurno(e){
    e.preventDefault();
    const paciente = document.getElementById('nombrePaciente').value.trim();
    const medico = selectMedico.value;
    const especialidad = selectEspecialidad.value;
    const obraSocial = selectObraSocial.value;
    const fecha = document.getElementById('fechaTurno').value;
    const hora = selectHora.value;
    const valor = parseFloat(inputValor.value)||0;
    const descuento = parseFloat(inputDesc.value)||0;
    const total = parseFloat(inputTotal.value)||0;

    const error = validarTurno(paciente,medico,especialidad,obraSocial,fecha,hora);
    if(error){mostrarAlerta(error);return;}

    turnos.push({paciente,medico,especialidad,obraSocial,fecha,hora,valor,descuento,total});
    guardarTurnos();
    mostrarTurnos();
    formTurno.reset();
    selectObraSocial.innerHTML='<option value="">Seleccione...</option>';
    mostrarAlerta("✅ Turno registrado correctamente.");
  }

  /*** EVENTOS ***/
  formTurno.addEventListener('submit', agregarTurno);
  selectMedico.addEventListener('change', () => {
    const med = medicos.find(m => m.nombre === selectMedico.value);
    if (med) {
      selectEspecialidad.value = med.especialidad;
      cargarObrasSociales(med.nombre);
    } else {
      selectEspecialidad.value = '';
      selectObraSocial.innerHTML = '<option value="">Seleccione...</option>';
    }
    calcularTotal();
  });
  selectEspecialidad.addEventListener('change', () => {
    const med = medicos.find(m => normalize(m.especialidad) === normalize(selectEspecialidad.value));
    if (med) {
      selectMedico.value = med.nombre;
      cargarObrasSociales(med.nombre);
    } else {
      selectMedico.value = '';
      selectObraSocial.innerHTML = '<option value="">Seleccione...</option>';
    }
    calcularTotal();
  });
  selectObraSocial.addEventListener('change', calcularTotal);

  /*** INICIALIZACIÓN ***/
  actualizarSelects();
  generarHorarios();
  mostrarTurnos();
});
