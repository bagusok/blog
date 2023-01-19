import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';

export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.S3_UPLOAD_ENDPOINT,
  region: process.env.S3_UPLOAD_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') res.status(405).json({ status: false, message: 'Method not allowed' });

  try {
    const { key, type } = req.body;

    if (type.toLowerCase() === 'cloudinary') {
      const deleteCloudinary = await cloudinary.uploader.destroy(key);

      if (deleteCloudinary.result !== 'ok')
        return res.status(400).json({ status: true, message: 'Delete image failed' });

      return res.status(200).json({ status: true, message: 'Success Delete Image' });
    }

    const bucketParams = { Bucket: process.env.S3_UPLOAD_BUCKET, Key: key };

    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));

    if (!data) return res.status(400).json({ status: true, message: 'Delete image failed' });

    return res.status(200).json({ status: true, message: 'Success Delete Image' });
  } catch (e) {
    return res.status(500).json({ status: false, message: 'Error' });
  }
}
