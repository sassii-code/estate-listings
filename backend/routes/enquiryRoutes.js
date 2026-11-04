import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitEnquiry } from '../controller/enquiryController.js';

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiries. Please try again later.' },
});

router.post('/', enquiryLimiter, submitEnquiry);

export default router;
