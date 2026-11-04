import express from 'express';
import { submitEnquiry } from '../controller/enquiryController.js';

const router = express.Router();

router.post('/', submitEnquiry);

export default router;
