document.addEventListener("DOMContentLoaded", () => {
  const logueado = localStorage.getItem("logueado");
  const userRole = localStorage.getItem("userRole");

  if (!logueado || userRole !== "admin") {
    alert("Acceso restringido. Por favor, inicie sesión.");
    window.location.href = "login.html";
  }
});