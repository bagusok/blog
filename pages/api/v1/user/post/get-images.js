import { S3, ListObjectsCommand } from '@aws-sdk/client-s3';
import _ from 'lodash';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dndupq223',
  api_key: '873149264828512',
  api_secret: 'TJosDghmu3TG4tAlGjSA7AkdFTQ',
});

export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.S3_UPLOAD_ENDPOINT,
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Method not allowed' });

  if (!req.query.type) return res.status(403).json({ status: false, message: 'Req tidak valid' });

  const { type } = req.query;

  const bucketParams = { Bucket: process.env.S3_UPLOAD_BUCKET };

  try {
    if (type.toLowerCase() === 'cloudinary') {
      const data = await cloudinary.api.resources({ type: 'upload', prefix: 'blog', max_results: 1000 });

      const newData = data?.resources?.map((a, i) => {
        return {
          type: 'cloudinary',
          path: a.public_id,
          url: a.secure_url,
          created_at: a.created_at,
        };
      });
      return res.status(200).json({ status: true, data: newData });
    }
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));

    const newData = data?.Contents?.map((a, i) => {
      return {
        type: 's3',
        path: a.Key,
        url: `https://bagusok.sgp1.digitaloceanspaces.com/${a.Key}`,
        created_at: a.LastModified,
      };
    });

    const sortData = _.orderBy(newData, ['created_at'], ['desc']);
    return res.status(200).json({ status: true, data: sortData });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ status: false });
  }
}
