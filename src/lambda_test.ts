import {Context} from '@types/aws-lambda';
import {handler} from './app';

// Set the region to the locations of the S3 buckets
// process.env['AWS_REGION'] = 'us-west-2';

type Partial<T> = {
    [P in keyof T]?: T[P];
};

type PartialContext = Partial<Context>;

class FakeContext implements PartialContext {
    done() {
    console.log('Lambda Function Complete');
    }
}

handler(null, new FakeContext());
