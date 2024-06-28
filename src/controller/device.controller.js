import { readAllDevices, createDevice, getDeviceById, createTableDevice } from "../db/db.device.js"



export const listaDispositivos = async (req, res) => {
    try {
        const { success, data, total } = await readAllDevices()
        res.status(200).json({ success, data, total })
    } catch (error) {
        return res.status(404).json({ message: 'error' });
    }
}
export const crearDispositivo = async (req, res) => {

    //validar dispositivo existente
    const validar = await getDeviceById(req.body.data.id);
    if (validar.success) {
        return res.status(200).json({ success: false, data: 'Dispositivo ya existente' })
    }
    //fechas de creacion
    const now = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
    req.body.data.createdAt = now;
    req.body.data.updatedAt = now;
    //crear item dispositivo
    const { success, data } = await createDevice(req.body.data);
    if(success){
        //crear tabla dispositivo
        const dataDevice = await createTableDevice(req.body.data);
        if(dataDevice.success){
            return res.status(200).json({ success, data })
        }else{
            return res.status(400).json({success,msg:'No se creo la tabla para el dispositivo'})
        }
    }else{
        return res.status(400).json({success,msg:'No se crea el dispositivo'})
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

export const deleteDevice = () => { }