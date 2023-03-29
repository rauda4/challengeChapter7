const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const { register, login, generateToken, verifyToken } = require("./model/user");
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();
const passport = require("./lib/passport");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('./views'));
app.use(cookieParser());

app.use(
    session({
      secret: "Buat ini jadi rahasia",
      resave: false,
      saveUninitialized: false,
    })
  );


// midleware passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(flash());

  app.set("view engine", "ejs");

  function restrictLocalStrategy(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
  }

  function pushToMainAuthed(req, res, next){
    const cookie = req.cookies["challengeCH7-FSW"];
    if (cookie === undefined) {
        return next();
    }
    
    const isTokenVerified = verifyToken(cookie)
    if (!isTokenVerified){
        return next();
    }
    res.redirect("/home")
}

  function restrictByCheckCookie (req, res, next) {
    const cookie = req.cookies["challengeCH7-FSW"];
    if (cookie === undefined) {
        res.redirect("/login")
        return
    }
    const isTokenVerified = verifyToken(cookie)
    if (!isTokenVerified){
        res.redirect("/login");
        return
    }
    next();
  }
  

// routing
app.get("/", restrictByCheckCookie, async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
    
});

app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
    try {
        await register({email: req.body.email, password: req.body.password});
        res.redirect("/login");
    } catch (error) {
        console.log({error});
        res.redirect("/register");
    }
});

app.get("/login", pushToMainAuthed, (req, res) => res.render("login"));

// app.post("/login", async (req, res) => {
//     try {
//         await login({ email: req.body.email, password: req.body.password});
//         res.redirect("./home");
    
//     } catch (error) {
//         console.log({error});
//         res.redirect("/login");
//     }
// }); 
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
   })
);

app.post("/login-jwt", async (req, res) => {
    try {
        const user = await login(req.body);
        const token = generateToken(user);
        res.cookie('challengeCH7-FSW', token, { maxAge:3333333, httpOnly:true});
        res.redirect("/home");
    } catch (error) {
        res.redirect("/login");
    }
});

// app.post("/login-jwt", (req, res) => {
// login(req.body).then((user) => {
//     res.json({
//         id: user.id,
//         email: user.email,
//         accesToken: generateToken(user)
//     });
// })
// .catch((err) => { 
//     res.status(400).json({
//         message:"failed to login",
//     });
// });
   
app.get("/whoami", restrictByCheckCookie, (req, res) => {
    console.log("~~", req.user.dataValues);
    res.render("whoami", {username: req.user.email});
});

app.get("/home", restrictByCheckCookie, (req, res) => res.render("home"));
app.get("/game", restrictByCheckCookie, (req, res) => res.render("game"));
app.post("/game", restrictByCheckCookie, (req, res) => res.render("game"));



app.listen(PORT, () =>{
    console.log(`server sudah connect di http://localhost:${PORT}`);
});