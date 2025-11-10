import { MEDICOS_INICIALES } from './data.js';
import { VALORES_CONSULTA, DESCUENTOS_OS } from './dataValores.js';

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
    const selectObraSocialTurno = document.getElementById('obraSocialTurno');
    const inputValorConsultaTurno = document.getElementById('valorConsultaTurno');
    const inputPorcentajeDescuentoTurno = document.getElementById('porcentajeDescuentoTurno');
    const inputValorFinalTurno = document.getElementById('valorFinalTurno');
    const selectHoraTurno = document.getElementById('horaTurno');
    const tbodyTurnos = document.getElementById('turnosRegistrados');
    const alertaTurnosDiv = document.getElementById('alertaTurnos');

    /*** DATOS BASE ***/
    let medicos = JSON.parse(localStorage.getItem('medicos')) || MEDICOS_INICIALES;
    let especialidades = [...new Set(medicos.map(m => m.especialidad))];
    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

    /*** FUNCIONES AUXILIARES ***/
    const normalize = str =>
        str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";

    const guardarMedicos = () => localStorage.setItem('medicos', JSON.stringify(medicos));
    const guardarTurnos = () => localStorage.setItem('turnos', JSON.stringify(turnos));

    const mostrarAlerta = (msg, contenedor) => {
        contenedor.innerHTML = `<div class="alerta-mensaje">${msg}</div>`;
        setTimeout(() => contenedor.innerHTML = "", 5000);
    };

    /*** HORARIOS ***/
    function generarHorarios() {
        selectHoraTurno.innerHTML = '<option value="">Seleccione...</option>';
        for (let h = 8; h < 20; h++) {
            ['00', '30'].forEach(m => {
                const opt = document.createElement('option');
                opt.value = `${String(h).padStart(2,'0')}:${m}`;
                opt.textContent = `${String(h).padStart(2,'0')}:${m}`;
                selectHoraTurno.appendChild(opt);
            });
        }
    }

    /*** CRUD MÉDICOS ***/
    function mostrarMedicos() {
        tbodyMedicos.innerHTML = medicos.length ? medicos.map((med, idx) => `<tr>
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

        const nuevoMedico = { nombre, especialidad, telefono, obrasSociales, email, foto: './CSS/imagenes/default-doctor.jpg' };
        medicos.push(nuevoMedico);
        if (!especialidades.includes(especialidad)) especialidades.push(especialidad);
        guardarMedicos();
        mostrarMedicos();
        mostrarEspecialidades();
        formMedico.reset();
        mostrarAlerta("✅ Médico registrado correctamente.", alertaMedicosDiv);
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
    let editEspecialidadIndex = null;

    function mostrarEspecialidades() {
        listaEspecialidadesUl.innerHTML = '';
        especialidades.sort().forEach((esp, idx) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            const spanTexto = document.createElement('span');
            spanTexto.textContent = esp;
            const divBotones = document.createElement('div');

            const btnEditar = document.createElement('button');
            btnEditar.className = 'btn btn-sm btn-warning me-2';
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => {
                inputNuevaEspecialidad.value = esp;
                editEspecialidadIndex = idx;
            });

            const btnBorrar = document.createElement('button');
            btnBorrar.className = 'btn btn-sm btn-danger';
            btnBorrar.textContent = 'Eliminar';
            btnBorrar.addEventListener('click', () => {
                if (confirm(`¿Eliminar especialidad "${esp}"?`)) {
                    especialidades.splice(idx, 1);
                    mostrarEspecialidades();
                    mostrarAlerta('🗑️ Especialidad eliminada.', alertaEspecialidadesDiv);
                    actualizarSelectsTurnos();
                }
            });

            divBotones.appendChild(btnEditar);
            divBotones.appendChild(btnBorrar);
            li.appendChild(spanTexto);
            li.appendChild(divBotones);
            listaEspecialidadesUl.appendChild(li);
        });
        actualizarSelectsTurnos();
    }

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

    /*** TURNOS ***/
    function actualizarSelectsTurnos() {
        selectMedicoTurno.innerHTML = '<option value="">Seleccione...</option>';
        medicos.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.nombre;
            opt.textContent = m.nombre;
            selectMedicoTurno.appendChild(opt);
        });

        selectEspecialidadTurno.innerHTML = '<option value="">Seleccione...</option>';
        especialidades.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e;
            opt.textContent = e;
            selectEspecialidadTurno.appendChild(opt);
        });
    }

    function cargarObrasSociales(medico) {
        selectObraSocialTurno.innerHTML = '<option value="">Seleccione...</option>';
        if (!medico) return;
        const med = medicos.find(m => m.nombre === medico);
        if (med && med.obrasSociales) {
            const obras = Array.isArray(med.obrasSociales) ? med.obrasSociales : med.obrasSociales.split(',').map(o=>o.trim());
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
        inputValorFinalTurno.value = (valor - valor*(descuento/100)).toFixed(2);
    }

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

    let actualizarTurnoListener = null;
    let modoEdicion = false;

    function validarTurno(paciente, medico, especialidad, obraSocial, fecha, hora, idxEdicion = null) {
        const palabras = paciente.split(' ').filter(p => p.length>0);
        const nombreValido = palabras.length >=2 && palabras.every(p => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(p)) && paciente.replace(/\s/g,'').length>4;
        if(!nombreValido) return "⚠️ El nombre del paciente debe tener al menos dos palabras, empezar con mayúscula y más de 4 letras.";
        if(!medico || !especialidad || !obraSocial || !fecha || !hora) return "⚠️ Complete todos los campos.";
        const [anio,mes,dia]=fecha.split('-').map(Number);
        const [h,m]=hora.split(':').map(Number);
        const fechaHora=new Date(anio,mes-1,dia,h,m);
        const ahora=new Date();
        if(fechaHora<ahora) return "⚠️ La fecha y hora no pueden ser anteriores a la actual.";
        if(h<8||h>20) return "⚠️ La hora del turno debe estar entre 08:00 y 20:00.";
        if(fechaHora.getFullYear()>2030) return "⚠️ El año no puede ser mayor a 2030.";
        const existe = turnos.some((t,i)=>i!==idxEdicion && t.medico===medico && t.fecha===fecha && t.hora===hora);
        if(existe) return `⚠️ Ya existe un turno para ${medico} el ${fecha} a las ${hora}.`;
        return null;
    }

    function mostrarTurnos() {
        tbodyTurnos.innerHTML='';
        if(!turnos.length) {
            tbodyTurnos.innerHTML=`<tr><td colspan="8" class="text-center">No hay turnos registrados</td></tr>`;
            return;
        }
        turnos.forEach((t,i)=>{
            const tr=document.createElement('tr');
            tr.innerHTML=`
                <td>${t.paciente}</td>
                <td>${t.medico}</td>
                <td>${t.especialidad}</td>
                <td>${t.obraSocial || ''}</td>
                <td>${t.fecha}</td>
                <td>${t.hora}</td>
                <td>$${t.total || ''}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editarTurno(${i})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${i})">Eliminar</button>
                </td>
            `;
            tbodyTurnos.appendChild(tr);
        });
    }

    function agregarTurno(e){
        e.preventDefault();
        const paciente = document.getElementById('nombrePaciente').value.trim();
        const medico = selectMedicoTurno.value;
        const especialidad = selectEspecialidadTurno.value;
        const obraSocial = selectObraSocialTurno.value;
        const fecha = document.getElementById('fechaTurno').value;
        const hora = selectHoraTurno.value;
        const valor = parseFloat(inputValorConsultaTurno.value)||0;
        const descuento = parseFloat(inputPorcentajeDescuentoTurno.value)||0;
        const total = parseFloat(inputValorFinalTurno.value)||0;

        const error = validarTurno(paciente,medico,especialidad,obraSocial,fecha,hora);
        if(error){mostrarAlerta(error,alertaTurnosDiv);return;}

        turnos.push({paciente,medico,especialidad,obraSocial,fecha,hora,valor,descuento,total});
        guardarTurnos();
        mostrarTurnos();
        formTurno.reset();
        selectObraSocialTurno.innerHTML='<option value="">Seleccione...</option>';
        mostrarAlerta("✅ Turno registrado correctamente.", alertaTurnosDiv);
    }

    window.editarTurno = function(i){
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

        turnos[i] = { paciente, medico, especialidad, obraSocial, fecha, hora, valor, descuento, total };
        guardarTurnos();
        mostrarTurnos();
        formTurno.reset();
        selectObraSocialTurno.innerHTML = '<option value="">Seleccione...</option>';
        mostrarAlerta("✏️ Turno actualizado correctamente.", alertaTurnosDiv);

        formTurno.onsubmit = agregarTurno;
    };
};

    window.eliminarTurno=i=>{ if(confirm('¿Eliminar este turno?')){ turnos.splice(i,1); guardarTurnos(); mostrarTurnos(); mostrarAlerta('🗑️ Turno eliminado.',alertaTurnosDiv);}};

    /*** EVENTOS ***/
    formMedico.addEventListener('submit', agregarMedico);
    formEspecialidad.addEventListener('submit', agregarEspecialidad);
    formTurno.addEventListener('submit', agregarTurno);

    /*** INICIALIZACIÓN ***/
    mostrarMedicos();
    mostrarEspecialidades();
    mostrarTurnos();
    generarHorarios();
});