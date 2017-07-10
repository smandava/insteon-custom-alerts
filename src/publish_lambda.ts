import LambdaBuilder from './lambda-builder';

async function publish() {
    let builder = new LambdaBuilder();

    let functionExists = await builder.functionExists();
    if (functionExists) {
        console.log('Function already exists, deleting..');
        builder.deleteFunction();
    }

    let cloudWatchRuleExists = await builder.cloudWatchRuleExists();

    if (cloudWatchRuleExists) {
        console.log('CloudWatch Rule exists, deleting..');
        await builder.deleteCloudWatchRule();
    }

    let functionArn = await builder.setupFunction();
    let ruleArn = await builder.setupCloudwatchRule();

    await builder.accociateLambdaToScheduler(ruleArn, functionArn);
    console.log('Done');
}

publish();