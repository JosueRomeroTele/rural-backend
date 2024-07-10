import {listItemsDevice, listPruebas,getDataDevice} from '../db/db.dataDevice.js';


export const listItems = async (req,res)=>{
    try {
        const {table}= req.params
        console.log('tabla de monitorear : ',table)
        const data = await listPruebas(table)
        if(data.success){
            return res.status(200).json({ success: data.success, data: data.data });urn 
        }
    } catch (error) {
        console.log(error)
    }
}

export const listData = async (req,res) =>{
    try {
        
        const data = req.body;
        console.log('data de pruebaaaaaaaaaa===========')
        console.log(data)
        const itemsDevice = await getDataDevice(data)
        return res.json(itemsDevice)

    } catch (error) {
        console.log(error)
    }
}