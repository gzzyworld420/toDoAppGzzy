const setErrors = (message, field, isError = true) => { 
    if (isError) {
        field.classList.add("invalid")
        field.nextElementSibling.classList.add("error")
        field.nextElementSibling.innerText = message
    } else {
        field.classList.remove("invalid")
        field.nextElementSibling.classList.remove("error")
        field.nextElementSibling.innerText = ""
    }
 }


// valida si el input esta vacio
const isEmpty = (message ,e) => { 
    const field = e.target
    const fieldValue = field.value
    console.log(field);

    if (fieldValue.length == 0) {
        setErrors(message,field)
    } else {
        setErrors("", field, false)
    }
 }

/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
    
}

function normalizarTexto(texto) {
    return texto.trim()
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(e) {
    const field = e.target
    const fieldValue = normalizarEmail(field.value)
    const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

    console.log(field);

    if (fieldValue.length > 3 && !regex.test(fieldValue)) { // si el correo ingresado es mayor a 3 caracteres y supera el regex pongo el error
        setErrors(`🚨 Por favor ingrese un ${field.name} válido`,field)
    } else {
        setErrors("", field, false)
    }    
}

function normalizarEmail(email) {
    return email.trim().toLowerCase()
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(e) {
    const field = e.target
    const fieldValue = normalizarTexto(field.value)
    // const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

    console.log(field);

    // if (fieldValue.length > 3 && !regex.test(fieldValue)) {
    if (fieldValue.length < 4) {
        setErrors("‼️ Por favor ingrese una contraseña válida",field)
    } else {
        setErrors("", field, false)
    }    
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    
}

