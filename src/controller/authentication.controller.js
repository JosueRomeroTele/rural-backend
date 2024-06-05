
import { createUpdateUser, getUserById, getUserByEmail  } from "../db/db.user.js"
import * as userCtrl from '../controller/user.controller.js'
import bcrypt from 'bcryptjs';

export const login = () => { }


export const register = async (req, res) => {

    try {
        
        console.log('realiza petición')
        //VALIDATE EMAIL
        const findEmail = await getUserByEmail(req.body.data.email)
        const findDni = await getUserById(req.body.data.dni)
        console.log('email',findEmail)
        console.log('DNI',findDni)

        if(!findEmail.success && !findDni.success){
            console.log('se realiza el registro')
            console.log(req.body)
            // req.body.password = bcrypt.hashSync(req.body.password, 12)

            
            
            return res.json({success:true,msg:'registro exitoso',user: req.body.data})
        }
        const valida = {success:true,msg:''}
        findEmail.success ? valida.msg=findEmail.msg  : valida.msg=findDni.msg
        return res.status(500).json(valida)
        // const usuario = await userCtrl.crearUsuario(req, res);
        
        
    } catch (error) {
        console.log('err',error);
        res.json({error: error.message})
    }


}
// export const register = () => {}