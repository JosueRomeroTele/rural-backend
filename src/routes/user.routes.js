import { Router } from "express";
import * as userCtrl  from '../controller/user.controller.js'
const router = Router();

router.get('/list',userCtrl.listaUsuarios);
router.post('/',userCtrl.crearUsuario);
router.get('/:dni',userCtrl.obtenerUsuario);
router.delete('/:dni',userCtrl.eliminarUsuario);
export default router;