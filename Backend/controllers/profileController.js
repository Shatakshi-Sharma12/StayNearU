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

const createOrUpdateProfile = async (req, res) => {
    try {
      const photo = req.files?.photo?.[0]?.filename;
      const aadharCard = req.files?.aadhar?.[0]?.filename;
      const { name, email, phone, age, gender, parent, address, user } = req.body;

      if (!user || !email || !phone || !aadharCard) {
        return res.json({ success: false, message: "Please provide all the required fields" });
      }
      const existingProfile = await Profile.findOne({ user });
  
      if (existingProfile) {
        existingProfile.name = name || existingProfile.name;
        existingProfile.email = email || existingProfile.email;
        existingProfile.phone = phone || existingProfile.phone;
        existingProfile.age = age || existingProfile.age;
        existingProfile.gender = gender || existingProfile.gender;
        existingProfile.parent = parent || existingProfile.parent;
        existingProfile.address = address || existingProfile.address;
  
        if (photo) existingProfile.photo = photo;
        if (aadharCard) existingProfile.aadharCard = aadharCard;
  
        await existingProfile.save();
  
        return res.json({ success: true, message: "Profile updated successfully" });
      } else {
        const profile = new Profile({
          name,
          email,
          phone,
          age,
          gender,
          parent,
          address,
          photo,
          aadharCard,
          user,
        });
  
        await profile.save();
  
        return res.json({ success: true, message: "Profile created successfully" });
      }
    } catch (e) {
      console.error(e);
      return res.json({ success: false, message: "Something went wrong" });
    }
  };
  

export {getProfile,createOrUpdateProfile};