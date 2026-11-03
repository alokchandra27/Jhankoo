import imageCompression from "browser-image-compression";

const ProcessAndCompressImage = async (file, type = "default") => {
  // Agar file image nahi hai toh original file return kar dein
  if (!file.type.startsWith("image/")) return file;

  // Banner aur normal images ke liye separate settings
  const options = {
    maxSizeMB: type === "banner" ? 3 : 2,
    maxWidthOrHeight: type === "banner" ? 3000 : 2560,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.95,
  };

  try {
    // Original aur compressed file size check karne ke liye
    // console.log(`Original Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const compressedFile = await imageCompression(file, options);

    // console.log(`Compressed Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

    return compressedFile;
  } catch (error) {
    console.error("Compression failed, using original file", error);
    return file;
  }
};

export default ProcessAndCompressImage;