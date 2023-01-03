import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs';

export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.S3_UPLOAD_ENDPOINT,
  region: 'nyc3',
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
  // console.log(req);
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (!files) {
      return res
        .status(400)
        .json({ status: false, message: 'No file Uploaded' });
    }

    const bucketParams = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: `blog/${files.image.originalFilename}`,
      Body: fs.createReadStream(files.image.filepath),
      ACL: 'public-read',
    };

    // console.log(files.image);
    try {
      // return s3Client.putObject(
      //   {
      //     Bucket: process.env.S3_UPLOAD_BUCKET,
      //     Key: files.image.originalFilename,
      //     Body: fs.createReadStream(files.image.filepath),
      //     ACL: 'public-read',
      //   },
      //   async () => res.status(201).json({ status: true })
      // );

      const data = await s3Client.send(new PutObjectCommand(bucketParams));
      console.log(
        'Successfully uploaded object: ' +
          bucketParams.Bucket +
          '/' +
          bucketParams.Key
      );

      return res.status(201).json({ status: true, data });
    } catch (e) {
      console.log(e.message);
    }

    return res.status(500).json({ status: false });
  });
}
