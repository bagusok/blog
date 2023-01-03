import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';

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
  if (req.method !== 'POST')
    res.status(405).json({ status: false, message: 'Method not allowed' });

  try {
    const { key } = req.body;

    const bucketParams = { Bucket: process.env.S3_UPLOAD_BUCKET, Key: key };

    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));

    if (data) {
      return res
        .status(200)
        .json({ status: true, message: 'Success Delete Image' });
    }
    return res.status(400).json({ status: false, message: 'Gagal hapus data' });
  } catch (e) {
    return res.status(500).json({ status: false, message: 'Error' });
  }
}
