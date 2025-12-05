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
    const aadharCard = req.files?.aadharCard?.[0]?.filename;

    const { name, email, phone, age, gender, parent, address, user } = req.body;

    if (!user) {
      return res.json({ success: false, message: "User ID missing" });
    }

    let profile = await Profile.findOne({ user });

    if (profile) {
      // Update profile
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.phone = phone || profile.phone;
      profile.age = age || profile.age;
      profile.gender = gender || profile.gender;
      profile.parent = parent || profile.parent;
      profile.address = address || profile.address;

      if (photo) profile.photo = photo;
      if (aadharCard) profile.aadharCard = aadharCard;

      await profile.save();
      return res.json({ success: true, message: "Profile updated successfully", profile });
    }

    // Create new profile
    const newProfile = new Profile({
      name,
      email,
      phone,
      age,
      gender,
      parent,
      address,
      user,
      photo,
      aadharCard
    });

    await newProfile.save();

    res.json({ success: true, message: "Profile created successfully", profile: newProfile });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error" });
  }
};

  

export {getProfile,createOrUpdateProfile};