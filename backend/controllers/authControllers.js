const Users=require('../models/userModel')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Vendors=require('../models/vendorModel');
const Admin=require('../models/adminModel');
const DeliveryAgent = require('../models/deliveryAgentModel');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


const vendorStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vendor_shops",
    allowed_formats: ["jpg","png","jpeg"],
    transformation: [
      { width: 600, height: 600, crop: "limit", quality: "auto" }
    ]
  }
});

const uploadVendor = multer({ storage: vendorStorage });

exports.uploadVendor = uploadVendor;



// user registration

exports.registerUser=async(req,res)=>{
    try{
        const {name,email,password,mobile,address}=req.body

        const isExists=await Users.findOne({email});
        if(isExists){
            return res.status(409).json({
                status:"fail",
                message:"Email already registered"
            })
        }

        const hashedpwd=await bcrypt.hash(password,10);

        const newUser=await Users.create({
            name,
            email,
            password:hashedpwd,
            address,
            mobile,
            role:"user"
        })

        res.status(201).json({
            status:"success",
            message:"account created successfully"
        });
    }
    catch(err){
        if(err.name==="ValidationError"){
            const message = Object.values(err.errors).map(e=>e.message);
            return res.status(400).json({
                status:"fail",
                message: message.join(", ")
            });
        }
        res.status(500).json({
            status:"fail",
            message: "Error while registering user",
            err:err.message
        })
    }
}


// user login

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "user not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.MY_LOCALBASKET_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            status: "success",
            message: "user login successful",
            token,
            user,
            role:user.role
        });

    } catch (err) {
        res.status(500).json({
            message: "Error while user login",
            error: err.message
        });
    }
};


//vendor register

exports.registerVendor=async(req,res)=>{
    try{
        const {name,email,password,shopName,category,address,mobile}=req.body;

        let shopImage="";

        if(req.file){
            shopImage=req.file.path;
        }

        const isExists=await Vendors.findOne({email});

        if(isExists){
            return res.status(409).json({
                status:"fail",
                message:"Email already registered"
            })
        }

        const hashedpwd=await bcrypt.hash(password,10);

        const vendor=await Vendors.create({
            name,
            email,
            password:hashedpwd,
            shopName,
            shopImage,
            category,
            status:"pending",
            address,
            mobile,
            role:"vendor"
        })

        res.status(201).json({
            status:"success",
            message:"vendor account created successfully",
        })
    }
    catch(err){
        res.status(500).json({
            message:"error while registering vendor",
            err:err.message
        })
    }
}


// vendor login

exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const vendor = await Vendors.findOne({ email })

        if (!vendor) {
            return res.status(404).json({
                status: "fail",
                message: "Vendor not found"
            });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid credentials"
            });
        }

        // ❗ Important check
        if (vendor.status !== "approved") {
            return res.status(403).json({
                status: "fail",
                message: "Vendor not approved by admin"
            });
        }

        const token = jwt.sign(
            { id: vendor._id, role: vendor.role },
            process.env.MY_LOCALBASKET_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            status: "success",
            message: "Vendor login successful",
            token,
            vendor,
            role:vendor.role
        });

    } catch (err) {
        res.status(500).json({
            message: "Error while vendor login",
            error: err.message
        });
    }
};

//admin register
exports.registerAdmin=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const isExists=await Admin.findOne({email});
        if(isExists){
            return res.status(409).json({
                status:"fail",
                message:"Email already registered"
            })
        }

        const hashedPwd=await bcrypt.hash(password,10);

        const admin=await Admin.create({name,email,password:hashedPwd});

        res.status(201).json({
            status:"success",
            message:"admin account created successfully",
        })
    }
    catch(err){
        res.status(500).json({
            message: "Error while creating admin account",
            error: err.message
        });
    }
}

// admin login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email })

        if (!admin) {
            return res.status(404).json({
                status: "fail",
                message: "Admin not found"
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.MY_LOCALBASKET_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            status: "success",
            message: "Admin login successful",
            token,
            admin,
            role:admin.role
        });

    } catch (err) {
        res.status(500).json({
            message: "Error while admin login",
            error: err.message
        });
    }
};



// login delivery agent

exports.loginDeliveryAgent=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const agent=await DeliveryAgent.findOne({email});
        if(!agent){
            return res.status(404).json({
                status:"fail",
                message:"Agent not found"
            })
        }

        const isMatch=await bcrypt.compare(password,agent.password);
        if(!isMatch){
            return res.status(401).json({
                status:"fail",
                message:"Invalid credentials check email and password"
            })
        }

        if(agent.status!=="approved"){
            return res.status(403).json({
                message:"Agent not approved by admin"
            })
        }

        const token=jwt.sign({id:agent._id,role:agent.role},process.env.MY_LOCALBASKET_SECRET_KEY,{expiresIn:"1h"});

        res.status(200).json({
            status:"success",
            message:"Agent login successfully",
            agent,
            token,
            role:agent.role
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error while login try after some time",
            err:err.message
        })
    }
}