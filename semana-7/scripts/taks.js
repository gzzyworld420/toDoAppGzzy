// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
if (!localStorage.jwt) {
  location.replace("./index.html")
}
/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  AOS.init(); // Inicializa la librería AOS para animaciones y se define en el html el data-aos="fade-right" data-aos-easing="ease-out-cubic" data-aos-duration="1000"

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const URL = "https://todo-api.ctd.academy/v1"
  const uriUsuarios = URL + "/users/getMe"
  const uriTareas = URL + "/tasks"
  const token = localStorage.jwt

  // creo los selectores 
  const btnCerrarSesion = document.querySelector("#closeApp")
  const formCrearTarea = document.querySelector(".nueva-tarea")
  const nuevaTarea = document.querySelector("#nuevaTarea")

  obtenerNombreUsuario()
  consultarTareas()
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    // const cerrarSesion = confirm("¿Está seguro de que desea cerrar sesión?")
    // if (cerrarSesion) {
    //   localStorage.clear()
    //   location.replace("./index.html")
    // }
   Swal.fire({
    title: '¿Desea cerrar sesión?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, quiero salir',
    cancelButtonText: 'No, mejor vuelvo'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Cerraste sesión!',
        'Te esperamos pronto.',
        'success'
      )
      localStorage.clear()
      location.replace("./index.html")
    }
  })
});

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {

    const settings = {
      method: "GET",
      headers: {
        authorization: token
      }
    }

    fetch(uriUsuarios, settings)
      .then(response => response.json())
      .then(data => {
        console.log("Consultando datos del usuario... ");
        console.log(data);
        const nombreUsuario = document.querySelector(".user-info p")
        nombreUsuario.innerText = data.firstName
      })
      .catch(err => console.log(err))
  };


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const settings = {
      method: "GET",
      headers: {
        authorization: token
      }
    }
    console.log("Consultando mis tareas ... ")
    fetch(uriTareas, settings)
      .then(response => response.json())
      .then(tareas => {
        console.log("Tareas del usuario: ... ");
        console.log(tareas);

        renderizarTareas(tareas)
        botonesCambioEstado()
        botonBorrarTarea()
      })
      .catch(err => console.log(err))
  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault()
    console.log("Crear tarea");
    console.log(nuevaTarea.value);

    const payload = {
      description: nuevaTarea.value,
    }
    const settings = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: token
      },
      body: JSON.stringify(payload)
    }


    fetch(uriTareas, settings)
      .then(res => res.json())
      .then(tarea => {
        console.log("Consultando tareas del usuario...");
        console.log(tarea);
        consultarTareas()
      })
      .catch(err => console.log(err))
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    // Obtener los listados y limpiar el contenido que tenga, para que no se sobreescriban las "tarjetas"
    const tareasPendientes = document.querySelector(".tareas-pendientes")
    const tareasTerminadas = document.querySelector(".tareas-terminadas")
    tareasPendientes.innerHTML = ""
    tareasTerminadas.innerHTML = ""

    //Buscamos el contador de tareas en verde de nuestro html
    const numeroFinalizados = document.querySelector("#cantidad-finalizadas")
    let contador = 0
    numeroFinalizados.innerHTML = contador

    listado.forEach(tarea => {
      // Creamos una tarea intermedia para analizar la fecha
      let fecha = new Date(tarea.createdAt)

      if (tarea.completed) {
        contador++
        tareasTerminadas.innerHTML += `
          <li class="tarea" 
            data-aos="fade-right"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="1000" 
          >
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
        `
      } else {
        tareasPendientes.innerHTML += `
       <li class="tarea" 
          data-aos="fade-down"
        >
            <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p>
            </div>
          </li>
        `
      }
      numeroFinalizados.innerHTML = contador
    })
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll(".change")

    btnCambioEstado.forEach(boton => {
      // Asignar a cada botón un listener para poder capturar el id de la tarea a la cual clickeo
      boton.addEventListener("click", (event) => {
        console.log("Cambiar erstado de la tarea... ");
        console.log(event.target);
        console.log(event.target.id);
        const id = event.target.id
        const uriTareaId = `${uriTareas}/${id}`
        const payload = {}


        if (event.target.classList.contains("incompleta")) {
          console.log("tiene la clase");
          //  Si está completado, lo paso a pendiente 
          payload.completed = false
        } else {
          console.log("NO tiene la clase");
          // caso contrario, la tarea está pendiente, y la paso a completa
          payload.completed = true
        }
        const settings = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: token
          },
          body: JSON.stringify(payload)
        }

        fetch(uriTareaId, settings)
          .then(response => {
            console.log(response.status);
            consultarTareas()
          })
          .catch(err => console.log(err))
      })
    })

  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {

    const btnEliminar = document.querySelectorAll(".borrar")

    btnEliminar.forEach(boton => {
      // Asignar a cada botón un listener para poder capturar el id de la tarea a la cual clickeo
      boton.addEventListener("click", (event) => {
        console.log("Eliminar tarea... ");
        console.log(event.target);
        console.log(event.target.id);
        const id = event.target.id
        const uriTareaId = `${uriTareas}/${id}`

        const settings = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: token
          },
        }

        fetch(uriTareaId, settings)
          .then(response => {
            console.log(response.status);
            consultarTareas()
          })
          .catch(err => console.log(err))
      });
    })
  }
})