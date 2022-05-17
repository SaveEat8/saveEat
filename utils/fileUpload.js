const fs = require('fs');
var AWS = require('aws-sdk');
AWS.config = {
    "accessKeyId": 'AKIA3PUIPRVWYPDGTGNL',
    "secretAccessKey": '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',
    "region": 'ap-south-1',

};
const s3 = new AWS.S3({ region: 'ap-south-1' })
const BucketName = 'saveeatdev'


exports.upload = (file, path) => {

    return new Promise((resolve, reject) => {
        var tmp_path = file.path;
        image = fs.createReadStream(tmp_path);
        imageName = file.name;
        const params = {
            Bucket: BucketName,
            Key: imageName,
            ACL: 'public-read',
            Body: image,
            ContentType: file.type
        };
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        })
    })
}

exports.uploadBase = (file, path) => {

    return new Promise((resolve, reject) => {

        let date=new Date().getTime()
        buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Bucket: BucketName,
            Key:(date).toString(),
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        };
        s3.upload(data, function (err, data) {

            if (err) {
                reject(err);
            } else {
                resolve(data.Location);

                console.log('successfully uploaded the image!',data.Location);
            }
        });
    })
}

exports.deleteImage = (file) => {

    return new Promise((resolve, reject) => {
        let newImage = file.split('https://wow-won-images.s3.us-west-2.amazonaws.com/')[1]
        s3.deleteObject({
            Bucket: BucketName,
            Key: newImage
        }, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}






