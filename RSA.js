class RSA_test {
    // Parámetros del usuario p,q y msg
    constructor(p, q, msg) {
        this.p = p;
        this.q = q;
        this.msg = msg;
    }
    generarLlaves() {
        let p = this.p;
        let q = this.q;
        let n = p * q;
        let phi = (p - 1) * (q - 1);
        // Llave valida (e,phi) === 1 en mcd
        let e = this.keyValidByMCD(phi);
        let d = this.generarD(e, phi);
        return {
            llavePublica: {
                e,
                n
            },
            llavePrivada: {
                d,
                n
            }
        }
    }
    /* phi 1 < e < (p - 1) * (q - 1) == phi
     Si ekey, y phi no son mcd === 1, generamos un nuevo eKey */
    keyValidByMCD(phi) {
        let eKey = this.generarPivotePrimo();
        while (this.mcd(eKey, phi) !== 1) {
            eKey = this.generarPivotePrimo();
        }
        return eKey;
    }
    // Algoritmo Euclides para sacar el MCD (Mínimo común divisor)
    mcd(x, y) {
        let MCD;
        while ((x % y) > 0) {
            MCD = x % y;
            x = y;
            y = MCD;
        }
        return y;
    }
    /*Función más importante para potenciar números muy grandes arriba de > MAX_VALUE 
    Genera e^-1
    Para encryptar recibe llavePrivada.d y llavePublica.n
    Para desencriptar recibe llavePublica.e y llavePublica.n*/
    inverseMod(num, pow, mod) {
        if (pow == 0) return 1;
        if (pow % 2 == 0) {
            return Math.pow(this.inverseMod(num, (pow / 2), mod), 2) % mod;
        } else {
            return (num * this.inverseMod(num, (pow - 1), mod)) % mod;
        }
    }
    /* Sí e es válido con phi en mcd == 1 entonces generamos d
    Decímos que si el valor (e * i) % phi == 1 && (< phi) es congruente con mod 1
    Regresaremos  d */
    generarD(eKey, phi) {
        eKey = eKey % phi;
        for (let d = 1; d < phi; d++) {
            let congruente = eKey * d;
            if (congruente % phi == 1)
                return d;
        }
    }
    // Función que ayuda a escoger un buen pivote para el MCD
    generarPivotePrimo() {
        let lista = this.generarListaDePrimos(this.aleatorio(100, 800), 1000);
        for (let i = 0; i < lista.length; i++) {
            if (lista[i] % 4 == 3) {
                //console.log(lista[i], "pivote2")
                return lista[i];
            }
        }
        return 1;
    }
    // Checar si un número es primo
    checkPrime(n) {
        for (let i = 2; i < n; i++)
            if (n % i === 0) return false;
        return n > 1;
    }
    // Generar números aleatorios
    aleatorio(low, high) {
        return Math.round(Math.random() * (low - high) + low);
    }
    /*High es el phi 1 < e < (p - 1) * (q - 1) == phi
    Generar lista de primos*/
    generarListaDePrimos(low, high) {
        let lista = [];
        for (let i = low; i < high; i++) {
            if (this.checkPrime(i)) lista.push(i);
        }
        return lista;
    }
    /*Recibe llaves publicas (e,n)
    Regresamos el inverso del mod para desencriptar el caracter*/
    inverseModByCharacterDecode(charASCII, llavePublica) {
        return this.inverseMod(charASCII, llavePublica.e, llavePublica.n);
    }
    // Regresamos el inverso del mod para encriptar el caracter
    inverseModByCharacterEncode(decMsg, llavePrivada) {
        return this.inverseMod(decMsg, llavePrivada.d, llavePrivada.n);
    }
    // Regresamos una lista de todos los caracteres con su valor público para decodificarlos.
    encodeString(characters, llavePublica) {
        const charASCIIArr = this.letterToCharNumbersByArray(characters);
        let letter = this.msg;
        return charASCIIArr.map(letter => this.inverseModByCharacterDecode(letter, llavePublica))
    }
    // Regresamos una lista de todos los caracteres de la cadena original ya decodificados
    decodeString(charASCIIArrUncode, llavePrivada) {
        let cadena = this.msg;
        const charASCIIArrEncode = charASCIIArrUncode.map(cadena => this.inverseModByCharacterEncode(cadena, llavePrivada));
        return this.charASCIIToStringByArray(charASCIIArrEncode);
    }
    // Pasamos nuestro arreglo a char ascii por ejemplo [a,b] = [97,66]
    letterToCharNumbersByArray(letter) {
        return letter.split("").map(letter => letter.charCodeAt(0))
    }
    // Pasamos de números a letras ejemplo [97,66] = [a,b]
    charASCIIToStringByArray(arr) {
        return arr.map(num => String.fromCharCode(num)).join("");
    }
    // Pasamos el mensaje descifrado a valores de hex(16)
    toHexValue(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n++) {
            var hex = Number(str.charCodeAt(n)).toString(16);
            arr1.push(hex);
        }
        return arr1.join('');
    }
    // Inicializador
    start() {
        const keys = this.generarLlaves();
        const mensajeEncriptado = this.encodeString(this.msg, keys.llavePublica);
        const mensajeDescifrado = this.decodeString(mensajeEncriptado, keys.llavePrivada)
        //console.log(mensajeEncriptado, "encrypted")
        const hexValue = this.toHexValue(mensajeDescifrado);
        //console.log(mensajeDescifrado, "descifrado")
        //console.log(hexValue, "hex!!")
        const publicKey = keys.llavePublica;
        const privateKey = keys.llavePrivada;
        return {
            mensajes: {
                mensajeEncriptado,
                mensajeDescifrado,
                publicKey,
                privateKey,
                hexValue
            }
        }
    };
}