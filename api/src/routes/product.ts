import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { createProduct, 
         deleteProduct, 
         getProducts, 
         identifyByBarcode, 
         identifyById, 
         reactivateProduct, 
         setBarcode, 
         setBrand, 
         setDescription, 
         setName, 
         setPrice, 
         setStock }  from '../controllers/product.controller';

router.post('/', tokenValidation, createProduct);

router.get('/', tokenValidation, getProducts);
router.get('/:id', tokenValidation, identifyById);
router.get('/barcode/:barcode', tokenValidation, identifyByBarcode);
router.get('/reactivate/:id', tokenValidation, reactivateProduct);

router.delete('/:id', tokenValidation, deleteProduct);

router.patch('/name/:id', tokenValidation, setName);
router.patch('/description/:id', tokenValidation, setDescription);
router.patch('/stock/:id', tokenValidation, setStock);
router.patch('/price/:id', tokenValidation, setPrice);
router.patch('/brand/:id', tokenValidation, setBrand);
router.patch('/barcode/:id', tokenValidation, setBarcode);

export default router;