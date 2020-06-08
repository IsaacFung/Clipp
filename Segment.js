import * as Segment from 'expo-analytics-segment';

// { androidWriteKey, iosWriteKey }
let androidWriteKey = 'ydNclVQJES7PZiXn80q1C3OWeIwwXC7m';
let iosWriteKey = 'cQCtCVTIOSck7E2uiwnJbVCtAWYCZPq1';
Segment.initialize({ androidWriteKey, iosWriteKey });
export default Segment;
