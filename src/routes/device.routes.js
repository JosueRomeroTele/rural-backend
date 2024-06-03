import { Router } from "express";

import * as deviceCtrl from '../controller/device.controller.js'

const router = Router();

router.get('/list',deviceCtrl.listaDispositivos);
router.post('/',deviceCtrl.crearActualizarDispositivo);
router.get('/:id',deviceCtrl.obtenerDispositivo)

export default router;