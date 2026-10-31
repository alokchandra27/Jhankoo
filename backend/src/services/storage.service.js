const ImageKit = require("@imagekit/nodejs");
const { toFile } = ImageKit;

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(file, folderName) {
  try {
    if (!file || !file.buffer) {
      throw new Error("File buffer is missing");
    }

    const convertedFile = await toFile(file.buffer, file.originalname);

    const response = await client.files.upload({
      file: convertedFile,
      fileName: file.originalname,
      folder: `JhankooProducts/${folderName}`,
    });

    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
}


async function deleteImage(fileId) {
  try {

    if (!fileId || typeof fileId !== 'string' || fileId.startsWith('{')) {
      console.log("Valid File ID nahi mili, ImageKit cleanup skip kiya gaya.");
      return;
    }
    
    await client.files.delete(fileId); 
    console.log(`Image with ID ${fileId} deleted from ImageKit successfully.`);
  } catch (error) {

    if (error.statusCode === 404) {
      console.warn(`[ImageKit Warning]: File (${fileId}) pehle se hi deleted hai ya nahi mili.`);
    } else {
      console.error('Error deleting image from ImageKit:', error.message);
    }
  }
}


module.exports = { uploadImage , deleteImage };
