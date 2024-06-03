import { readAllDevices, createUpdateDevice, getDeviceById } from "../db/db.device.js"



export const listaDispositivos = async (req, res) => {
    try {
        const { success, data, total } = await readAllDevices()
        res.status(200).json({ success, data, total })
    } catch (error) {
        return res.status(404).json({ message: 'error' });
    }
}
export const crearActualizarDispositivo = async (req, res) => {
    console.log('body', req.body)
    console.log('tipo', req.body.tipo)

    //crear
    if (req.body.tipo === 0) {
        const validar = await getDeviceById(req.body.data.id);
        if (validar.success) {
            return res.status(200).json({ success: false, data: 'Dispositivo ya existente' })
        }
        const now = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
        req.body.data.createdAt = now;
        req.body.data.updatedAt = now;
        const { success, data } = await createUpdateDevice(req.body.data);

        crearTablaDispositivo(req.body.data)

        return res.status(200).json({ success, data })
        //cuando se crea un dispositivo, se debe crear la tabla para que vaya la data
    }
    //actualizar
    if (req.body.tipo === 1) {
        const validar = await getDeviceById(req.body.data.id);
        if (validar.success) {
            const now = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

            req.body.data.createdAt = validar.data.createdAt
            req.body.data.updatedAt = now;
            const { success, data } = await createUpdateDevice(req.body.data);
            return res.status(200).json({ success, data:'Dispositivo actualizado exitosamente' })
        }
    }


}
export const obtenerDispositivo = async (req, res) => {

    try {
        const { id } = req.params;
        const { success, data } = await getDeviceById(id)
        return res.status(200).json({ success, data })
    } catch (error) {
        return res.status(500).json({ message: 'error' });
    }

}

const crearTablaDispositivo=(data)=>{
    console.log('data',data);
    
}
export const deleteDevice = () => { }