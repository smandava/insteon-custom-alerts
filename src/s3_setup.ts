import {S3} from 'aws-sdk';
import Config from './config';

async function createInitialObject(bucketName: string, keyName: string) {
    try {
        let bucketRequest = {
            Bucket: bucketName
        };
        let bucket = await s3.createBucket(bucketRequest).promise();    
        let objectRequest = {
            Bucket: bucketName,
            Key: keyName,
            Body: '{}'
        };
        let object = await s3.putObject(objectRequest).promise();
        console.log ('S3 document created successfully.');
    } catch (e) {
        console.log(e);
        throw new Error('failed');   
    }
}

let s3 = new S3();

createInitialObject(Config.bucketName(), Config.docName());