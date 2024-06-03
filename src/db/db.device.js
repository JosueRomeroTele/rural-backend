import { docClient, tableDevice, tableUser } from "../config/db.config.js";


export const readAllDevices = async () =>{
    const params = {
        TableName : tableDevice
    }
    try {
        const {Items = [],Count} = await docClient.scan(params).promise();
        const findItems = Object.keys(Items).length > 0;
        if(findItems){
            return {success:true,data: Items,total:Count}
        }
        return {success: false, data: 'No existen dispositivos'}
    } catch (error) {
        console.log('error',error)
        throw error; 
    }
}

export const createUpdateDevice = async (data={})=>{

    try {
        const params = {TableName:tableDevice,Item:data}
        const res = await docClient.put(params).promise();
        if (res && res.$response && res.$response.error) {
            throw new Error(res.$response.error);
        }
        return {success:true,data:'Usuario registrado existosamente'}
    } catch (error) {
        console.log('error',error)
        return {success:false,data:null}

    }
}

export const getDeviceById = async(data)=>{
    try {
        const params ={ TableName:tableDevice,Key:{id:data}}
        const {Item = {} } = await docClient.get(params).promise();
        const findItem = Object.keys(Item).length >0;
        if(findItem){
            return {success:true,data:Item}
        }
        return {success:false,data:'Dispositivo no encontrado'}
    } catch (error) {
        console.log('error',error)
    }
}

