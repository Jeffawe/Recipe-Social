import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

export const uploadImagesToS3 = async (files, folder = 'recipes') => {
    try {
        const uploadPromises = files.map(async (file) => {
            const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype
            };

            const command = new PutObjectCommand(params);
            await s3.send(command);

            return {
                fileName: fileName,
                size: file.size
            };
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        return uploadedFiles;
    } catch (error) {
        throw new Error('Error uploading images to S3: ' + error.message);
    }
};