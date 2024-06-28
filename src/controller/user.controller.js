
import { readAllUsers, createUpdateUser, getUserById, deleteUser, getUserByEmail,updateUser,obtenerUsuarioPorDni } from "../db/db.user.js"
import { transporter, habilitarUsuarioEmail } from "../services/service-email.js";

export const listaUsuarios = async (req, res) => {
    try {
        const users = await readAllUsers()
        if (users.success) {
            return res.status(200).json({ success: users.success, data: users.data });
        } else {
            // Si no se obtienen datos, devuelve un error 404
            return res.status(404).json({ message: 'No se encontraron usuarios.' });
        }
    } catch (error) {
        return res.status(500).json({ messsage: 'error' });
    }
}


export const crearUsuario = async (req, res) => {
    try {

        //CREAR
        if (req.body.tipo === 0) {
            const validar = await getUserById(req.body.data.dni);
            // console.log('validando', validar.success)
            if (validar.success) {
                return res.status(200).json({ success: false, data: 'Usuario ya existe' })
            }
            const now = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
            req.body.data.createdAt = now;
            req.body.data.updatedAt = now;

            const { success, data } = await createUpdateUser(req.body.data)
            return res.json({ success, data })
        }

        //ACTUALIZAR
        if (req.body.tipo === 1) {
            const validar = await getUserById(req.body.data.dni);
            console.log('validando', validar.success)
            console.log('usuario', validar.data)
            if (validar.success) {
                const now = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

                req.body.data.createdAt = validar.data.createdAt
                req.body.data.updatedAt = now;
                const { success, data } = await createUpdateUser(req.body.data)
                return res.json({ success, data: 'Usuario actualizado exitosamente' })
            }
            return res.status(200).json({ success: false, data: 'Usuario no encontrado' })
        }
        return res.status(200).json({ success: false, data: 'Opción no válida' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ messsage: 'error' })
    }
}


export const obtenerUsuario = async (req, res) => {
    try {
        const { dni } = req.params
        const { success, data } = await obtenerUsuarioPorDni(dni);

        return res.status(200).json({ success, data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ messsage: 'error' })
    }
}

export const eliminarUsuario = async (req, res) => {
    try {
        const { dni } = req.params;
        const { success } = await deleteUser(dni);
        return res.status(200).json({ success })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'error' })
    }
}

export const actualizarUsuarioId= async (req,res)=>{
    try {
        const updateUserI = updateUser()
    } catch (error) {
        console.log('error : ',error)
    }
}
// import {transporter,habilitarUsuarioEmail} from "../services/service-email.js";
export const habilitarUsuario = async (req, res) => {
    const findUser = await getUserByEmail(req.body.email)
    if (findUser.success && findUser.data.enable != req.body.enable) {
        try {
            const now = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

            const data = {
                dni:findUser.data.dni,
                enable:req.body.enable,
                updatedAt:now
            }
            const updateUser = await createUpdateUser(data)
            console.log(updateUser)
            if(updateUser.success){
                await transporter.sendMail(habilitarUsuarioEmail(req.body.email, req.body.enable))
                res.status(200).send({ success: true, message: 'Usuario habilitado/deshabilitado y correo enviado.' });
            }else{
                res.status(400).send({ success: false, message: 'El usuario no ha podido ser actualizado' });
            }
            
        } catch (error) {
            cachesonsole.error("Error sending email: ", error);
            res.status(500).send({ success: false, message: 'Error enviando el correo.' });
        }

    } else {
        res.status(400).send({ success: false, message: 'El usuario ya tiene el estado solicitado.' });
    }
}
