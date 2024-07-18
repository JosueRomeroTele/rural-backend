import { Router } from "express";
import multer from 'multer';
import * as deviceCtrl from '../controller/device.controller.js'

const router = Router();


const upload = multer({ dest: 'uploads/' });

router.get('/list',deviceCtrl.listaDispositivos);
router.post('/',deviceCtrl.crearDispositivo);
router.get('/:id',deviceCtrl.obtenerDispositivo)
router.post('/upload',upload.single('file'),deviceCtrl.uploadData)

export default router;