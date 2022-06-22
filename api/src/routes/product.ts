import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { addBrand, createProduct, 
         deleteProduct, 
         getBrands, 
         getProducts, 
         identifyByBarcode, 
         identifyById, 
         reactivateProduct, 
         setBarcode, 
         setBrand, 
         setDescription, 
         setName, 
         setPrice, 
         setPriceByBrand, 
         setStock }  from '../controllers/product.controller';

router.post('/', tokenValidation, createProduct);
router.post('/brand', tokenValidation, addBrand);

router.get('/', tokenValidation, getProducts);
router.get('/:id', tokenValidation, identifyById);
router.get('/barcode/:barcode', tokenValidation, identifyByBarcode);
router.get('/reactivate/:id', tokenValidation, reactivateProduct);
router.get('/brands/all', tokenValidation, getBrands);

router.delete('/:id', tokenValidation, deleteProduct);

router.patch('/name/:id', tokenValidation, setName);
router.patch('/description/:id', tokenValidation, setDescription);
router.patch('/stock/:id', tokenValidation, setStock);
router.patch('/price/:id', tokenValidation, setPrice);
router.patch('/brand/:id', tokenValidation, setBrand);
router.patch('/barcode/:id', tokenValidation, setBarcode);
router.patch('/price_by_brand/:id', tokenValidation, setPriceByBrand);

export default router;