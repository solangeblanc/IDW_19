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

form.addEventListener('submit', function(e) {
  e.preventDefault(); 
  alertDiv.classList.remove('d-none'); 
});


