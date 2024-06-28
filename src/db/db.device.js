import { docClient, tableDevice, tableUser, ddb } from "../config/db.config.js";


export const readAllDevices = async () => {
    const params = {
        TableName: tableDevice
    }
    try {
        const { Items = [], Count } = await docClient.scan(params).promise();
        const findItems = Object.keys(Items).length > 0;
        if (findItems) {
            return { success: true, data: Items, total: Count }
        }
        return { success: false, data: 'No existen dispositivos' }
    } catch (error) {
        console.log('error', error)
        throw error;
    }
}

export const createDevice = async (data = {}) => {

    try {
        const params = { TableName: tableDevice, Item: data }
        const res = await docClient.put(params).promise();
        if (res && res.$response && res.$response.error) {
            throw new Error(res.$response.error);
        }
        return { success: true, data: 'Usuario registrado existosamente' }
    } catch (error) {
        console.log('error', error)
        return { success: false, data: null }

    }
}

export const getDeviceById = async (data) => {
    try {
        const params = { TableName: tableDevice, Key: { id: data } }
        const { Item = {} } = await docClient.get(params).promise();
        const findItem = Object.keys(Item).length > 0;
        if (findItem) {
            return { success: true, data: Item }
        }
        return { success: false, data: 'Dispositivo no encontrado' }
    } catch (error) {
        console.log('error', error)
    }
}

export const createTableDevice = async (data) => {
    try {
        console.log('data crear tabla', data.id)
        const tableName = data.id;
        const params = {
            TableName: tableName,
            AttributeDefinitions: [
                { AttributeName: "uuid", AttributeType: "S" },
                { AttributeName: "date", AttributeType: "S" }
            ],
            KeySchema: [
                { AttributeName: "uuid", KeyType: "HASH" },  // Clave de partición
                { AttributeName: "date", KeyType: "RANGE" }  // Clave de ordenamiento
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
            StreamSpecification: {
                StreamEnabled: true, // Habilitar streams
                StreamViewType: "NEW_AND_OLD_IMAGES" // Especificar el tipo de vista de actualización
            }
        }

        try {
            const data = await ddb.createTable(params).promise();
            console.log("Table Created", data);
            return { success: true, data: data };
        } catch (err) {
            console.log("Error", err);
            return { success: false, data: null };
        }

    } catch (error) {
        console.log(error)
    }
}

