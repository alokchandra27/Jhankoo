import imageCompression from "browser-image-compression";

const ProcessAndCompressImage = async (file) => {
  // Agar file image nahi hai toh return kar dein
  if (!file.type.startsWith("image/")) return file;

  const options = {
    maxSizeMB: 1,          // 🎯 Maximum size 1 mb locked! (Bohot saaf dikhegi)
    maxWidthOrHeight: 2000,  // 📐 Dimension 2000px (HD quality retina screens ke liye)
    useWebWorker: true,
    fileType: "image/webp",  // ⚡ Auto-convert to WebP (Next-gen lightweight format)
    initialQuality: 0.9,   // 🔧 Initial quality 80% (Adjustable)
  };

  try {
    console.log(`Original Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed Size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
    
    // Nayi file ko upload karne ke liye return karein
    return compressedFile; 
  } catch (error) {
    console.error("Compression failed, using original file", error);
    return file;
  }
};

// 💡 UPLOAD HANDLER MEIN ISE AISE USE KAREIN:
const onFileChange = async (e) => {
  const files = Array.from(e.target.files);
  
  const compressedFilesPromises = files.map(file => ProcessAndCompressImage(file));
  const readyToUploadFiles = await Promise.all(compressedFilesPromises);
  
  // Ab in readyToUploadFiles ko apne FormData ya ImageKit SDK ke sath backend bhejein
};

export default ProcessAndCompressImage;

