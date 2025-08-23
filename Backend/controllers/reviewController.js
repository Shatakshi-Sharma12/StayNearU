import Review from "../models/Review.js";
import PG from "../models/PG.js";


const postReview=async (req,res)=>{
    
    try{
        const {id}=req.params;
        const {rating,comment,userId}=req.body;
        // if (!userId) {
        //     return res.json({ success: false, message: "Please Login." });
        // }
        const pg=await PG.findById(id);
        const review=new Review({rating, comment,userId});
        pg.reviews.push(review);
        await review.save();
        await pg.save();
        return res.json({success:true,message:"Review Added Successfully!"})
    }
    catch(err){
        console.log(err);
        
        return res.json({success:false,message:"Failed to Add Review"})
    }
}

export {postReview}