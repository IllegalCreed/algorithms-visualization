import { bucketSortModule } from '@/algorithms/bucket-sort.module';
import { createEnglishAdapter } from '../shared';

export const englishBucketSortModule = createEnglishAdapter(bucketSortModule, {
  title: 'Bucket Sort',
  captions: {
    distribute: 'Place the highlighted value into the bucket covering its numeric range.',
    sortBucket: 'Sort the values inside this bucket independently.',
    concat: 'Append the next value from this ordered bucket to the output array.',
    done: 'All buckets have been concatenated in range order.',
  },
});
