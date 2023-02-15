import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { prismaOrm } from '../../../../../lib/prisma';

cloudinary.config({
  cloud_name: 'dndupq223',
  api_key: '873149264828512',
  api_secret: 'TJosDghmu3TG4tAlGjSA7AkdFTQ',
});

export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: 'https://' + process.env.S3_UPLOAD_ENDPOINT,
  region: process.env.S3_UPLOAD_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Method Not Allowed' });

  const checkUploadProvider = await prismaOrm.SiteSetting.findFirst({
    select: {
      uploadFileProvider: true,
    },
  });

  const form = formidable();

  try {
    form.maxFileSize = 5 * 1024 * 1024; // <5Mb
    form.parse(req, async (err, fields, files) => {
      if (!files) {
        return res.status(400).json({ status: false, message: 'No file Uploaded' });
      }

      if (checkUploadProvider.uploadFileProvider === 'CLOUDINARY') {
        const uploadCLoudinary = await cloudinary.uploader.upload(files.image.filepath, {
          unique_filename: true,
          folder: 'blog',
        });

        return res.status(200).json({
          status: true,
          message: 'Upload Image Success',
          data: uploadCLoudinary,
        });
      } else {
        const convertImage = await sharp(files.image.filepath)
          .toFormat('webp')
          .withMetadata()
          .webp({ quality: 50 })
          .toBuffer();

        const fileName = nanoid(30) + '.webp';

        const bucketParams = {
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Key: `blog/${fileName}`,
          Body: convertImage,
          ACL: 'public-read',
        };
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        return res.status(201).json({ status: true, data });
      }
    });
  } catch (err) {
    console.log('err', err.message);
    return res.status(201).json({ status: true, msg: 'ssjjs', err: err.message });
  }
}
