import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Function to generate SHA256 hash of an uploaded file buffer
const generateFileHash = (fileBuffer) => {
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);  // Feed the file buffer into the hash function
  return hash.digest('hex');  // Return the hash as a hex string
};

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

export const uploadImagesToS3 = async (files, folder = 'recipes') => {
    try {
        const uploadPromises = files.map(async (file) => {
            const fileHash = generateFileHash(file.buffer);
            const fileName = `${folder}/${fileHash}`;
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