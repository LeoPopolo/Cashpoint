import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { closeCashRegister, 
         createCashRegister, 
         getCashRegisters, 
         identifyById, 
         isAnyCashRegisterOpen, 
         substractCash 
        }  from '../controllers/cash_register.controller';

router.post('/', tokenValidation, createCashRegister);

router.get('/', tokenValidation, getCashRegisters);
router.get('/:id', tokenValidation, identifyById);

router.patch('/is_any_open', tokenValidation, isAnyCashRegisterOpen);
router.patch('/close', tokenValidation, closeCashRegister);
router.patch('/substract', tokenValidation, substractCash);

export default router;