//Institucional

// Tap o click en mobile para las tarjetas

document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.querySelector('.flip-card-inner').classList.toggle('flipped');
  });
});


//Contacto

// Alert JS en Formulario de Contacto
const form = document.querySelector('form');
const alertDiv = document.getElementById('formAlert');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    alertDiv.classList.remove('d-none'); 
  });
}

// Modo Oscuro
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIcon = document.getElementById('darkModeIcon');
  const body = document.body;

  // Verificar si hay preferencia guardada
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    body.setAttribute('data-bs-theme', currentTheme);
    updateIcon(currentTheme);
  }

  // Event listener para el botón
  darkModeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
  });

  // Función para actualizar el icono
  function updateIcon(theme) {
    if (theme === 'dark') {
      darkModeIcon.className = 'bi bi-sun-fill';
    } else {
      darkModeIcon.className = 'bi bi-moon-fill';
    }
  }
});

