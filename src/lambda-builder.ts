import * as path from 'path';
import { Lambda, CloudWatchEvents } from 'aws-sdk';
import Config from './config';
import * as fs from 'fs';
import * as archiver from 'archiver';

class LambdaBuilder {
    lambda: Lambda; 
    eventsApi: CloudWatchEvents;
    ruleArn: string;

    constructor() {
        this.lambda = new Lambda({region: Config.region()});
        this.eventsApi = new CloudWatchEvents({region: Config.region()});
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
                console.log(`Created zip file. (${archive.pointer()} total bytes)`);
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

    async updateLambda() {
        try {
            let request: Lambda.UpdateFunctionCodeRequest = {
                FunctionName : Config.functionName(),
                ZipFile:  fs.readFileSync(path.resolve(path.join('build', 'lambda.zip')))
            };

            let result = await this.lambda.updateFunctionCode(request).promise();
            console.log(`${Config.functionName()} updated successfully.`);
            return result.FunctionArn;
        } catch (e) {
            throw e;
        }

    }
    async createLambda() {
        try {
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
            return result.FunctionArn;
        } catch (e) {
            throw e;
        }
    }

    async setupFunction() {
        console.log('Preparing zip file');
        await this.createZipFile();

        console.log('Uploading to lambda');
        let functionExists = await this.functionExists();
        if (functionExists) {
            return await this.updateLambda();
        } else {
            return await this.createLambda();
        }
    }

    async setupCloudwatchRule () {
        console.log('setting up rule');
        try {
            let request: CloudWatchEvents.PutRuleRequest = {
                Name: Config.functionName(),
                ScheduleExpression: 'rate(15 minutes)'
            };
            let response = await this.eventsApi.putRule(request).promise();
            return response.RuleArn;
        } catch (e) {
            console.log('Put CloudWatch request failed!');
            throw e;
        }
    }

    async cloudWatchRuleExists () {
        try {
            let request: CloudWatchEvents.DescribeRuleRequest = {
                Name: Config.functionName()
            };
            let response = await this.eventsApi.describeRule(request).promise();
            return true;
        } catch (e) {
            if (e.code === 'ResourceNotFoundException') {
                return false;
            }
            throw e;
        }
    }

    async deleteCloudWatchRule() {
        try {

            let ruleTargetRequest: CloudWatchEvents.ListTargetsByRuleRequest = {
                Rule: Config.functionName()
            };
            let targets = await this.eventsApi.listTargetsByRule(ruleTargetRequest).promise();
            let targetIds = targets.Targets.map(x => x.Id);
            for (let target of targets.Targets ) {
                let removeTargetRequest: CloudWatchEvents.RemoveTargetsRequest = {
                    Rule: Config.functionName(),
                    Ids: targetIds
                };
                await this.eventsApi.removeTargets(removeTargetRequest).promise();
            }
            let request: CloudWatchEvents.DeleteRuleRequest = {
                Name: Config.functionName()
            };
            let response = await this.eventsApi.deleteRule(request).promise();

        } catch (e) {
            console.log('Delete rule failed!');
            throw e;
        }
    }

    async accociateLambdaToScheduler(ruleArn: string, functionArn: string) {
        try {
            console.log('Granting InvokeFunction permission to rule');
            let request: Lambda.AddPermissionRequest = {
                FunctionName: Config.functionName(),
                StatementId: Config.functionName(),
                Action: 'lambda:InvokeFunction',
                Principal: 'events.amazonaws.com',
                SourceArn: ruleArn
            };
            let response = await this.lambda.addPermission(request).promise();
            
            console.log('adding function to Rule target');
            let ruleTargetRequest: CloudWatchEvents.PutTargetsRequest = {
                Rule: Config.functionName(),
                Targets: [
                    {
                        Id: Config.functionName(),
                        Arn: functionArn
                    }
                ]
            };
            await this.eventsApi.putTargets(ruleTargetRequest).promise();
        } catch (e) {
            console.log('accociateLambdaToScheduler failed.');
            throw e;
        }
    }

}
export default LambdaBuilder;