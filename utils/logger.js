import winston, { error, level, transports } from "winston";
// configuracion del logger
//const logger = winston.createLogger({
//transports:[
//  new winston.transports.Console({level:"http"}),
//  new winston.transports.File({
//     filename:"./errors.log",
//     level:"warn"

// })
//]
//})

// Personalizamos logger
const levels = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

//Logger para desarrollo: 
const loggerDesarrollo = winston.createLogger({
    levels: niveles,
    transports: [
        new winston.transports.Console({
            level: "debug"
        })
    ]
})

//Logger para produccion: 
const loggerProduccion = winston.createLogger({
    levels: niveles,
    transports: [
        new winston.transports.Console({
            level: "info"
        }),
        //Agregamos el archivo: 
        new winston.transports.File({
            filename: "./errors.log",
            level: "error"
        })
    ]
})




const logger = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: "http",
            format: winston.format.combine(winston.format.colorize({
                colors: levels.
                    colors
            }),
                winston.format.simple())
        }),
        
        // New transport :
        new winston.transports.File({
            filename: "./errors.log",
            level: "warning",
            format: winston.format.simple()

        })
    ]
})

//Determinar que lugar utilizar. 
const logger = node_env == "produccion" ? loggerProduccion : loggerDesarrollo;
/// Middleware

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();

}

export default addLogger;
