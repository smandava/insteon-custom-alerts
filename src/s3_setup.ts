import S3Provider from './s3-provider';
import Config from './config';

let provider = new S3Provider(Config.bucketName(), Config.docName());
provider.createInitialObject();