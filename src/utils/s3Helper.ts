import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export const generatePresignedUrl = async (key: string, contentType: string): Promise<string> => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || 'your-s3-bucket',
        Key: key,
        ContentType: contentType,
        Expires: 60 * 10 
    };
    
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
};