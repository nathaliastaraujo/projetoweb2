const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const bcrypt = require('bcryptjs')
const passport = require("passport")

require("../models/Postagem")
const Postagem = mongoose.model('postagens')

require("../models/Usuario")
const Usuario = mongoose.model('usuarios')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/posts', (req, res) => {
    Postagem.find().then((postagens) => {
        res.render('home', {postagens: postagens})
    }).catch((err) => {
        console.log("ERRO AO CARREGAR TWEETS")
        res.redirect('index')
    })
})

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

router.post('/postar', (req, res) => {

    let upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Apenas imagens sao permitidas!'), null);
            }
            const nomearquivo = file.originalname;
            callback(null, true);
        }
    }).single('imagem');

    upload(req, res, function (err) {

        const novaPostagem = {
            texto: req.body.texto.trim(),
            imagem: req.file
        }

        new Postagem(novaPostagem).save().then(function () {
            res.redirect('posts')
            console.log("Postagem realizada com sucesso!")
        }).catch((err) => {
            console.log("Erro ao postar.")
        })
    })
})

router.post('/pesquisa', (req, res) => {
    var query = req.body.pesq;
    Postagem.find({ texto: query }).then((postagens) => {
        res.render('resultado', { postagens: postagens })
    }).catch((err) => {
        console.log("ERRO AO CARREGAR TWEETS")
        res.redirect('posts')
    }) 
})

router.get('/cadastro', (req, res) => {
    res.render('cadastro')
})

router.post('/cadastrar', (req, res) => {

    var erros = []

    if(!req.body.usuario || typeof req.body.usuario == undefined || req.body.usuario == null){
        erros.push({texto: "Usuario inválido!"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido!"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida!"})
    }
    if(!req.body.nascimento || typeof req.body.nascimento == undefined || req.body.nascimento == null){
        erros.push({texto: "Ano de nascimento inválido!"})
    }

    if(erros.length > 0){
        res.render("index", {erros: erros})
    }
    else{

        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                
                // req.flash("erro_msg", "Já existe este usuário")
                res.redirect("cadastro")

             }else{

                const novoCadastro = new Usuario({
                    usuario: req.body.usuario,
                    email: req.body.email,
                    senha: req.body.senha,
                    nascimento: req.body.nascimento
                })
                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoCadastro.senha, salt, (erro, hash) =>{
                        if(erro){
                            res.redirect("login")
                        }

                        //novoCadastro.senha = hash

                        novoCadastro.save().then(() =>{
                            req.flash("sucesso_msg", "Usuario ok")
                            res.redirect("posts")
                            }).catch((err) =>{
                                req.flash("erro_msg", "erro")
                                res.redirect('posts')
                            })
                           
                        
                    })
                })
            
                new Usuario(novoCadastro).save().then(function () {
                    //res.flash("sucesso_msg", "Sucesso!")
                    res.redirect('posts')
                    console.log("Usuario cadastrado com sucesso!")
                })

            }


        })
        
    }


})


router.get("/login", (req, res)=>{
    res.render("login")
})

router.post('/login', (req, res)=>{

    require("../models/Usuario")
    const Usuario = mongoose.model('usuarios')
    let email = req.body.email,
        senha = req.body.senha;
        
        Usuario.find({email: email}).then((usuario) => {
            if( usuario.length <= 0 || usuario[0].senha != senha)
            {
                res.render('posts')
            }
            else if(usuario[0].senha == senha)
            {
                req.session.login = login;
                res.render('posts');
           }

        })



})



module.exports = router