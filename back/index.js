var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4006; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/*
BACK: TODA LA COMUNICACION CON LA BASE DE DATOS
FRONT: TODA LA COMUNICACION CON EL CLIENTE / INDEX / PERSONA QUE VISITA UNA WEB (LO QUE VE)

BDD -- BACK -- FRONT
FRONT ---> BACK ---> BDD ---> BACK ---> FRONT
 */

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */



app.get('/students', async function(req,res){
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Students WHERE id=${req.query.id}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Students");
    }    
    res.send(respuesta);
})

app.post('/students', function(req,res) {
    console.log(req.body) //Los pedidos post reciben los datos del req.body
    realizarQuery(`
    INSERT INTO Students ("id","FirstName","LastName","mail","id_grade") VALUES
        (${req.body.id},${req.body.FirstName},${req.body.LastName},${req.body.mail},${req.body.id_grade});
    `)
    res.send("Estudiante agregado")
})

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});


// TP 3

/*
PEDIDOS:
GET: OBTIENE INFORMACION DE UNA BASE DATOS -->req
POST: INSERTA DATOS EN UNA BASE DE DATOS.-->body
PUT: ACTUALIZA DATOS EN UNA BASE DE DATOS.-->body
DELETE: ELIMINA UNA FILA DE UNA BASE DE DATOS.-->body
 */


// https//:localhost: 4000/clubes

app.get('/pepito', async function(req,res){
    const holasofia = await realizarQuery(`
        SELECT * FROM Clubes;
    `)
    
})

app.get('/clubes', async function(req, res){
    console.log(req.query);
    const respuestaclubes = await realizarQuery(`
    SELECT * FROM Clubes;
    `)
    console.log({respuestaclubes})
    res.send(respuestaclubes)
})





app.get('/jugadores', async function(req, res){
    console.log(req.query);
    const respuestajugadores = await realizarQuery(`
    SELECT * FROM Jugadores;
    `)
    console.log({respuestajugadores})
    res.send(respuestajugadores)
})

app.get('/estadios', async function(req, res){
    console.log(req.query);
    const respuestaestadios = await realizarQuery(`
    SELECT * FROM Estadios;
    `)
    console.log({respuestaestadios})
    res.send(respuestaestadios)
})



app.get('/dnideljugador', async function(req, res){
    console.log(req.query.dni);
    const respuestadni = await realizarQuery(`
    SELECT * FROM Jugadores WHERE dni = "${req.query.dni}";
    `)
    console.log({respuestadni})
    res.send(respuestadni)
})

app.post('/insertarclub', async function(req,res) {
    console.log(req.body)
    // Forma 1: Hacer un select y te traes todos los clubes, y ahi recorres el vector a ver si ya existe. SI existe le decis al usuario y sino lo agregas (if else)
    // Forma 2: Hacer un select con un WHERE, cosa de q si trae un dato significa que existe, SI existe le decis al usuario y sino lo agregas (if else)
    // [], vector.length == 0
  
    console.log(req.body.id_club);
    const existe = await realizarQuery(`SELECT * FROM Clubes WHERE id_club = ${req.body.id_club}`)
    console.log(existe)
        //Si existe es un vector vacio su largo es cero
       if (existe.length == 0) {
        await realizarQuery(`
            INSERT INTO Clubes (id_club, cant_jugadores, tiene_colegio, año_fundacion, id_estadio, nombre)
            VALUES ('${req.body.id_club}', '${req.body.cant_jugadores}', '${req.body.tiene_colegio}', '${req.body.año_fundacion}', '${req.body.id_estadio}', '${req.body.nombre}')`);
            res.send({mensaje:"Aca tenes tu club"}) // Le respondo amablemente
        } else {
            res.send({mensaje:"No se puede ingresar debido a que el club ya existe"})
        }
})

app.post('/insertarjugador', async function(req,res) {
    console.log(req.body)
    console.log(req.body.dni);
    const existe2 = await realizarQuery(`SELECT * FROM Jugadores WHERE dni = ${req.body.dni}`)
    console.log(existe2)
        if (existe2.lenght == 0) {
            await realizarQuery(`
                INSERT INTO Jugadores (dni, posicion, edad, altura, id_club)
                VALUES ('${req.body.dni}', '${req.body.posicion}', '${req.body.edad}', '${req.body.altura}', '${req.body.id_club}')`);
                res.send("Aca tenes al perro de tu jugador") // Le respondo amablemente
        } else {
            res.send("ERROR EL JUGADOR YA EXISTE")
        }
})

app.post('/insertarestadio', async function(req,res) {
    console.log(req.body)
    console.log(req.body.id_estadio);
    const existe3 = await realizarQuery(`SELECT * FROM Estadios WHERE id_estadio = ${req.body.id_estadio}`)
    console.log(existe3)
        if (existe3.lenght == 0) {
            await realizarQuery(`
                INSERT INTO Estadios (id_estadio, capacidad, ubicacion, nombre)
                VALUES ('${req.body.id_estadio}', '${req.body.capacidad}', '${req.body.ubicacion}', '${req.body.nombre}')`);
                res.send("Aca tenes tu estadio") // Le respondo amablemente
        } else {
            res.send("ERROR EL ESTADIO YA EXISTE")
        }
    
})


app.put('/clubesput', async function (req, res) {
    console.log(req.body)
    await realizarQuery(`
        UPDATE Clubes 
        SET nombre = "${req.body.nombre}", cant_jugadores = ${req.body.cantidad}
        WHERE id_club = ${req.body.id_club}`);
    res.send({mensaje:"Actualizado el club"}) // club actualizado   
})

app.put('/estadiosput', async function (req, res) {
    console.log(req.body)
    await realizarQuery(`
        UPDATE Estadios 
        SET capacidad = ${req.body.capacidad}, nombre = "${req.body.nombre}"
        WHERE id_estadio = ${req.body.id_estadio}`);
    res.send("Actualizado el Estadio") // estadio actualizado   
})

app.put('/jugadoresput', async function (req, res) {
    console.log(req.body)
    await realizarQuery(`
        UPDATE Jugadores 
        SET edad = ${req.body.edad}, posicion = "${req.body.posicion}"
        WHERE dni = ${req.body.dni}`);
    res.send("se ha actualizado al jugador") // jugador actualizado   
})

app.delete('/clubdelete', async function (req,res) {
    console.log(req.body)
    await realizarQuery(`
        DELETE FROM Clubes
        WHERE id_club = ${req.body.id_club}`);
    res.send({mensaje:"Se ha borrado el club"}) // club borrado
})

app.delete('/estadiodelete', async function (req,res) {
    console.log(req.body)
    await realizarQuery(`
        DELETE FROM Estadio
        WHERE id_estadio = ${req.body.id_estadio}`);
    res.send("Se ha borrado el estadio") // estadio borrado
})

app.delete('/jugadordelete', async function (req,res) {
    console.log(req.body)
    await realizarQuery(`
        DELETE FROM Jugadores
        WHERE dni = ${req.body.dni}`);
    res.send("Se ha borrado el jugador") // jugador borrado
})

// ACA COMIENZA EL TP CUATRO, 4 (FOUR) (2 +2 ) (2E2) (RAIZ CUADRADA DE DOS ELEVADA AL CUADRADO TODO ELEVADO AL CUADRADO)

// ejericicio 1 y 2

app.get('/animales', async function (req,res) {
    try {
        if (req.query.especie != undefined) {
            console.log(req.query);
            const animalestabla = await realizarQuery(`SELECT * FROM Animales WHERE Especie = "${req.query.especie}";`)
            res.send(animalestabla)
        } else {
            const animalestabla = await realizarQuery(`SELECT * FROM Animales;`)
            res.send(animalestabla)
        }
    }   catch (e) {
            res.send(e);
    }    
})

// ejericcio 3
//Crear un pedido HTTP Post para agregar animales a la base de datos. 
//Antes de agregarlos se deberá chequear que no exista un animal con el mismo nombre.

app.post('/animalput', async function (req,res) {    
    console.log(req.body)
    let duplicado = await realizarQuery(`SELECT * FROM Animales WHERE nombre = '${req.body.nombre}'`);
    try {
        if (duplicado.lenght > 0) {
            res.send("Este animal ya existe");
        } else {
            realizarQuery(`
                INSERT INTO Animales (ID, Nombre, Especie, Edad)
                    VALUES ('${req.body.ID}', '${req.body.Nombre}', '${req.body.Especie}', '${req.body.Edad}')`);
                res.send("El animal se agrego correctamente")
        }
    } catch (error) {
        res.send(error)
    }
   
})


// ejercicio 4
// Realizar un pedido HTTP Get para traer el promedio de las edades de todos los animales. 
// Permitirle al usuario que si envía una especie en particular, haga el promedio de la edad sólo de los animales de dicha especie.
app.get('/animalprom', async function (req,res) {
    try {
        if (req.query.Especie != undefined) {
            console.log(req.query)
            let promedio = await realizarQuery(`
                SELECT AVG(Edad) AS Edad From Animales WHERE Especie = '${req.query.Especie}'`)
            res.send(promedio)
        } else {
            let promedio = await realizarQuery(`
                SELECT AVG(Edad) AS Edad FROM Animales`)
            res.send(promedio)
        }
    } catch (e) {
        res.send(e)
    }
})

// ejercicio 5
// Realizar un pedido HTTP Put para modificar la edad de un animal al recibir el nombre del mismo y la nueva edad.

app.put('/edadmod', async function (req,res) {
    console.log(req.body)
    try {
        await realizarQuery(`
            UPDATE Animales
            SET Edad = ${req.body.edad}
            WHERE Nombre = ${req.body.nombre}`)
    } catch (error) {
        res.send(error)
    }
})


// Ejercicio 6 y 7
//  Crear un pedido HTTP Get para traer todos los datos de la tabla de libros.
// Modificar el pedido anterior para permitir al usuario filtrar por género o autor. Si ingresa un género o un autor, 
// sólo trae toda la información de los libros de dicho género o autor. (El pedido debe funcionar perfectamente con una u otra opció

app.get('/libros', async function (req,res) {
    console.log(req.query);
    try {
        if (req.query.genero != undefined) {
            let libros = await realizarQuery(`
                SELECT * FROM Libros WHERE Genero = '${req.query.genero}';
                `)
            console.log({libros})
            res.send(libros)
        } else if (req.query.autor != undefined) {
            let libros = await realizarQuery(`
                SELECT * FROM Libros WHERE Autor = '${req.query.autor}';
                `)
            console.log({libros})
            res.send(libros)
        } else {
            let libros = await realizarQuery(`
                SELECT * FROM Libros;
                `)
                console.log({libros})
                res.send(libros)
        }
    } catch (error) {
        res.send(error)
    }
    
   
})

// Ejercicio 8 
app.post('/agregarlibro', async function (req,res) {
    console.log(req.body)
    try {
        let duplicado = await realizarQuery(`SELECT * FROM Libros WHERE nombre = '${req.body.nombre}'`)
        if (duplicado.lenght > 0) {
            res.send("ESTE LIBRO YA EXISTE MADAFAKER")
        } else {
            realizarQuery(`
                INSERT INTO Libros (id, nombre, autor, año_de_publicacion, genero, cantidad_de_paginas, breve_descripcion, valoracion_critica)
                    VALUES ('${req.body.id}', '${req.body.nombre}', '${req.body.autor}', '${req.body.año_de_publicacion}', '${req.body.genero}', '${req.body.cantidad_de_paginas}', '${req.body.breve_descripcion}', '${req.body.valoracion_critica}')`);
                res.send("El Libro se agrego correctamente")
        }
    } catch (error) {
        res.send(error)  
    }
})

// Ejercicio 9
//Realizar un pedido HTTP Get para traer toda la información de los libros comprendido entre un periodo de 2 años,
// para lo cual se deben recibir 2 años ingresados por el usuario y
// se deberá mostrar la información de los libros cuyo año de publicación esté dentro de ese rango.

app.get('/librosinfo', async function (req,res) {
    console.log(req.query)
    try {
        const libros = await realizarQuery(`SELECT * FROM Libros WHERE año_de_publicacion BETWEEN ${req.query.año1} AND ${req.query.año2}`)
        res.send(libros)
    } catch (error) {
        res.send(error)
    }
})


// ---------------------------------------------------------- tp mitad de año -------------------------------------------------------------




app.get('/usuarios', async function(req, res){
    try {
        console.log(req.query);
        const usuarios = await realizarQuery(`
        SELECT * FROM Usuarios;
        `)
        console.log({usuarios})
        res.send(usuarios)
    } catch (error) {
        console.log(error)
    }
})

app.get('/respuestas', async function(req, res){
    try {
        const respuestas = await realizarQuery(`
            SELECT * FROM Respuestas;
            `)
            console.log({respuestas})
            res.send(respuestas)
    } catch (error) {
        console.log(error)
    }
})

app.post('/respuestasEsp', async function(req,res){
    try {
        const respuestas = await realizarQuery(`
            SELECT * FROM Respuestas WHERE id_pregunta = ${req.body.id_pregunta};
            `)
            console.log({respuestas})
            res.send(respuestas)
    } catch (error) {
        console.log(error)
    }
})

app.get('/preguntas', async function(req, res){
    try {
        console.log(req.query);
        const preguntas = await realizarQuery(`
        SELECT * FROM Preguntas;
        `)
        console.log({preguntas})
        res.send(preguntas)
    } catch (error) {
        console.log(error)
    }
})

// --------------------------------- LOGIN ----------------------------------------------------------------------------------------

app.post('/usuarioExiste', async function(req,res){
    try {
        console.log("Recibido:", req.body.usuario, req.body.contraseña);
        const usuario = await realizarQuery(`
            SELECT * FROM Usuarios WHERE usuario = '${req.body.usuario}' and contraseña = '${req.body.contraseña}'
        `)
        console.log(usuario)
        res.send(usuario)
    } catch (error) {
        console.log(error)
    }
})

app.post('/conseguirId', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            SELECT id FROM Usuarios WHERE usuario = '${req.body.usuario}'    
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/esAdmin', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            SELECT es_admin FROM Usuarios WHERE usuario = '${req.body.usuario}'    
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})


// REGISTER -------------------------------------------------------------------------------------------------------------------

app.post('/usuarioExisteRegistro', async function(req,res){
    try {
        console.log("Recibido:", req.body.usuario);
        const usuario = await realizarQuery(`
            SELECT * FROM Usuarios WHERE usuario = '${req.body.usuario}'
        `)
        console.log(usuario)
        res.send(usuario)
    } catch (error) {
        console.log(error)
    }
})

app.post('/insertarUsuario', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Usuarios (usuario, contraseña, puntaje, tiempo, es_admin)
            VALUES ('${req.body.usuario}','${req.body.contraseña}','${req.body.puntaje}','${req.body.tiempo}','${req.body.es_admin}')
        `)
        res.send({mensaje: "Se inserto el Usuario, Haga el Login"})
    } catch (error) {
        console.log(error)
    }
})

// Usuarios -----------------------------------------------------------------------------------------------------------------------

app.delete('/EliminarUsuario', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            DELETE FROM Usuarios WHERE id = ${req.body.id}
        `)
        res.send({mensaje: "Se Elimino el usuario"})
    } catch (error) {
        console.log(error)
    }
})

app.put('/EditarPuntaje', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            UPDATE Usuarios
            SET puntaje = '${req.body.puntaje}'
            WHERE id = ${req.body.id}
        `)
        res.send({mensaje: "Puntaje editado con exito"})
    } catch (error) {
        console.log(error)
    }
})


// PREGUNTAS ------------------------------------------------------------------------------------

app.post('/subirPregunta', async function(req,res){
    try {
        if (req.body.imagen == null) {
            const respuesta = await realizarQuery(`
                INSERT INTO Preguntas (pregunta, categoria, imagen)
                VALUES ('${req.body.pregunta}','${req.body.categoria}', ${req.body.imagen})
            `)
        } else {
            const respuesta = await realizarQuery(`
                INSERT INTO Preguntas (pregunta, categoria, imagen)
                VALUES ('${req.body.pregunta}','${req.body.categoria}', '${req.body.imagen}')
            `)
        }
        res.send({mensaje: "Se insertó la pregunta"})
    } catch (error) {
        console.log(error)
    }
})

app.post('/subirPreguntaSinImagen', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Preguntas (pregunta, categoria, imagen)
            VALUES ('${req.body.pregunta}','${req.body.categoria}', ${req.body.imagen})
        `)
        res.send({mensaje: "Se insertó la pregunta"})
    } catch (error) {
        console.log(error)
    }
})

app.delete('/EliminarPregunta', async function(req,res){
    try {
        const result = await realizarQuery(`
            DELETE FROM Respuestas WHERE id_pregunta = ${req.body.id_pregunta}    
        `)
        const respuesta = await realizarQuery(`
            DELETE FROM Preguntas WHERE id_pregunta = ${req.body.id_pregunta}
        `)
        res.send({mensaje: "Se Elimino la pregunta"})
    } catch (error) {
        console.log(error)
    }
})

app.put('/EditarPregunta', async function(req,res){
    try {
        const response = await realizarQuery(`
            UPDATE Preguntas
            SET pregunta = '${req.body.pregunta}'
            WHERE id_pregunta = ${req.body.id_pregunta}
        `)
        res.send({mensaje: "Pregunta editada con exito"})
    } catch (error) {
        console.log(error)
    }
})


app.put('/EditarRutaImagen', async function(req,res){
    try {
        const response = await realizarQuery(`
            UPDATE Preguntas
            SET imagen = '${req.body.imagen}'
            WHERE id_pregunta = ${req.body.id_pregunta}
        `)
        res.send({mensaje: "Imagen editada"})
    } catch (error) {
        console.log(error)
    }
})

app.post('/conseguirIdPregunta', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            SELECT id_pregunta FROM Preguntas WHERE pregunta = '${req.body.pregunta}'    
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})


// RESPUESTAS ------------------------------------------------------------------------------------------------------ 

app.post('/subirRespuesta', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Respuestas (id_pregunta, correcta, respuesta)
            VALUES (${req.body.id_pregunta}, ${req.body.correcta}, '${req.body.respuesta}')
        `)
        res.send({mensaje: "Se insertó la respuesta"})
    } catch (error) {
        console.log(error)
    }
})

app.put('/EditarRespuesta', async function(req,res){
    try {
        const response = await realizarQuery(`
            UPDATE Respuestas
            SET respuesta = '${req.body.respuesta}'
            WHERE id_respuesta = ${req.body.id_respuesta}
        `)
        res.send({mensaje: "Respuesta editada con exito"})
    } catch (error) {
        console.log(error)
    }
})


// --------------------------------- PARTE DEL JUEGO ----------------------------------------------------------------------------------

app.get('/categorias', async function(req, res){
    try {
        console.log(req.query);
        const categorias = await realizarQuery(`
        SELECT categoria FROM Preguntas;
        `)
        res.send(categorias)
    } catch (error) {
        console.log(error)
    }
})

app.post('/preguntaResponder', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            SELECT pregunta FROM Preguntas WHERE categoria = '${req.body.categoria}'
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/preguntaImagen', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            SELECT imagen FROM Preguntas WHERE pregunta = '${req.body.pregunta}'    
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/verificacionRespuesta', async function (req,res) {
    try {
        const respuesta = await realizarQuery(`
            Select correcta FROM Respuestas WHERE respuesta = '${req.body.respuesta}' and id_pregunta = ${req.body.id_pregunta}   
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/BuscarPuntajeUsuario', async function (req,res) {
    try {
        const respuesta = await realizarQuery(`
            Select puntaje FROM Usuarios WHERE id = '${req.body.id}'   
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/BuscarTiempoUsuario', async function (req,res) {
    try {
        const respuesta = await realizarQuery(`
            Select tiempo FROM Usuarios WHERE id = '${req.body.id}'   
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.put('/update', async function(req,res){
    try {
        const response  = await realizarQuery(`
            UPDATE Usuarios
            SET puntaje = '${req.body.puntaje}', tiempo = '${req.body.tiempo}'
            WHERE id = '${req.body.id}'
        `)
        res.send({mensaje: "Puntaje y/o Tiempo editado con exito"})
    } catch (error) {
        console.log("Error en la funcion")
    }
})

app.get('/ranking', async function(req, res) {
    try {
        const resultado = await realizarQuery(`
            SELECT * FROM Usuarios
            WHERE tiempo > 0
            ORDER BY puntaje DESC, tiempo ASC
        `);
        res.send(resultado);
    } catch (error) {
        console.log("Error al obtener el ranking", error);
    }
});