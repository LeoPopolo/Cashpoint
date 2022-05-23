import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { closeSale, createSale}  from '../controllers/sale.controller';

router.post('/', tokenValidation, createSale);

router.patch('/close/:id', tokenValidation, closeSale);

// router.get('/', tokenValidation, getProducts);

export default router;