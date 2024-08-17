// import express from "express";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import FileStore  from "session-file-store";
// import MongoStore from "connect-mongo";
// const fileStore = FileStore(session);
// import exphbs from "express-handlebars";

import twilio from "twilio";
import "./database.js";
// import sessionsRouter from "./routes/sessions.router.js";
// import viewsRouter from "./routes/views.router.js";

// import passport from "passport";
// import initializePassport from "./config/passport.config.js";
import mangosta from "Mangsota";
import nodemailer from "nodemailer";
const express = require("express");
const app = express();
import configOject from "./config/config.js";
import UserModel from "./models/user.model.js";
import cors from "cors";
const {mongo_url,Puerto} = configOject 

const TWILIO_ACCOUNT_SID = "ACfaf23f26e4751e69130a69a8a3f3cdd3"; 
const TWILIO_AUTH_TOKEN = "398386f770f80f2487709f7053db1d83";
const TWILIO_SMS_NUMBER = "+13133297827";

//conectando a mongo DB

await mongoose.connect(mongo_url)
    .then(() => console.log("Conectados!"))
    .catch((error) => console.log(error))


const exphbs = require("express-handlebars");
//const socket = require("socket.io");
const cookieParser = require("cookie-parser");
require("./database.js");
const PUERTO = 8080;
const passport = require("passport");
const session = require("express-session");
const initializePassport = require("./config/passport.config.js");

const ProductManager = require("../src/controller/product-manager.js");
console.log(ProductManager);
// const productManager = new ProductManager("../express/src/models/product.json");

const productRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js"); 
const sessionsRouter = require("./routes/sessions.router.js");

//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cors());
app.use(express.urlencoded({extended:true}));
//app.use(cookieParser());
const miAltaClaveSecreta = "TinkiWinki";
app.use(cookieParser(miAltaClaveSecreta));
//Le paso la palabra secreta al middleware de Cookie Parser. 
const transport = nodemailer.createTransport({
    service: "gmail", 
    port: 587,
    auth: {
        user: "coderhouse53105@gmail.com",
        pass: "sdwq mebe kqzt ennc"
    }
})

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine","handlebars");
app.set("views","./src/views");

//Middleware de Session: 
app.use(session({
    secret:"secretCoder",
    resave: true,
    //Esta configuración me permite mantener activa la sesion frente a la inactividad del usuario. 

    saveUninitialized: true,
    //Me permite guardar cualquier sesión aun cuando el objeto de sesion no tenga nada para contener. 

    //2) Utilizando el File Storage: 
    //store: new fileStore({path: "./src/sessions", ttl: 100000, retries:1})
    //path: la ruta en donde se van a guardar los archivitos de sesiones. 
    //ttl: Time To Live ( en segundos lo colocamos)
    //retries: cantidad de veces que el servidor tratara de leer el archivo. 

    //3)Utilizando Mongo Store
    // store: MongoStore.create({
    //     mongoUrl:"mongodb+srv://coderhouse53105:coderhouse@cluster0.o9ipohi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    // })
}))

//Cambios con Passport: 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());



//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts",cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);


app.get("/", async (req, res) => {
    try {
        const usuarios = await UserModel.find();
        res.send(usuarios);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})
app.listen(PUERTO,()=>{
    console.log(`Servidor escuchando en el puerto ${PUERTO} `);
})

app.get("/mail", async (req, res) => {
    try {
        await transport.sendMail({
            from: "Banco Macro <seguridad@macro.com>",
            to: "stocaimaza@hotmail.com",
            subject: "Correo de Prueba",
            html: `<h1>Te secuestramos el Visual!</h1>
                    <img src="cid:logo1"> `,
            //Para enviar como un archivo adjunto: 
            attachments: [{
                filename: "logo.jpg",
                path:"./src/public/img/logo.jpg",
                cid: "logo1"
            }]
        })

        res.send("Correo enviado correctamente!");
    } catch (error) {
        res.status(500).send("Error al enviar mail, vamos a morir.");
    }
})

app.post("/enviarmensaje", async (req, res) => {
    const {email, mensaje} = req.body; 

    try {
        await transport.sendMail({
            from: "Coder Test",
            to: email, 
            subject: "TEST",
            text: mensaje
        })

        res.send("Correo enviado exitosamenteee la vida nos sonrieeeee, este find e semana sera perfecto")
    } catch (error) {
        res.status(500).send("Todo nos sale mal, tantas carreras para decidir y elegi la que no tengo talento"); 
    }
})


app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`);
})

//Pasitos para lograr el forkeo: 

import {fork} from "child_process";

app.get("/suma", (req, res) => {
    const child = fork("./src/operacionesComplejas.js");
    child.send("iniciando"); //Acá el proceso padre le envia un mensaje al hijo. 
    child.on("message", resultado => {
        res.send(`El resultado de la operacion es: ${resultado} `);
    })
})



//Configurar un cliente: 
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER);

//Creamos una ruta para enviar sms: 

app.get("/sms", async (req, res) => {
    await client.messages.create({
        body: "Esto es un sms de prueba, no te asustes",
        from: TWILIO_SMS_NUMBER,
        to: "+542236693878"
    })
    res.send("Enviado al SMS!");
})

// const MessageModel = require("./models/message.model.js");
// const io = new socket.Server(httpServer);

//Array de products
//const ProductManager = require("./controllers/product-manager.js");
//const ProductManager = new ProductManager("./src/models/products.json");

//Creamos servidor de Socket.io
//const io = socket(httpServidor);

// io.on("connection",async(socket) => {
//     console.log("Un cliente se conecto");
// })

// socket.on("message", async (data) => {
        
//     //Guardo el mensaje en MongoDB: 
//     await MessageModel.create(data);

//     //Obtengo los mensajes de MongoDB y se los paso al cliente:
//     const messages = await MessageModel.find();
//     io.sockets.emit("message", messages)  
// })

// // enviamos el arrays de products al cliente que se conecto 
// socket.emit("products",await productManager.getProducts());

// // Recibimos el evento "eliminarProduct" desde el cliente:
// socket.on("deleteProduct",async(id) =>{
//     await productManager.deleteProduct(id);
// })


// app.get("/products", async (req, res) => {
//     try {
//         const limit = req.query.limit;
//         const product = await productManager.getProducts();
//         if (limit) {
//             const nuevoArrayRecortado = product.slice(0, limit)
//             res.json(nuevoArrayRecortado);
//         }
//         res.json(product);
//     } catch (error) {
//         res.status(500).json({ error: "Error interno del servidor" })

//     }
// })

// app.get("/products/:pid", async (req,res) => {
//     try{
//         let id = req.params.pid;
//         const product = await productManager.getProductById(parseInt(id));
//         if(!product){
//             return res.json({error:"ID no encontrado"});
//         }
//         res.json(product);
//     } catch(error){
//         res.status(500).json({error: "Error interno del servidor"})
//     }

// })
// //listen del servidor para escuchar puerto


// app.listen(PUERTO, () => {
//     console.log(`Escuchando puerto: ${PUERTO}`);
// })