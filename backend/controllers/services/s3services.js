import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export const uploadImagesToS3 = async (files, folder = 'recipes') => {
    try {
        const uploadPromises = files.map(file => {
            const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
            return s3.upload({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype
            }).promise();
        });

        // Wait for all files to upload
        const uploadedFiles = await Promise.all(uploadPromises);
        return uploadedFiles.map(file => ({ url: file.Location }));
    } catch (error) {
        throw new Error('Error uploading images to S3: ' + error.message);
    }
};
