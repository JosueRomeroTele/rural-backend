
import { createUpdateUser, getUserById, getUserByEmail } from "../db/db.user.js"
import * as userCtrl from '../controller/user.controller.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const findUser = await getUserById(req.body.dni)
        console.log('login')
        console.log(findUser)
        if (!findUser) {
            return res.json({ success: false, msg: 'Credenciales incorrectas' })
        }
        // console.log('email: ',findUser.data.password)
        const equalPw = bcrypt.compareSync(req.body.password, findUser.data.password)
        console.log('equalPw : ', equalPw)
        if (!equalPw) return res.json({ success: false, msg: 'Credenciales incorrectas' })

        return res.json({
            success: true,
            msg: 'Login exitoso',
            user: findUser.data.name + ' ' +findUser.data.lastname,
            email: findUser.data.email,
            enable: findUser.data.enable,
            role: findUser.data.role,
            token: createToken(findUser),
        })
    } catch (error) {
        console.log('error: ', error)
    }

}


export const register = async (req, res) => {

    try {

        console.log('realiza petición')
        //VALIDATE EMAIL
        const findEmail = await getUserByEmail(req.body.data.email)
        const findDni = await getUserById(req.body.data.dni)
        console.log('email', findEmail)
        console.log('DNI', findDni)

        if (!findEmail.success && !findDni.success) {
            console.log('se realiza el registro')

            req.body.data.password = bcrypt.hashSync(req.body.data.password, 12)
            console.log(req.body)
            const newUser = await createUpdateUser(req.body.data)
            console.log(newUser)

            return res.json({ success: true, msg: 'registro exitoso', user: req.body.data.dni })
        }
        const valida = { success: true, msg: '' }
        findEmail.success ? valida.msg = findEmail.msg : valida.msg = findDni.msg
        return res.status(500).json(valida)
        // const usuario = await userCtrl.crearUsuario(req, res);


    } catch (error) {
        console.log('err', error);
        res.json({ error: error.message })
    }


}

function createToken(user) {
    const payload = {
        usuario: user.name,
        role: user.role,
        id: user.dni
    }
    return jwt.sign(payload, 'PROYECTO RURAL 2024 JOSUE ROMERO')
}
// export const register = () => {}