require("dotenv").config({ path: ".env" });
const jwt = require('jsonwebtoken');

const {SECRETKEY} = process.env


exports.generarJWT = (id ) => {

    return new Promise( (resolve, reject) => {

        const payload = { id };

        jwt.sign( payload, SECRETKEY, {
            expiresIn: '5h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}
