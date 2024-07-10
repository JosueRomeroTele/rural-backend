import { docClient, ddb } from "../config/db.config.js";
import moment from 'moment-timezone'

export const listItemsDevice = async (table, timeWindowInMinutes = 30) => {

    const currentTime = moment().tz('America/Lima').format();
    const pastTime = moment(currentTime).subtract(timeWindowInMinutes, 'minutes');

    const pastTimeISO = pastTime.toISOString();
    // const currentTimeISO = currentTime.toISOString();

    console.log('Start Time:', currentTime);
    console.log('tipo :', typeof currentTime);
    // console.log('End Time:', currentTimeISO);
    const params = {
        TableName: table,
        KeyConditionExpression: '#date >= :start_date',
        ExpressionAttributeNames: {
            '#date': 'date'
        },
        ExpressionAttributeValues: {
            ':start_date': currentTime,
        },
        ScanIndexForward: false
    };

    try {
        const { Items = [] } = await docClient.scan(params).promise();
        console.log(Items)
        return { success: true, data: Items, totaData: 10 };
    } catch (error) {
        console.log(error)
        return { success: true, msg: 'error' };
    }
}


export const listPruebas = async (table, timeWindowInMinutes = 30) => {
    // Configurar la zona horaria peruana
    const currentTime = moment().tz('America/Lima');
    const pastTime = moment(currentTime).subtract(timeWindowInMinutes, 'minutes');

    const pastTimeISO = pastTime.format(); // Mantiene el formato con la zona horaria -05:00
    const currentTimeISO = currentTime.format();

    console.log('Start Time:', pastTimeISO);
    console.log('End Time:', currentTimeISO);

    const params = {
        TableName: table,
        FilterExpression: '#date BETWEEN :start_date AND :end_date',
        ExpressionAttributeNames: {
            '#date': 'date'
        },
        ExpressionAttributeValues: {
            ':start_date': pastTimeISO,
            ':end_date': currentTimeISO
        },
        ScanIndexForward: false  // Ordenar de más reciente a más antiguo
    };

    try {
        const { Items = [] } = await docClient.scan(params).promise();
        console.log(Items);
        return { success: true, data: Items, totalData: Items.length };
    } catch (error) {
        console.log(error);
        return { success: false, msg: 'error' };
    }
};


export const getDataDevice = async (data) => {
    const { table, type, start, end, parameters } = data;

    let ExpressionAttributeNames = { '#date': 'date' };
    let ProjectionExpression = '#date';
    var inicioDate=start
    var finDate=end

    if (parameters && Array.isArray(parameters)) {
        parameters.forEach((param, index) => {
            const attributeAlias = `#param${index}`;
            ExpressionAttributeNames[attributeAlias] = param;
            ProjectionExpression += `, ${attributeAlias}`;
        });
    }
    if (type != 0) {
        // Configurar la zona horaria peruana
        const currentTime = moment().tz('America/Lima');
        const pastTime = moment(currentTime).subtract(type, 'minutes');

        const pastTimeISO = pastTime.format(); // Mantiene el formato con la zona horaria -05:00
        const currentTimeISO = currentTime.format();
        inicioDate=pastTimeISO
        finDate=currentTimeISO
        console.log('Start Time:', pastTimeISO);
        console.log('Start Time:', typeof pastTimeISO);
        console.log('End Time:', currentTimeISO);
    }


    const params = {
        TableName: table,
        FilterExpression: '#date BETWEEN :start_date AND :end_date',
        ExpressionAttributeNames,
        ExpressionAttributeValues: {
            ':start_date': inicioDate,
            ':end_date': finDate
        },
        ProjectionExpression,  // Usar la cadena construida dinámicamente
        ScanIndexForward: false   // Ordenar de más reciente a más antiguo
    };

    console.log(params)

    try {
        const { Items = [] } = await docClient.scan(params).promise();
        console.log(Items);
        return { success: true, data: Items, totalData: Items.length };
    } catch (error) {
        console.log(error);
        return { success: false, msg: 'error' };
    }

}

const atributosParametros = () => {
    let ExpressionAttributeNames = { '#date': 'date' };
    let ProjectionExpression = '#date';

    if (parameters && Array.isArray(parameters)) {
        parameters.forEach((param, index) => {
            const attributeAlias = `#param${index}`;
            ExpressionAttributeNames[attributeAlias] = param;
            ProjectionExpression += `, ${attributeAlias}`;
        });
    }

    return ExpressionAttributeNames, ProjectionExpression
}