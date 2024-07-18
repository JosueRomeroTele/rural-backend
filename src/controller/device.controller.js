import { readAllDevices, createDevice, getDeviceById, createTableDevice } from "../db/db.device.js"

import AWS from 'aws-sdk';
import csv from 'csv-parser';
import fs from 'fs';

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
    if (success) {
        //crear tabla dispositivo
        const dataDevice = await createTableDevice(req.body.data);
        if (dataDevice.success) {
            return res.status(200).json({ success, data })
        } else {
            return res.status(400).json({ success, msg: 'No se creo la tabla para el dispositivo' })
        }
    } else {
        return res.status(400).json({ success, msg: 'No se crea el dispositivo' })
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

const BATCH_SIZE = 25;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const uploadData = async (req, res) => {
    try {
      const filePath = req.file.path;
      const tableName = 'ESP21231-1201'; // Reemplaza con el nombre de tu tabla en DynamoDB
        
      let items = [];
      console.log('archivos subidos')
    //   console.log(req.file.path)

      fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const item = {
          date: row.date,
          temperatura: parseFloat(row.temperatura),
          humedad: parseFloat(row.humedad)
        };

        items.push({
          PutRequest: {
            Item: item
          }
        });
      })
      .on('end', async () => {
        try {
          // Subir los datos en batches de 25 elementos
          for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const batchItems = items.slice(i, i + BATCH_SIZE);
            const params = {
              RequestItems: {
                [tableName]: batchItems
              }
            };
            await dynamoDb.batchWrite(params).promise();
          }
          res.status(200).json({ success: true, msg: 'Archivo subido y datos almacenados en DynamoDB' });
        } catch (error) {
          console.error('Error al almacenar los datos en DynamoDB:', error);
          res.status(500).json({ success: false, msg: 'Error al almacenar los datos en DynamoDB' });
        } finally {
          // Eliminar el archivo subido del servidor
          try {
            fs.unlink(filePath, (unlinkError) => {
              if (unlinkError) {
                console.error('Error al eliminar el archivo:', unlinkError);
              }
            });
          } catch (unlinkSyncError) {
            console.error('Error al eliminar el archivo sync:', unlinkSyncError);
          }
        }
      });
      
    } catch (error) {
      console.error('Error en el método uploadData:', error);
      res.status(500).json({ success: false, msg: 'Error en el método uploadData' });
    }
  };

export const deleteDevice = () => { }