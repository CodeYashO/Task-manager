const User = require("../Models/User");
const Task = require("../Models/Task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/SendEmail");

exports.register = async (req , res) => {
    const {firstName , lastName , email , password} = req.body;
    console.log(req.body)
    
    try {
        let user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message : "user already exists"}); 
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt)
        
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 24 * 60 * 60 * 1000;

        let hashedOtp = await bcrypt.hash(otp , 10);

        user = new User({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            otp : hashedOtp,
            otpExpires,
        })

        await user.save();

        const message = `Please check your email , your verification code is ${otp}`;
        await sendEmail(email, "Email Verification", message);
    
        res.status(201).json({
          message: "user registered successfully please check your email",
        });

    }catch(err) {
        console.error(err.message)
        res.status(500).json({message : "Server Error"});
    }
}

exports.verifyOtp = async (req , res) => {
    const {email , otp} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message : "invalid email or otp"}); 
        }

        if(Date.now() > user.otpExpires) {
            return res.status(400).json({ message: "invalid or expired OTP" });
        }
    
        const isMatch = await bcrypt.compare(otp, user.otp);
        if(!isMatch) {
            return res.status(400).json({ message: "invalid otp" });
        }
      
        user.emailVerified = true;
        user.otp = undefined; 
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({userId : user.id} , process.env.JWT_TOKEN_KEY , {expiresIn : "1d"})

        res.status(200).json({token , user , message : "email verified successfully"})
      
    }catch (err) {
        console.error(err.message);
        res.status(500).json({message : "Server Error"});
    }
}

exports.login = async (req , res) => {
    const {email , password} = req.body;
    console.log(req.body)
    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message : "Invalid credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message : "Invalid credentials"})
        }

        if(!user.emailVerified) {
            return res.status(400).json({message : "please verify your email before log in"})
        }

        const token = jwt.sign({userId : user.id} , process.env.JWT_TOKEN_KEY , {
            expiresIn : "1d"
        })

        res.status(200).json({ token, user  , message : "log in successfully"});

    }catch(err) {
        console.error(err.message);
        res.status(500).json({message : "Server Error"});
    }
}

exports.forgotPassword = async (req , res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message : "user not found"})
        }

        const resettoken = crypto.randomBytes(20).toString('hex')

        user.resetPasswordToken = crypto.createHash('sha256').update(resettoken).digest('hex')
        user.resetPasswordExpires = Date.now() + 24*60*60*1000

        await user.save();

        const resetPasswordUrl = `${req.protocol}://localhost:3000/reset-password/${user.resetPasswordToken}`;
        const message = `Reset your password by clicking on the following link: ${resetPasswordUrl}`;
        await sendEmail(email, "Password Reset", message);
    
        res.status(200).json({ message: "Reset password email sent" });
    }catch(err) {
        console.error(err.message);
        res.status(500).json({message : "Server Error"});
    }
}

exports.resetPassword = async (req, res) => {
    const {resetToken} = req.params;
    const {password } = req.body;
  
    try {
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() },
        })
        
        if(!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        const token = jwt.sign({userId : user.id} , process.env.JWT_TOKEN_KEY , {
            expiresIn : "1d"
        })

        res.status(200).json({token , message: "password reset successful" })
    }catch (err) {
        console.error(err.messae);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token); 
        if (!token) {
            return res.status(401).json({valid : false , message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        const user = await User.findById(decoded.userId).populate("Tasks");

        if(!user) {
            return res.status(401).json({valid : false , message: "User not found" });
        }

        res.status(200).json({ user: user, valid: true });
    } catch (err) {
        console.error(err.message); 
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};