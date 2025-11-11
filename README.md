# Trabajo Final Integrador - Etapa 4 Final  
**Introducción al Desarrollo Web - 2° Cuatrimestre 2025**  
**Tecnicatura Universitaria en Desarrollo Web (UNER)**  

## Grupo
IDW_19

## Enlace a GITHUB 
(https://github.com/solangeblanc/IDW_19.git)

## Integrantes  
- Solange Blanc
- Sandra Chisté
- Victoria Belén Mamberti
- Leandro Plaza Puga 

## Objetivos de la 1era etapa
- Definir la estructura inicial del sitio web.  
- Crear las páginas básicas solicitadas.  
- Conectar el HTML con CSS.  
- Establecer un estilo simple para la primera versión del sitio. 

## Objetivos de la 2da etapa
- Adaptación del diseño mediante Bootstrap 5 (uso de clases y componentes)
- Combinar con el diseño propio. 
- Catálogo de profesionales.
- Barra de navegación responsive - Versión colapsada para móvil.  
- Diseño claro y consistente.
- Implementación de modo oscuro

## Objetivos de la 3era etapa
- Implementar las funcionalidades de administración de Médicos, incluyendo listar, crear, visualizar, modificar y eliminar registros.
- Inicializar el LocalStorage con datos predeterminados mediante una constante exportada desde un archivo JavaScript. 
- Persistir la información de los profesionales utilizando la API LocalStorage de JavaScript.
- Mostrar los datos en una tabla HTML, asegurando una visualización clara y ordenada.
- Utilizar elementos de formulario adecuados según el tipo de dato (texto, correo, número, etc.).
- (Opcional) Extender las mismas funcionalidades para Especialidades y Turnos.
- Ver el tema del login para admin (no lo dice el pdf).

## Objetivos de la 4ta etapa
- Implementar el inicio de sesión utilizando la API REST pública de DummyJSON (https://dummyjson.com/auth/login), validando credenciales reales de usuarios del endpoint /users.
- Guardar el accessToken en sessionStorage tras un inicio de sesión exitoso, para mantener la sesión activa del usuario.
- Restringir el acceso a las funciones administrativas (como gestión de médicos, obras sociales o turnos) a usuarios no logueados.
- Agregar una página de administración de usuarios, mostrando la lista proveniente de https://dummyjson.com/users sin incluir datos sensibles.
- Presentar un video explicativo (máx. 15 minutos) donde se demuestre el funcionamiento de la aplicación, las decisiones de diseño, el código, la ejecución y la participación de todos los integrantes del grupo.

## Estructura del sitio  
El trabajo cuenta con las siguientes páginas:  
- `index.html`      Página de inicio o portada.  
- `institucional.html`   Información institucional.  
- `contacto.html`   Página de contacto. 
- `altaMedicos.html`   Página de Alta de Medicos. 
- `login.html`   Página de inicio de sesión. 
- `reservarTurno.html`   Página principal para la gestión y reserva de turnos, accesible para visitantes. 
- `reservarTurnoSinLogin.html`   Página que permite a los visitantes consultar médicos disponibles y solicitar un turno sin necesidad de iniciar sesión. 

Una carpeta js que contiene los siguientes archivo:
- `altaMedicos.js` Gestiona todo lo relacionado con el formulario de alta de médicos.
- `app.js` Contiene funcionalidades generales de la web, como el modo oscuro, los mensajes de alerta de los formularios de contacto, y la interacción con las flip cards.
- `catalogoProfesionales.js` Genera dinámicamente las cards de los profesionales de la clínica en la sección correspondiente.
- `data.js` Define y exporta los datos iniciales que se usan para inicializar localStorage.
- `dataValores.js` Define y exporta los valores y parámetros base del sistema, como los costos de consulta por especialidad (VALORES_CONSULTA) y los descuentos asociados a cada obra social (DESCUENTOS_OS).
- `login.js` Define los usuarios predefinidos (por ejemplo, administrador y visitante) y controla el inicio de sesión comparando las credenciales ingresadas con los datos almacenados.
- `reservarTurno.js` Toma los datos del médico, paciente, obra social y especialidad, calcula el valor final de la consulta (aplicando descuentos si corresponde) y guarda la reserva en localStorage.
- `reservarTurnoSinLogin.js` Gestiona la lógica de la reserva de turnos sin autenticación.


Además, se incluye un archivo de estilos dentro de la carpeta CSS:  
- `styles.css`        Define el diseño básico del sitio.

Y dentro de la carpeta CSS también se encuentra otra carpeta llamada "imagenes" que contiene imágenes que se utilizan en el proyecto. 
