import { docClient, tableUser } from "../config/db.config.js";


const readAllUsers = async () => {
    const params = { 
        TableName: tableUser,
        // ProjectionExpression:'#lastname,#',
        // ExpressionAttributeNames:{
        //     '#password':'password'
        // }

     }
    try {
        const { Items = [] } = await docClient.scan(params).promise();
        const filteredItems = Items.map(item => {
            const { password,token, ...rest } = item;
            return rest;
        })
        return { success: true, data: filteredItems };
    } catch (error) {
        // console.error('Error al escanear la tabla de usuarios:', error);
        console.log('error', error)
        throw error; // Lanzar el error para ser capturado por el llamador
    }
}

const createUpdateUser = async (data = {}) => {

    try {
        const params = {
            TableName: tableUser,
            Item: data
        }

        const rpt = await docClient.put(params).promise();

        if (rpt && rpt.$response && rpt.$response.error) {
            throw new Error(rpt.$response.error);
        }
        return { success: true, data: 'Usuario registrado existosamente' }
    } catch (error) {
        console.log('service-error', error);
        return { success: false, data: null }
    }
}

const updateUser = async (dni,updateKey,updateValue)=>{
    const params ={
        TableName: tableUser,
        Key:{
            ['dni']:dni
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    try {
        const result = await docClient.update(params).promise();
        console.log('Item actualizado con éxito:', result);
        return { success: true, msg: 'Actualizacion exitosa', data: result }
    } catch (error) {
        console.log('error : ',error)
        // res.status(500).json({msg:'Error en el servidor'})
    }
}

const getUserById = async (data) => {
    try {
        const params = {
            TableName: tableUser,
            Key: { dni: data }
        }

        const { Item = {} } = await docClient.get(params).promise();
        const isItemFilled = Object.keys(Item).length > 0;
        // console.log('cantidad',isItemFilled)
        if (isItemFilled) {
            const { password, token, ...userData } = Item;
            return { success: true, msg: 'Usuario encontrado', data: Item }
        }
        return { success: false, msg: 'usuario no existe', data: null }

    } catch (error) {
        console.log('error', error)
        return { success: false, data: null }
    }
}

const obtenerUsuarioPorDni = async (data) => {
    try {
        const params = {
            TableName: tableUser,
            Key: { dni: data }
        }

        const { Item = {} } = await docClient.get(params).promise();
        const isItemFilled = Object.keys(Item).length > 0;
        // console.log('cantidad',isItemFilled)
        if (isItemFilled) {
            const { password, token, ...userData } = Item;
            return { success: true, msg: 'Usuario encontrado', data: userData }
        }
        return { success: false, msg: 'usuario no existe', data: null }

    } catch (error) {
        console.log('error', error)
        return { success: false, data: null }
    }
}


const getUserByEmail = async (data) => {

    try {
        const params = {
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': data },
            TableName: tableUser,
        }

        const { Items } = await docClient.scan(params).promise();
        console.log(Items)
        const isItemFilled = Object.keys(Items).length > 0;
        if (isItemFilled) return { success: true, msg: 'El correo ya ha sido registrado', data: Items }

        return { success: false, msg: 'No se encuentra correo' }

    } catch (error) {
        console.log('error', error)
        return { success: false, msg: 'service : ' + error }
    }
}



const deleteUser = async (data) => {
    try {
        const params = {
            TableName: tableUser,
            Key: { dni: data }
        }

        await docClient.delete(params).promise();
        return { success: true }
    } catch (error) {
        console.log('error', error)
        return { success: false }
    }
}
export {
    readAllUsers,
    createUpdateUser,
    getUserById,
    deleteUser,
    getUserByEmail,
    updateUser,
    obtenerUsuarioPorDni
}