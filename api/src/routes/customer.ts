import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { createCustomer,
         getCustomers,
         identifyById, 
         setName,
         deleteCustomer,
         reactivateCustomer,
         setIdentifier,
         setPhoneNumber,
         setIvaResponsability
        }  from '../controllers/customer.controller';

router.post('/', tokenValidation, createCustomer);

router.get('/', tokenValidation, getCustomers);
router.get('/:id', tokenValidation, identifyById);

router.delete('/:id', tokenValidation, deleteCustomer);

router.patch('/reactivate/:id', tokenValidation, reactivateCustomer);
router.patch('/name/:id', tokenValidation, setName);
router.patch('/identifier/:id', tokenValidation, setIdentifier);
router.patch('/phone/:id', tokenValidation, setPhoneNumber);
router.patch('/responsability/:id', tokenValidation, setIvaResponsability);

export default router;