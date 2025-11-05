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

});