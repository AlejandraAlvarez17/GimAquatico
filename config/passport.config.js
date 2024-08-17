const passport = require("passport");
import jwt from "passport-jwt";
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword,serializeUser,deserializeUser,cookieExtractor,generateToken } = require("../utils/hashbcrypt.js");

  
  dotenv.config();
  
  const userService = new UserService();
  
  const LocalStrategy = local.Strategy;
  const JWTStrategy = jwt.Strategy;
  const ExtractJwt = jwt.ExtractJwt;
  const GitHubStrategy = github.Strategy;
  const GoogleStrategy = google.Strategy;

export const initializePassport = () => {
    // Creamos la estrategia para el Registro de usuarios:
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await UserModel.findOne({ email });
            if (user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    // Creamos la estrategia para el Login de Usuarios:
    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                console.log("Este usuario no existeeee ehhhh rescatateeee barrilete");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serializar usuarios:
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    });

    // Estrategia de GitHub:
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.c27064b9d23e7f55",
        clientSecret: "b54bc86337b7f94e0dec336468a956eeeb2e12ae",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "Usuario",
                    age: 36,
                    email: profile._json.email,
                    password: "hackeamesipodes",
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
}

// estrategia a nivel global

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
        //Misma palabra secreta que usaste en la app. guarda! ojo! 
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))
}

//Creamos la Cookie Extractor:

const cookieExtractor = (req) => {
    let token = null; 
    if(req && req.cookies) {
        token = req.cookies["coderCookieToken"];
        //Si hay cookie la recupero.
    }
    return token;
};
passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_GITHUB_ID,
        clientSecret: process.env.CLIENT_GITHUB_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          const fullName = profile._json.name.split(" ");
          const name = fullName[0];
          const lastName = fullName[1];

          let user = await UserModel.findOne({email});

          if (!user) {
            const newUser = {
              first_name: name,
              last_name: lastName,
              email,
              age: 18,
              password: "",
              social: "GitHub",
              role: "user",
            };

            user = await userService.createUser(newUser);
          }

          const token = generateToken(user);

          user.token = token;

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_GOOGLE_ID,
        clientSecret: process.env.CLIENT_GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const email = profile._json.email;
          const name = profile._json.given_name;
          const lastName = profile._json.family_name;

          let user = await UserModel.findOne({email});

          if (!user) {
            const newUser = {
              first_name: name,
              last_name: lastName,
              email,
              age: 18,
              password: "",
              social: "Google",
              role: "user",
            };

            user = await userService.createUser(newUser);
          }

          const token = generateToken(user);

          user.token = token;

          return cb(null, user);
        } catch (err) {
          return cb(`Error: ${err}`);
        }
      }
    )
  );

  passport.serializeUser(serializeUser);

  passport.deserializeUser(deserializeUser);


module.exports = initializePassport;
