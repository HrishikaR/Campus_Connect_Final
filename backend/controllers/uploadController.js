import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (req, res, next) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
    }

    // If file uploaded via multer or base64 payload
    let imageUrl = '';

    if (req.file) {
      // If cloudinary configured, upload buffer/path
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'campusconnect' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } else {
        // Fallback to data URI
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
      }
    } else if (req.body.image) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await cloudinary.uploader.upload(req.body.image, {
          folder: 'campusconnect'
        });
        imageUrl = result.secure_url;
      } else {
        imageUrl = req.body.image;
      }
    } else {
      return res.status(400).json({ success: false, message: 'No file or image data provided' });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
};
