import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import dotenv from "dotenv";
import program from "../utils/commander.js";
import { only } from "node:test";

const usersCollections = "users";

const enumSocial = ["Local", "GitHub", "Google"];
const enumRole = ["user", "premium", "admin"];


const schema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    legajo: Number,
    email: {String, unique:true },
    edad: Number,
    password: String,
    orders: 
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Orders",
      },
      social: {
        type: String,
        enum: enumSocial,
        default: "Local",
      },
      role: {
        type: String,
        enum: enumRole,
        default: "user",
      },
      resetToken: {
        token: String,
        expiresAt: Date,
      },
      last_connection: {
        type: Date,
        default: null,
      },
      documents: [
        {
          name: String,
          reference: String,
        },

  ], 

});


const UserModel = mongoose.model("users", userSchema);

const { mode } = program.opts(); 





//export default UserModel;

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

const configObject = {
    puerto: process.env.PUERTO, 
    mongo_url: process.env.MONGO_URL
}


import mongoose from "mongoose";
const mongoose = require("mongoose");

//const userSchema = new mongoose.Schema({
   // first_name: {
      //  type: String,
       // required: true
    //},
    //last_name: {
        //type: String,
       // required: true
   //   unique: true
    //}, 
    //password: {
      //  type: String,
      //  required: true
    //},
    //age: {
      //  type: Number,
     //   required: true
    //}      
//})
///const userModel = mongoose.model("user", userSchema);
userSchema.plugin(mongoosePaginate);
export default UserModel;
module.exports = UserModel;
