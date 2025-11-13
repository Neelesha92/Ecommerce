import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary"; // path to cloudinary.ts

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  } as any,
});

const upload = multer({ storage });

export default upload;
