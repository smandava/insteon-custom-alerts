import {S3} from 'aws-sdk';
import {DeviceStatus, DeviceStatusCode} from './interfaces';

class S3Provider {

    bucketName: string;
    keyName: string;

    constructor(bucketName: string, keyName: string) {
        this.bucketName = bucketName;
        this.keyName = keyName;
    }  

    async createInitialObject() {
        try {
            let s3 = new S3();
            let bucketRequest = {
                Bucket: this.bucketName
            };
            let bucket = await s3.createBucket(bucketRequest).promise();    
            let objectRequest = {
                Bucket: this.bucketName,
                Key: this.keyName,
                Body: '{}'
            };
            let object = await s3.putObject(objectRequest).promise();
            console.log ('S3 document created successfully.');
        } catch (e) {
            console.log(e);
            throw new Error('failed');   
        }
    }

    async getStoredStatus() {
        try {
            let s3 = new S3();
            let objectRequest: S3.GetObjectRequest = {
                Bucket: this.bucketName,
                Key: this.keyName
            };
            let obj = await s3.getObject(objectRequest).promise();
            return JSON.parse(obj.Body.toString());

        } catch (e) {
            console.log('get s3 object failed. Try running npm run setup_s3');
            throw e;
        }
    }

    async mergeStatus(currentStatus: {}) {
        let mergedStatus = {};

        let storedStatus = await this.getStoredStatus();

        for (let deviceId in currentStatus) {
            if (currentStatus.hasOwnProperty(deviceId)) {
                let status: DeviceStatus = currentStatus[deviceId];
                if (status.Status === DeviceStatusCode.Off) {
                    continue;
                }
                if (storedStatus.hasOwnProperty(deviceId)) {
                    let obj: DeviceStatus = storedStatus[deviceId];
                    obj.Name = status.Name;
                    obj.PreviousStatus = obj.Status;
                    obj.Status = status.Status;
                    mergedStatus[deviceId] = obj;
                }  else {
                    status.firstSeen = Date.now();
                    mergedStatus[deviceId] = status;
                }  
            }
        }

        return mergedStatus;
    }

    async updateStatus(status: {}) {
        let s3 = new S3();
        let objectRequest = {
                Bucket: this.bucketName,
                Key: this.keyName,
                Body: JSON.stringify(status)
        };
        let object = await s3.putObject(objectRequest).promise();
        console.log ('S3 document updated successfully.');
    }

}

export default S3Provider;