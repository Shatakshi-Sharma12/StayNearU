import Profile from "../models/Profile.js";
import PG from "../models/PG.js";
import User from "../models/User.js";

const getProfile=async(req,res)=>{
    try{
        const user=req.query.userId;
        console.log(user);
        
        const profile=await Profile.findOne({user:user}).populate('bookings');
        if(!profile){
            return res.json({success:false,message:"Profile not found"})
        }
        console.log(profile);
        
        return res.json({success:true,profile});
    }catch(e){
        console.log(e)
        return res.json({success:false,message:"Profile not found"})
    }
}

export const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, email, phone, age, gender, parent, address, user } = req.body;

    const profilePhoto = req?.files?.profilePhoto?.[0]?.path || null;
    const aadharFile = req?.files?.aadharFile?.[0]?.path || null;

    if (!user || !email || !phone || !parent || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const updateData = {
      name, email, phone, age, gender, parent, address
    };

    if (profilePhoto) updateData.profilePhoto = profilePhoto;
    if (aadharFile) updateData.aadharFile = aadharFile;

    const profile = await Profile.findOneAndUpdate(
      { user },
      updateData,
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, profile });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {getProfile};