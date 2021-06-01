let button_toggle = 0;

window.onload = document.getElementById("generar").addEventListener("click", function () {

    let palabra = document.getElementById('entrada_original').value;
    let p_valor = document.getElementById('p_texto').value;
    let q_valor = document.getElementById('q_texto').value;

    p_valor = parseInt(p_valor);
    q_valor = parseInt(q_valor);

    let test_rsa = new RSA_test();

    console.log("entro?")

    console.log(test_rsa, "test")

    console.log(test_rsa.checkPrime(p_valor), "p??")
    console.log(test_rsa.checkPrime(q_valor), "q??")


    if (palabra == "") {
        alert("Ingresa una cadena a encriptar");
        return;
    }

    if (!test_rsa.checkPrime(p_valor) || !test_rsa.checkPrime(q_valor)) {
        alert("Ingresa números primos en p y q");
        return;
    }
    let nuevo_test = new RSA_test(p_valor, q_valor, palabra);



    if (button_toggle === 0) {

        document.getElementById('resultado_area').value = nuevo_test.start().mensajes.hexValue;
        let llaves_div = document.getElementById('llaves');

        console.log(nuevo_test.start().mensajes.publicKey, "llavePublica")
        console.log(nuevo_test.start().mensajes.privateKey, "llavePrivada")

        let ekey = nuevo_test.start().mensajes.publicKey.e;
        let nkey = nuevo_test.start().mensajes.publicKey.n;

        let dPkey = nuevo_test.start().mensajes.privateKey.d;
        let nPkey = nuevo_test.start().mensajes.privateKey.n;

        let llavePublica = "Llave pública: (" + ekey + "," + nkey + ")";
        let llavePrivada = "Llave privada: (" + dPkey + "," + nPkey + ")";

        let res = llavePublica + "\n" + llavePrivada + "\n\n" + "Clave Hexadecimal: " + nuevo_test.start().mensajes.hexValue + "\n\n" + "Palabra original: " + palabra + "\n" + "\n" + "Recuerda dar click en desecriptar" + "\n" + "\n";

        console.log(llavePublica, "null1");
        console.log(llavePrivada, "null2");
        console.log(nuevo_test.start().mensajes.hexValue, "null3");
        console.log(palabra, "null4");

        if (res !== null || res != 'null') {
            llaves_div.innerText = res;
        } else {
            llaves_div.innerText = "";
        }

        button_toggle++;
    } else if (button_toggle >= 1) {
        let llaves_titulo = document.getElementById('llaves_titulo');
        llaves_titulo.innerText = "Llaves generadas: "
        document.getElementById('resultado_area').value = nuevo_test.start().mensajes.hexValue;
        let llaves_div = document.getElementById('llaves');

        console.log(nuevo_test.start().mensajes.publicKey, "llavePublica")
        console.log(nuevo_test.start().mensajes.privateKey, "llavePrivada")

        let ekey = nuevo_test.start().mensajes.publicKey.e;
        let nkey = nuevo_test.start().mensajes.publicKey.n;

        let dPkey = nuevo_test.start().mensajes.privateKey.d;
        let nPkey = nuevo_test.start().mensajes.privateKey.n;

        let llavePublica = "Llave pública: (" + ekey + "," + nkey + ")";
        let llavePrivada = "Llave privada: (" + dPkey + "," + nPkey + ")";

        llaves_div.innerText = llavePublica + "\n" + llavePrivada + "\n\n" + "Clave Hexadecimal: " + nuevo_test.start().mensajes.hexValue + "\n\n" + "Palabra original: " + palabra + "\n" + "\n" + "Recuerda dar click en desecriptar" + "\n" + "\n";
        if (button_toggle % 2 == 0) {

            document.getElementById('resultado_area').value = nuevo_test.start().mensajes.hexValue;
        } else {
            document.getElementById('resultado_area').value = nuevo_test.start().mensajes.mensajeDescifrado;
        }
        button_toggle++;
        return;
    }
});

document.getElementById("limpiar").addEventListener("click", function () {
    document.getElementById('entrada_original').value = "";
    document.getElementById('p_texto').value = "";
    document.getElementById('q_texto').value = "";
    document.getElementById('resultado_area').value = "";
    document.getElementById('llaves_titulo').value = "";

    button_toggle = 0;
});