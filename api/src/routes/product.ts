import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { createProduct, 
         deleteProduct, 
         getProducts, 
         identifyById, 
         reactivateProduct, 
         setBarcode, 
         setDescription, 
         setName, 
         setPrice, 
         setStock }  from '../controllers/product.controller';

router.post('/', tokenValidation, createProduct);

router.get('/', tokenValidation, getProducts);
router.get('/:id', tokenValidation, identifyById);
router.get('/reactivate/:id', tokenValidation, reactivateProduct);

router.delete('/:id', tokenValidation, deleteProduct);

router.patch('/name/:id', tokenValidation, setName);
router.patch('/description/:id', tokenValidation, setDescription);
router.patch('/stock/:id', tokenValidation, setStock);
router.patch('/price/:id', tokenValidation, setPrice);
router.patch('/barcode/:id', tokenValidation, setBarcode);

export default router;