var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql')
var app = express(); //Inicializo express
var port = process.env.PORT || 4006; //Ejecuto el servidor en el puerto 300// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors())
app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

 //Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});


app.get('/usuarios', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            SELECT * FROM UsuariosChat
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/register', async function(req,res) {
    console.log(req.body)
    try {
        if (req.body.foto_perfil == null) {
            req.body.foto_perfil = null
        } else {
            req.body.foto_perfil = `'${req.body.foto_perfil}'`
        }
        const respuesta = await realizarQuery(`
            INSERT INTO UsuariosChat (nombre, apellido, mail, contraseña, desc_personal, foto_perfil, en_linea)    
            VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.mail}', '${req.body.contraseña}', '${req.body.desc_personal}', ${req.body.foto_perfil}, ${req.body.en_linea})
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/findUser', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            SELECT * FROM UsuariosChat WHERE mail = '${req.body.mail}'
        `)
        if (respuesta.length > 0)
            res.send({vector: respuesta, existe: true})
        else
            res.send({vector: respuesta, existe: false})
    } catch (error) {
        console.log(error)
    }
})

app.post('/findUserId', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            SELECT id_usuario FROM UsuariosChat WHERE mail = '${req.body.mail}'
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.put('/putOnline', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            UPDATE UsuariosChat
            SET en_linea = ${req.body.en_linea}
            WHERE id_usuario = ${req.body.id_usuario}
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/bringContacts', async function(req,res) {
    try {

        const respuesta = await realizarQuery(`
            Select Chats.foto, nom_grupo, grupo, UsuariosChat.foto_perfil, UsuariosPorChats.id_chat, UsuariosChat.nombre
            FROM Chats
            INNER JOIN UsuariosPorChats ON Chats.id_chat = UsuariosPorChats.id_chat
            INNER JOIN UsuariosChat ON UsuariosPorChats.id_usuario = UsuariosChat.id_usuario
            WHERE UsuariosPorChats.id_chat IN (
                SELECT id_chat FROM UsuariosPorChats WHERE id_usuario = ${req.body.id_usuario}
            ) AND UsuariosChat.id_usuario != ${req.body.id_usuario};
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})


app.post('/getMessages', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            SELECT id_mensajes, id_usuario, contenido, hora
            FROM Mensajes
            WHERE id_chat = ${req.body.id_chat}
            ORDER BY hora ASC
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error al traer mensajes")
    }
})

app.post('/sendMessage', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Mensajes (id_usuario, id_chat, contenido, hora)
            VALUES (${req.body.id_usuario}, ${req.body.id_chat}, '${req.body.contenido}', '${req.body.hora}')
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error al enviar mensaje")  
    }
})


app.post('/newChat', async function(req,res) {
    const crearChat = await realizarQuery(`
        INSERT INTO Chats (grupo)   
        VALUES (${req.body.grupo})
    `)
    const BuscarChatRecienCreado = await realizarQuery(`
        SELECT MAX(id_chat) FROM Chats    
    `)
    console.log(BuscarChatRecienCreado, BuscarChatRecienCreado.id_chat, BuscarChatRecienCreado[0].id_chat)
    const CreacionChatPorUsuarios = await realizarQuery(`
        INSERT INTO UsuariosPorChats (id_chat, id_usuario)
        VALUES (${BuscarChatRecienCreado[0].id_chat}, ${req.body.id_usuario})    
    `)
    const BuscarUsuariosPorChatRecienCreado = await realizarQuery(`
        SELECT MAX(id_usuariosporchats) FROM UsuariosPorChats  
    `)
    res.send({mensaje: "se pudo crear el chat"})

})



