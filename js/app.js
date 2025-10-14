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
  const darkModeIcon = document.getElementById('darkModeIcon');
  const body = document.body;

  if(darkModeToggle && darkModeIcon) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      body.setAttribute('data-bs-theme', currentTheme);
      updateIcon(currentTheme);
    }

    darkModeToggle.addEventListener('click', function() {
      const currentTheme = body.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
    });
  }

  function updateIcon(theme) {
    if (!darkModeIcon) return;
    darkModeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }

});