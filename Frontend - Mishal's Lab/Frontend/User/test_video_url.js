const https = require('https');
https.get('https://uqkqewydjbqqiuezxnqk.supabase.co/storage/v1/object/public/Interview_Resumes/video_254f9f4b-b42a-4bbf-a715-406051768412_1772472497217.webm', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});
