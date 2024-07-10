import { Router } from "express";

import * as deviceItemCtrl from '../controller/deviceItem.controller.js'

const router = Router();


router.get('/:table',deviceItemCtrl.listItems)
router.post('/device',deviceItemCtrl.listData)

export default router;