import { S3, ListObjectsCommand } from '@aws-sdk/client-s3';
import _ from 'lodash';

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
  const bucketParams = { Bucket: process.env.S3_UPLOAD_BUCKET };

  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));

    const newData = data?.Contents?.map((a, i) => {
      return {
        path: a.Key,
        url: `https://bagusoks.nyc3.digitaloceanspaces.com/${a.Key}`,
        created_at: a.LastModified,
      };
    });

    const sortData = _.orderBy(newData, ['created_at'], ['desc']);

    return res.status(201).json({ status: true, data: sortData });
  } catch (e) {
    return res.status(500).json({ status: false });
  }
}
