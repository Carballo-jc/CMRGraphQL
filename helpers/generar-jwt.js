require("dotenv").config({ path: ".env" });
const jwt = require('jsonwebtoken');

const {SECRETKEY} = process.env


exports.generarJWT = (user ) => {
const {id,name,lastName}=user;
    return new Promise( (resolve, reject) => {

        const payload = {id,name,lastName};

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
