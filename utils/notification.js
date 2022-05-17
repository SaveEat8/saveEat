let apn = require("apn"),
    options, connection, notification;
let FCM = require('fcm-node');
let serverKey = 'AAAAdemrLmY:APA91bH0wKigaDp6urXR9mBIR33QLNCnIo3k4DvXCwRBoGJrhUyFLftQ7c0i47bMrUx_45Gm52oCnYzuJarUjCV6Opa3GsN4peoaS8I0J_Hv6kQYEwNdxkozF7aEiNi73hk1Tn9aypRA';
let fcm = new FCM(serverKey);
const accountSid = 'ACb4a3f5ab788a7c13ebde2ea1f6b47650';
const authToken = '38c68f002a896982c2bda80cba3e22c2';
const client = require('twilio')(accountSid, authToken);

//==============================Send Text msg========================================//

exports.sendText = (number, text, callback) => {
    console.log(number, "====>>>", number)
    client.messages
        .create({
            to: number,
            from: "+12056495523",
            body: text,
        })
        .then((message) => {
            console.log("space", message.sid)
            callback(message.sid);
        }, (err) => {
            console.log(err);
            callback(null);
        });
}

//============================Pem push notification==================================//

exports.sendiosNotification = (deviceToken, title, msg, notificationId, badgeCount1, callback) => {

    var options = {
        "cert": "CertificatesVanVuverDriver_7_may.pem",
        "key": "CertificatesVanVuverDriver_7_may.pem",
    };
    var apnProvider = new apn.Provider(options);
    var note = new apn.Notification();
    note.badge = badgeCount1;
    note.sound = msg;
    note.alert = {
        title: title,
        body: msg
    }
    note.payload = { title: title, msg: msg, notificationId: notificationId };
    note.topic = "mobulous.VanvuverDriver1";
    console.log(`Sending: ${note.compile()}`);
    apnProvider.send(note, deviceToken).then((result) => {
        console.log("send driver notification successfully================>", result);
    })
        .catch((e) => {
            console.log("err=======>", e);
        })
};

//============================Notification==========================================//

exports.sendNotificationForAndroid = (deviceToken, title, body, type, data,deviceType, orderType, callback) => {
    console.log("Token is=======>", deviceToken);
    let message={}
    if(deviceType=="Android"){
        message = {
            to: deviceToken,
            data: {
                title: title,
                body: body,
                sound: 'default',
                type: type,
                data: data,
                orderType: orderType
            }
        };
    }
    if(deviceType=="ios"){
        message = {
            to: deviceToken,
            notification: {
                title: title,
                body: body,
                sound: 'default',
                type: type,
                data: data
            },
            data: {
                title: title,
                body: body,
                sound: 'default',
                type: type,
                data: data,
                orderType: orderType
            }
        };
    }
    
    console.log("Message is=========>", message);
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Error in sending notification===========>", err);
        } else {
            console.log('Notification send successfully', response);
        }
    })

}

//====================================Driver notification==============================//

exports.sendNotificationForDriver = (deviceToken, title, body, type, data, callback) => {
    console.log("Token is=======>", deviceToken);
    var message = {
        to: deviceToken,
        data: {
            title: title,
            body: body,
            sound: 'default',
            type: type,
            data: data
        }
    };
    console.log("Message is=========>", message);
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Error in sending notification===========>", err);
        } else {
            console.log('Notification send successfully', response);
        }
    })

}

//=============================Web notification=====================================//

exports.sendNotificationForWeb = (deviceToken, title, body, type, serviceType, orderId, orderData, callback) => {
    let FCM = require('fcm-node');
    let serverKey = 'AAAAQwG4d7c:APA91bERwsQOmiyo7pDcVyn1ozMagGMK-Q-rBTutMe5kK6scO_wDBreIcIchqMpx2lUxG0J99UBTDQ_gC-bwOS-hqEub8btdACHcpULZ3AMRE0EjPNf3usY_TvP4KaYvTuABG-QfP27W';
    let fcm = new FCM(serverKey);
    console.log("Token is=======>", deviceToken);
    var message = {
        to: deviceToken,
        notification: {
            title: title,
            body: body
        },
        data: {
            notiType: type,
            serviceType: serviceType,
            orderId: orderId,
            orderData: orderData
        }
    };
    console.log("Message is=========>", message);
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Error in sending notification===========>", err);
        } else {
            console.log('Notification send successfully', response);
        }
    })

}