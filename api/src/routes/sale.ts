import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { createSale}  from '../controllers/sale.controller';

router.post('/', tokenValidation, createSale);

// router.get('/', tokenValidation, getProducts);

export default router;