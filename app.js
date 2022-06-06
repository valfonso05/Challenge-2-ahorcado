;(function(){
"use strict"    


// Obtiene y guarda el listado de palabras en el localSrage
var palabras

if (localStorage.getItem("palabras")) {
  palabras =  JSON.parse(localStorage.palabras)
} else {
    palabras = [
        "ALURA",
        "PROGRAMA",
        "JAVA",
        "CODIGO",
        "AHORCADO",
        "SCRIPT",
        "COMPILAR"
    ]
    localStorage.setItem("palabras", JSON.stringify(palabras))
} 

// Funcion para gregar palabras al listado de palabras
window.agregarPalabra = function agregarPalabra(termino){

    termino = termino.toUpperCase();
    
    // Validar que no venga vacio, sea mayor a 2 letras y menor a 8
    if (!termino || termino.length <=2 || termino.length > 8) {
        alert("No menor de 3 y mayor a 8 letras. ");
        return;
    } 
    // Verifica si la palabra ya esta registrada en el listado de palabras
    if (palabras.indexOf(termino) >= 0) {
        alert("La palabra ya esta registrada. ");
        return false;    
    }
    // Valida que no haya caracteres especiales
    if  (!/^[A-ZÑ]+$/m.test(termino)) {
        alert("No se permiten caracteres especiales. ");
        return false;
    }
    // Borra y sustituye el localStorage, al almacenar mas de 10 palabras, volviendo a las palabras originales 
    if(palabras.length > 10){
        localStorage.clear();
        palabras.length = 7;
    }
    // Agrega la palabra luego de validar los if y tambien la agrega al localStorage
    palabras.push(termino);
    localStorage.setItem("palabras", JSON.stringify(palabras))
    // Inicia el juego al guardar la nueva palabra en el grupo de palabras
    llamarJuego();
    return;  
}

// Funcion para llamar la pagina principal, luego de guardar la nueva palabra
function llamarJuego(){
    window.location.href="juego.html";
}


// Variable para almacenar la configuracion
var juego = juego
// Para ver si ya se envio alguna alerta
var finalizado = false

var $html = {
    hombre: document.getElementById("hombre"),
    adivinado: document.querySelector(".adivinado"),
    errado:  document.querySelector(".errado"),
}

function dibujar(juego) {
    // Actualizar la imagen del muñequito
    var $elem
    $elem = $html.hombre
    $elem.src = "./estados/0" + juego.estado + ".png"

    // Creamos las letras adivinadas
    var palabra = juego.palabra
    var adivinado = juego.adivinado
    $elem = $html.adivinado
    // Borramos los datos anteriores
    $elem.innerHTML = ""
    for (let letra of palabra){
        let $span = document.createElement("span")
        let $txt = document.createTextNode("")
        if (adivinado.has(letra)){
            $txt.nodeValue = letra

        }
        $span.setAttribute("class", "letra adivinada")
        $span.appendChild($txt)
        $elem.appendChild($span)
    }
    // Creacion de letras erradas
    var errado = juego.errado
    $elem = $html.errado
    // Borramos los datos anteriores
    $elem.innerHTML = ""
    for (let letra of errado) {
        let $span = document.createElement("span")
        let $txt = document.createTextNode(letra)
        $span.setAttribute("class", "letra errada")
        $span.appendChild($txt)
        $elem.appendChild($span)
    }
}

function adivinar(juego, letra){
    var estado = juego.estado
    // Si ya perdiste no se modifica el estado
    if (estado == 1 || estado == 8){
        return
    }

    var adivinado = juego.adivinado
    var errado = juego.errado
    // Si ya es una letra o errada no hay cambios
    if (adivinado.has(letra) || errado.has(letra)) {
        return
    }

    var palabra = juego.palabra
    var letras = juego.letras
    // Si es letra de la palabra debemos ver si ya ganamos
    
    if (letras.has(letra)){
        //Agregamos a la lista de letras adivinadas
        adivinado.add(letra)
        // Actualizamos las letras restantes
        juego.restante--

        // Si ya ganamos debemos indicarlo
        if (juego.restante == 0){
            juego.estado = 8           
        }
    }   else {
        // Si no es el estado debemos actualizar el estado, y seguir ahorcando al muñequito
        juego.estado--
        // Agregamos la letra a la lista de letras erradas
        errado.add(letra)
    }
}

window.onkeypress = function adivinarLetra(e){
    var letra = e.key
    letra = letra.toUpperCase()
    if (/[^A-ZÑ]/.test(letra) || e.key =="Enter") {
        return
    }
    adivinar(juego, letra)
    var estado = juego.estado
    if (estado == 1 && !finalizado) {
        setTimeout(mostrarPalabra, 1500)
        finalizado = true
    }
    dibujar(juego)
}


window.nuevoJuego = function nuevoJuego() {
 var palabra = palabraAleatoria()
 juego = {}
 juego.palabra = palabra
 juego.estado = 7
 juego.adivinado = new Set()
 juego.errado = new Set()
 finalizado = false

 var letras = new Set()
 for (let letra of palabra) {
    letras.add(letra)
 }
 

 juego.letras = letras
 juego.restante = letras.size

 dibujar(juego)
}

function palabraAleatoria(){
    var index = ~~(Math.random() * palabras.length)
    return palabras[index]
}

function mostrarPalabra(){
    let palabra = juego.palabra
    alert("La palabra era: " + palabra)
}

nuevoJuego()

}())
