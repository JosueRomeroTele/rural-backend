import { docClient, tableUser } from "../config/db.config.js";


const readAllUsers = async ()=>{
    const params ={ TableName : tableUser}
    try {
        const { Items = [] } = await docClient.scan(params).promise();
        // console.log('Éxito al escanear la tabla de usuarios:', Items);
        return { success: true, data: Items };
    } catch (error) {
        // console.error('Error al escanear la tabla de usuarios:', error);
        console.log('error',error)
        throw error; // Lanzar el error para ser capturado por el llamador
    }
}

const createUpdateUser =async (data = {})=>{
  
    try {
        const params = {
            TableName : tableUser,
            Item : data
        }

        const rpt = await docClient.put(params).promise();

        if (rpt && rpt.$response && rpt.$response.error) {
            throw new Error(rpt.$response.error);
        }
        return {success:true,data:'Usuario registrado existosamente'}
    } catch (error) {
        console.log('error',error);
        return {success:false,data:null}
    }
}


const getUserById = async (data )=>{
    try {
        const params = {
            TableName : tableUser,
            Key : {dni: data}
        }

        const { Item = {} }= await docClient.get(params).promise();
        const isItemFilled = Object.keys(Item).length > 0;
        // console.log('cantidad',isItemFilled)
        if(isItemFilled){
            return {success:true,data:Item}
        }
        return {success: false, data: 'usuario no existe'}
  
    } catch (error) {
        console.log('error',error)
        return {success:false,data:null}
    }
}

const deleteUser = async (data)=>{
    try {
        const params = {
            TableName : tableUser,
            Key : {dni:data}
        }

        await docClient.delete(params).promise();
        return {success:true}
    } catch (error) {
        console.log('error',error)
        return {success:false}
    }
}
export {
    readAllUsers, 
    createUpdateUser,
    getUserById,
    deleteUser
}