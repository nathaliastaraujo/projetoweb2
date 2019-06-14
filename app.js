// Carregando modulos
var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var index = require("./routes/index");
const path = require("path")
multer = require('multer');
const session = require("express-session")
const flash = require("connect-flash")
const passport = require('passport')
require("./config/aut")(passport)
const db = require("./config/db")

// Configs
//config sessao
app.use(session({
    secret: "projeto",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//middleware

app.use((req, res, next) => {
    res.locals.sucesso_msg = req.flash("sucesso_msg")
    res.locals.erro_msg = req.flash("erro_msg")
    next()
})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
//config sessao
app.use(session({
    secret: "projeto",
    resave: true,
    saveUninitialized: true
}))

app.use(flash())


// Rotas
app.use('/index', index)

// Mongoose
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI).then(() => {
    console.log("MongoDB conectado - projetoweb2 criado")
}).catch((err) => {
    console.log("Erro ao conectar: " + err)
})

// Outros
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})