document.addEventListener('DOMContentLoaded', () => {

  // Alta de Médicos
  const formAltaMedico = document.getElementById('formAltaMedico');
  if (formAltaMedico) {
    formAltaMedico.classList.add('mi-clase');
  }

  // Flip Cards
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      const inner = card.querySelector('.flip-card-inner');
      if(inner) inner.classList.toggle('flipped');
    });
  });

  // Formulario de Contacto
  const formContacto = document.querySelector('#formContacto');
  const alertDiv = document.getElementById('formAlert');

  if (formContacto && alertDiv) {
    formContacto.addEventListener('submit', function(e) {
      e.preventDefault();

      const inputs = formContacto.querySelectorAll('input, textarea');
      let valido = true;

      inputs.forEach(input => {
        if (!input.value.trim()) valido = false;
      });

      if (!valido) {
        alertDiv.classList.remove('d-none');
        alertDiv.classList.remove('alert-success');
        alertDiv.classList.add('alert', 'alert-danger');
        alertDiv.textContent = 'Por favor, complete todos los campos antes de enviar.';
      } else {
        alertDiv.classList.remove('d-none');
        alertDiv.classList.remove('alert-danger');
        alertDiv.classList.add('alert', 'alert-success');
        alertDiv.textContent = '¡Formulario enviado correctamente!';
        formContacto.reset();
      }
    });
  }

  // Modo Oscuro
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
  const darkModeIcon = document.getElementById('darkModeIcon');
  const darkModeIconMobile = document.getElementById('darkModeIconMobile');
  const body = document.body;

  // Función para cambiar el tema
  function toggleTheme() {
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme);
  }

  // Función para actualizar ambos iconos
  function updateIcons(theme) {
    const iconClass = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    if (darkModeIcon) darkModeIcon.className = iconClass;
    if (darkModeIconMobile) darkModeIconMobile.className = iconClass;
  }

  // Cargar tema guardado
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    body.setAttribute('data-bs-theme', currentTheme);
    updateIcons(currentTheme);
  }

  // Event listeners para ambos botones
  if(darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleTheme);
  }
  
  if(darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener('click', toggleTheme);
  }

  // Visibilidad del nav (aplicable en todas las páginas que cargan js/app.js)
  function getRole(){
    return sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
  }

  function isLogged(){
    return !!(sessionStorage.getItem('username') || localStorage.getItem('logueado'));
  }

  function refreshNav(){
    const altaLink = document.querySelector('a[href="altaMedicos.html"]');
    const reservarLink = document.querySelector('a[href="reservarTurno.html"]');
  // soporta un botón para desktop (#navLoginBtn) y otro para móvil (#navLoginBtnMobile)
  const navLoginBtns = Array.from(document.querySelectorAll('#navLoginBtn, #navLoginBtnMobile'));
    const role = getRole();
    const logged = isLogged();

    if (altaLink) altaLink.style.display = (role === 'admin') ? '' : 'none';
    if (reservarLink) reservarLink.style.display = logged ? '' : 'none';

    if (navLoginBtns && navLoginBtns.length){
      navLoginBtns.forEach(navLoginBtn => {
        if (logged){
          navLoginBtn.textContent = 'Hola, ' + (sessionStorage.getItem('username') || 'Usuario');
          navLoginBtn.classList.remove('btn-outline-light');
          navLoginBtn.classList.add('btn-success');
          navLoginBtn.removeAttribute('href');
          navLoginBtn.onclick = function(){
            sessionStorage.clear();
            localStorage.removeItem('logueado');
            localStorage.removeItem('userRole');
            window.location.reload();
          };
        } else {
          navLoginBtn.textContent = 'Iniciar Sesión';
          navLoginBtn.classList.remove('btn-success');
          navLoginBtn.classList.add('btn-outline-light');
          navLoginBtn.setAttribute('href', 'login.html');
          navLoginBtn.onclick = null;
        }
      });
    }
  }

  // Ejecutar al cargar y cuando cambie el storage (otras pestañas)
  refreshNav();
  window.addEventListener('storage', refreshNav);

});