import express from 'express';
import {   getMe, resendOTP, sendSigninOTP, signin, signout, signup } from '../controllers/authController.js';
const router = express.Router();

console.log("authRoutes me agya");

// router.get("/me", getMe);
router.get("/me", (req, res, next) => {
  console.log("📩 /auth/me route hit");
  next();
}, getMe);

router.post("/signup", signup); //working
router.post("/signin", signin);  //working
router.post("/signin/get-otp", resendOTP); //working
router.post("/resend-otp", resendOTP);
router.post("/signout", signout);
// router.post("/google-signup", googleSignIn);




export default router;