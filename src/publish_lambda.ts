import * as path from 'path';
import {Lambda} from 'aws-sdk';
import Config from './config';
import * as fs from 'fs';
import * as archiver from 'archiver';

class LambdaBuilder {
    lambda: Lambda; 
    constructor() {
        this.lambda = new Lambda({region: Config.region()});
    }
    async functionExists() {
        try {
            let request: Lambda.GetFunctionRequest = {
            FunctionName: Config.functionName()
            };  
            let response = await this.lambda.getFunction(request).promise();
            return true;
        } catch (e) {
            if (e.code === 'ResourceNotFoundException') {
                return false;
            }
            throw e;
        }
    }
    async deleteFunction() {
        try {
            let request: Lambda.DeleteFunctionRequest = {
                FunctionName: Config.functionName()
            };
            await this.lambda.deleteFunction(request).promise();
            console.log('Deleted exitsting function');
        } catch (e) {
            console.log('delete function failed.');
            throw (e);
        }
    }
    async createZipFile() {
        let zipper = (resolve, reject) => {
            let archive = archiver('zip');
            let output = fs.createWriteStream(path.resolve(path.join('.', 'build', 'lambda.zip')));
            output.on('close', function() {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
                resolve();
            });
            archive.on('error', function(err: {}) {
                console.log('zip failed.');
                reject(err);
            });
            archive.pipe(output);
            archive
                .append(fs.createReadStream(path.resolve(path.join('.', 'build', 'lambda.js'))), { name: 'lambda.js' })
                .finalize();
        };
        await new Promise((resolve, reject) => zipper(resolve, reject));
    }
    async publishLambda() {
        try {
            if (await this.functionExists()) {
                console.log(`Function ${Config.functionName()} already exists.`);                
                await this.deleteFunction();
            }
            await this.createZipFile();
            let request: Lambda.CreateFunctionRequest = {
                FunctionName : Config.functionName(),
                Runtime: 'nodejs6.10',
                Role: Config.lambdaRoleArn(),
                Handler: 'lambda.handler',
                Code: {
                    ZipFile:  fs.readFileSync(path.resolve(path.join('build', 'lambda.zip')))
                },
                Timeout: 60
                };
            let result = await this.lambda.createFunction(request).promise();
            console.log(`${Config.functionName()} published successfully.`);
        } catch (e) {
            throw e;
        }
    }
}

let builder = new LambdaBuilder();
builder.publishLambda();