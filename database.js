 import mongoose from "mongoose";
import configObject from "./config/config.js";
 const { mongo_url } = configObject;

import mongoose from "mongoose";

mongoose.connect("mongodb+srv://coderhouse53105:coderhouse@cluster0.o9ipohi.mongodb.net/JWT?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados a la CoderBase"))
    .catch((error) => console.log("Houston, tenemos un problema: ", error))

//Patron de diseño Singleton:
//padron  utlizado para tener una instancia global a nivel de aplicacion.
//Lo que hace :corrobora si ya existe una intancia de la clase ,si existe la retorna y sino la crea.

class BaseDatos {
    static #instancia; 
    //Se declara una variable estática y privada, significa que pertenece a la clase en si, y no a las instancias individuales de la misma. 
    constructor() {
        mongoose.connect(mongo_url);
    }
    static getInstancia(){
        if( this.#instancia) {
            console.log("Conexion previa");
            return this.#instancia; 
        }

        this.#instancia = new BaseDatos(); 
        console.log("Conexión generada"); 
        return this.#instancia;
    }
}

export default BaseDatos.getInstancia();

    //import mongoose from "mongoose";

//const mongoose = require("mongoose"); 

//2) Crear una conexión con la base de datos. 

//mongoose.connect("mongodb+srv://coderhouse53105:coderhouse@cluster0.o9ipohi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
   //.then(() => console.log("Conexión exitosa"))
    //.catch((error) => console.log("Error en la conexión", error))