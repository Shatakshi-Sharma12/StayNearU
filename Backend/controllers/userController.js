import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'


const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
let otpStorage={}

// Signup
const signup=async (req,res)=>{
    const {name,email,password,userType}=req.body;
    console.log(email);
    
    try{
        const exists=await User.findOne({email})
        if(exists){
            return res.json({success:false,msg:"Email already exists"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,msg:"Ivalid Email"})
        }
        if(password.length<8){
            return res.json({success:false,msg:'Please enter a strong password'})
        }
        const otp = genOtp(email);
        await sendOtpMail(email, otp);

        return res.json({ success: true, msg: "OTP sent to your email. Please verify the OTP." });
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Something went wrong!"})
    }
}

// // OTP generator
const genOtp=(email)=>{
        const otp=Math.floor(100000+Math.random()*900000);
        otpStorage[email]={otp, expires:Date.now()+300000};
        return otp;
}

// Verify OTP
const verifyOtp = async (req, res) => {
    const { name, email, password,userType, otp } = req.body;  
    console.log(otpStorage)  
    try {
        
        if (!otpStorage[email]) {
            console.log("jjjj");
            
            return res.json({ success: false, msg: "OTP not found for this email" });
        }
        console.log("idhar");

        if (otpStorage[email].expires < Date.now()) {
            console.log("kkkkk");
            delete otpStorage[email];
            return res.json({ success: false, msg: "OTP has expired" });
        }
        console.log("jiiijji");
        
        if(otpStorage[email].otp !== parseInt(otp, 10)) {
            return res.json({ success: false, msg: "Invalid OTP" });
        }
        console.log("idhar idhar");

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPass,userType });
        const user = await newUser.save();
        const token = createToken(user._id);

        delete otpStorage[email];

        return res.json({ success: true, msg: "User created successfully", token, user });

    } catch (err) {
        console.log(err)
        return res.json({ success: false, message: "Something went wrong!" });
    }
};

// login
const login=async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.json({success:false,msg:"User does not exists!"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.json({success:false,msg:"Wrong Password"})
        const token=createToken(user._id)
        res.json({success:true,msg:"Logged in Successfully",token,user})
    }
    catch(err){
        console.log(err)
        res.json({success:false,msg:"Error"})
    }
}

// logout
const logout = async (req, res) => {
    try {
        res.json({ success: true, msg: "Logged Out" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, msg: "Error logging out" });
    }
}

// sending mail
const sendMail=async(req,res)=>{
    const { email, userName, type, details } = req.body;
    if (!email || !userName || !type) {
        return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    let config={
        service: process.env.SMTP_SERVICE,
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    };

    let transporter=nodemailer.createTransport(config);
    let Mailgenerator=new Mailgen({
        theme:'sketchy',
        product:{
            name:'StayNearU',
            link:'http://localhost:5173',
        }
    })

    let  response = {
        body: {
            name: userName,
            intro: "Congratulations, you have successfully created your account!",
            description: "Start exploring our website and enjoy a variety of products and services we offer.",
            button: {
                color: '#22BC66',
                text: 'Go to Homepage',
                link: 'http://localhost:5173'
            },
            outro: "If you have any questions, feel free to contact our support team."
        }
    };

    const Email=process.env.EMAIL;
    let mail=Mailgenerator.generate(response);
    let message={
        from:Email,
        to:email,
        subject:"OTP for Email Verification",
        html: mail
    };
    try{
        await transporter.sendMail(message);
        res.json({success:true,msg:"Email sent successfully!"});
    }catch(e){
        console.log(e);
        res.json({ success: false, msg: "Failed to send email." })
    }
};

// Resend otp
const resendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, msg: "Email is required" });
    }

    const otp = genOtp(email);
    try {
        await sendOtpMail(email, otp);
        return res.json({ success: true, msg: "OTP resent successfully" });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return res.json({ success: false, msg: "Failed to send OTP" });
    }
};
const sendOtpMail = async (email, otp) => {
    let config = {
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);
    let Mailgenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'StayNearU',
            link: 'http://localhost:5173',
        }
    });

    let response = {
        body: {
            intro: `Your OTP for verification is ${otp}`,
            outro: "If you didn't request this, please ignore this email."
        }
    };

    const mail = Mailgenerator.generate(response);
    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP for Email Verification",
        html: mail
    };

    await transporter.sendMail(message);
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("helllll");
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, msg: "User does not exist!" });
        }

        const token = createToken(user._id);

        let config = {
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        };

        let transporter = nodemailer.createTransport(config);
        let Mailgenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'StayNearU',
                link: 'http://localhost:5173',
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${token}`; // Update with your reset password link

        let response = {
            body: {
                intro: `You requested a password reset. Click the link below to reset your password:`,
                action: {
                    instructions: `Reset your password by clicking here:`,
                    button: {
                        color: '#22BC66',
                        text: 'Reset Password',
                        link: resetLink,
                    },
                },
                outro: "If you didn't request this, please ignore this email.",
            },
        };

        const mail = Mailgenerator.generate(response);
        let message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: mail,
        };

        await transporter.sendMail(message);
        res.json({ success: true, msg: "Password reset link sent to your email." });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Something went wrong!" });
    }
};

const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Update the user's password in the database
        await User.findByIdAndUpdate(userId, { password: hashedPass });

        res.json({ success: true, msg: "Password has been reset successfully." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, msg: "Invalid or expired token." });
    }
};

export {signup,login,logout,verifyOtp,resendOtp,forgotPassword,resetPassword}