import { Router } from 'express';
import { tokenValidation } from '../libs/verifyToken';

const router: Router = Router();

import { signup, 
         signin, 
         users, 
         identifyById, 
         setName, 
         setSurname,
         setEmail, 
         setPassword, 
         setRole }  from '../controllers/auth.controller';

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/users', tokenValidation, users);
router.get('/:id', tokenValidation, identifyById);

router.patch('/name/:id', tokenValidation, setName);
router.patch('/surname/:id', tokenValidation, setSurname);
router.patch('/email/:id', tokenValidation, setEmail);
router.patch('/role/:id', tokenValidation, setRole);
router.patch('/password/:id', tokenValidation, setPassword);

export default router;