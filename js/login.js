// Login usando DummyJSON (https://dummyjson.com/auth/login)
const formLogin = document.getElementById('formLogin');
const alerta = document.getElementById('loginAlerta');

formLogin.addEventListener('submit', async function (e) {
  e.preventDefault();
  alerta.textContent = '';

  const username = document.getElementById('usuario').value.trim();
  const password = document.getElementById('clave').value.trim();

  if (!username || !password) {
    alerta.classList.remove('text-success');
    alerta.classList.add('text-danger');
    alerta.textContent = 'Ingrese usuario y contraseña.';
    return;
  }

  try {
    const resp = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await resp.json();

    if (!resp.ok) {
      alerta.classList.remove('text-success');
      alerta.classList.add('text-danger');
      alerta.textContent = data.message || 'Usuario o contraseña incorrectos.';
      return;
    }

    // Guardar token en sessionStorage
    const token = data.token || data.accessToken || data.refreshToken || data.access_token;
    if (token) sessionStorage.setItem('accessToken', token);
    else sessionStorage.setItem('accessToken', JSON.stringify(data));

    // Guardar username
    sessionStorage.setItem('username', data.username || username);

    // Intentar obtener role del usuario desde /users/{id}
    let role = 'user';
    const userId = data.id;
    if (userId) {
      try {
        const r2 = await fetch(`https://dummyjson.com/users/${userId}`);
        if (r2.ok) {
          const userObj = await r2.json();
          if (userObj && userObj.role) role = userObj.role;
        }
      } catch (err) {
        console.warn('No se pudo obtener role por id:', err);
      }
    } else {
      // fallback: buscar por username en la lista de usuarios
      try {
        const r3 = await fetch('https://dummyjson.com/users');
        if (r3.ok) {
          const all = await r3.json();
          if (all && all.users) {
            const found = all.users.find(u => String(u.username).toLowerCase() === String(username).toLowerCase());
            if (found && found.role) role = found.role;
          }
        }
      } catch (err) {
        console.warn('No se pudo buscar role por username:', err);
      }
    }

    sessionStorage.setItem('userRole', role);

    // Mantener compatibilidad con las páginas que verifican localStorage("logueado")
    if (role === 'admin') {
      localStorage.setItem('logueado', 'true');
      localStorage.setItem('userRole', role);
    } else {
      // remover marca de admin si existe
      localStorage.removeItem('logueado');
      localStorage.setItem('userRole', role);
    }

    // Mostrar mensaje breve según role y redirigir
    alerta.classList.remove('text-danger');
    alerta.classList.add('text-success');
    if (role === 'admin') {
      alerta.textContent = 'Bienvenido administrador — redirigiendo...';
      // Pequeña pausa para que el usuario vea el mensaje
      setTimeout(() => window.location.href = 'altaMedicos.html', 700);
    } else {
      alerta.textContent = 'Bienvenido usuario — redirigiendo...';
      setTimeout(() => window.location.href = 'index.html', 700);
    }

  } catch (err) {
    console.error(err);
    alerta.classList.remove('text-success');
    alerta.classList.add('text-danger');
    alerta.textContent = 'Error de conexión al intentar iniciar sesión.';
  }
});
