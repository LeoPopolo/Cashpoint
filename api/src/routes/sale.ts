import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { createSale, getSales, identifyById }  from '../controllers/sale.controller';

router.post('/', tokenValidation, createSale);

router.get('/', tokenValidation, getSales);
router.get('/:id', tokenValidation, identifyById);

export default router;