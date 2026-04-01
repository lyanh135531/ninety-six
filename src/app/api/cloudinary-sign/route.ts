import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = "mom-baby-store";

export async function POST() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Create signature for Cloudinary (must include all specific params like folder)
  const signature = cloudinary.utils.api_sign_request(
    { 
      timestamp,
      folder: FOLDER 
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return Response.json({
    signature,
    timestamp,
    folder: FOLDER,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
}
