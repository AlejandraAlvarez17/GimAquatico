const socket = io(); 
//Creamos una instancia de socket.io del lado del cliente. 

//Vamos a guardar el nombre del usuario: 
let user; 
const formularioProductos = document.getElementById("formularioProductos");

formularioProductos.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const precio = document.getElementById("precio").value;

    const data = {
        nombre,
        categoria,
        precio
    }
    
    //..........
    const response = await fetch("/juguetes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if(!response.ok) {
        console.log("Tenemos un error, tendras una mala noticia este fin de semana");
    }

    //Limpiamos el formulario: 
    formularioProductos.reset();
})
//....




const chatBox = document.getElementById("chatBox"); 

//Usamos el objeto Swal
//El método es fire

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingrese un usuario para identificarse en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar"
    }, 
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    console.log(user);
})


chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0 ){
            //trim nos permite sacar los espacios en blanco al principio y al final de un string. 
            //Si sacando los espacios en blanco, el mensaje tiene mas de 0 caracteres, lo enviamos al servidor.
            socket.emit("message", {user:user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})

//Recibimos los mensajes así los mostramos por pantalla: 

socket.on("messagesLogs", (data) => {
    let log = document.getElementById("messagesLogs");
    let mensajes = "";
    data.forEach(mensaje => {
        mensajes = mensajes + `${mensaje.user} dice: ${mensaje.message} <br>`;
    })
    log.innerHTML = mensajes;
})