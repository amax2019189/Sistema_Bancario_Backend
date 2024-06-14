import jwt from 'jsonwebtoken'

export const generarJWT = (uid = '', email = '', role = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, email, role }; // Asegúrate de incluir el rol en el payload
        jwt.sign(
            payload,
            process.env.TOKEN_KEY,
            {
                expiresIn: '24h'
            },
            (err, token)=>{
                err ? (console.log(err),reject('we have a problem to generate the token')) : resolve(token)
            }
        )
    })
}