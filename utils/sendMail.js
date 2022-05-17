let nodemailer = require('nodemailer')
let smtpTransport = require('nodemailer-smtp-transport');

// var realEmail = 'noreply.unodogs@gmail.com'
// var realPassword = 'Angel@3011'

var realEmail = 'noreply@saveeat.in'
var realPassword = 'PcASMyWVpt2V'

//==================================Contact Us Template=============================//

exports.sendHtmlEmail3 = (email, subject, message, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Food App'
    copyrightMessage = "© Food"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                <tr style="margin:0;padding:0">
                                <td style="text-align:center; padding: 10px;">
                                    <img src="${imageLogo}" alt="kryptoro" width="100" class="">
                                </td>
                            </tr>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    <tr style="margin:0;padding:0">
                                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                                    <img src="https://res.cloudinary.com/a2karya80559188/image/upload/v1622111346/1024_apaocb.png" style="width:169px;" alt="Email register" class="">
                                                </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:26px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h4>${message}</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })


}

//==================================Admin Forgot Password===========================//

exports.sendHtmlEmail = (email, subject, message, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Food App'
    copyrightMessage = "© Food"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                <tr style="margin:0;padding:0">
                                <td style="text-align:center; padding: 10px;">
                                    <img src="${imageLogo}" alt="kryptoro" width="100" class="">
                                </td>
                            </tr>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    <tr style="margin:0;padding:0">
                                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                                    <img src="https://res.cloudinary.com/a2karya80559188/image/upload/v1622111346/1024_apaocb.png" style="width:169px;" alt="Email register" class="">
                                                </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:26px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h3>New Password</h3></p>
                                            <p style="margin:0 30px;color:#3a4161"><h4>${message}</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h5>Please reset your password immediately. Do not share your password with anyone.</h5></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h4>Use this password for further login process. This is system generated mail. Do not reply. </h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })

}

//=================================Admin reset link================================//

exports.sendHtmlEmail1 = (email, subject, name, link, callback) => {
    let HTML;
    HTML = `<!DOCTYPE html>
    <html>
    <head>
        <title>Email Verfication</title>
        <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,400,500,600,700,800,900&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0;">
        <div style="font-family: 'Poppins', sans-serif; background-color: #f3f3f3;">
            <div style=" max-width: 600px; margin: auto; width: 100%; padding: 20px 0;">
                <div style="background-color: #fff; padding: 10px; border: 1px solid #ddd;">
                    <figure style=" margin: -10px -10px 20px; background-color: #6b388e; text-align: center; padding: 15px 0;">
                        <img src="http://mobulous.co.in/Likewise/Logo.png" width="190px">
                    </figure>
                    <h3 style=" background-color: #6b388e; text-align: center; padding: 10px 0; margin: -10px -10px; color: #fff; font-weight: 500; font-size: 20px; display: none;">
                        Welcome to Likewise
                    </h3>
    
                    <h4 style="margin: 0 0 10px; color: #000; font-weight: 600; font-size: 22px;  padding: 0 20px;">
                        Hello, ${name}
                    </h4>
                    <p style=" margin: 0 0 30px; font-size: 15px; color: #545454; font-weight: 500; padding: 0 20px;">
                Change the password of your LikeWise account
                </p>
    
                    <figure style="text-align: center;">
                        <img src="http://mobulous.co.in/Likewise/Icon.png" width="190px">
                    </figure>
    
                    <p style="margin: 0 0 20px; text-align: center;">
                        <a href="${link}" target="_blank" style=" background-color: #6b388e; color: #fff; padding: 10px 120px; display: inline-block; border-radius: 5px; text-decoration: none; font-size: 17px; text-transform: capitalize;">
                        Change your password
                        </a>
                    </p>
    
                    <p style="margin: 0 0 10px; text-align: center; font-size: 15px; color: #545454; font-weight: 500;">Or Copy this link and paste in your browser</p>
                    <p style="font-size: 15px; font-weight: 500; text-align: center; margin: 0 0 20px; padding: 0 50px;">
                        <a href="javascript:void(0);" style="word-break: break-all; color: #1076ce; ">
                            ${link}
                        </a>
                    </p>
                </div>	
    
                <div style="background-color: #fff; padding: 10px; border: 1px solid #ddd; margin: 20px 0 0 0; text-align: center;">
                    <h4 style="margin: 0 0 10px; color: #000; font-weight: 600; font-size: 22px;  padding: 0;" >
                        Need Help?
                    </h4>
    
                    <h5 style="font-size: 15px; color: #545454; font-weight: 500; margin: 0 0 10px;" >
                    Please send your feedback or bugs report to: support@likewise.chat
                    </h5>
    
                    <h5 style="font-size: 15px; color: #545454; font-weight: 500; margin: 0 0 15px;" >
                        to <a style="" href="mailto:support@likewise.com">support@likewise.com</a>
                    </h5>

                </div>
            </div>
            <div style="clear: both"> </div>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    })
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: link,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        if (err) {
            console.log(err);
        } else if (info) {
            console.log(info);
        }
    })
}

//===================================Forgot Password Otp============================//

exports.sendOtp = (email, subject, otp, sms, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Bite.Me'
    copyrightMessage = "© Bite.Me"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                <tr style="margin:0;padding:0">
                                <td style="text-align:center; padding: 10px;">
                                    <img src="${imageLogo}" alt="kryptoro" width="100" class="">
                                </td>
                            </tr>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    <tr style="margin:0;padding:0">
                                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                                    <img src="https://res.cloudinary.com/a2karya80559188/image/upload/v1622111346/1024_apaocb.png" style="width:169px;" alt="Email register" class="">
                                                </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:25px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                    <p style="margin:0 30px;color:#3a4161"><h4 style=" margin: 5px;"> We have sent you this mail in response to your request to login to your admin account.</h4></p>
                                        <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:15px;line-height:15px;color:#272c73!important;font-weight:600;margin-bottom:12px">${otp}</p>
                                    </td>
                                </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                        <p style="margin:0 30px;color:#3a4161">If you have not made this request, please ignore this mail or contact our support team.</h4></p>
                                            <p style="margin:0 30px;color:#3a4161"><h4  style=" margin: 5px;">${sms}</h4></p>
                                            <p style="margin:0 30px;color:#3a4161;text-align:center"><h4  style=" margin: 5px;">Please contact@biteme.com for any queries regarding this.</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr>
                                    <td align="left" bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;font-weight:bold;line-height:20px;color:#000; padding:0 20px">
                                    Best regards, <br>
                                        Team Bite.Me.
                                    </td>
                                </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: sms,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })


}

//===================================Send Mail to owner=============================//

exports.sendMailToOwner = (email, subject, sms, comment, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Food App'
    copyrightMessage = "© Food"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                <tr style="margin:0;padding:0">
                                <td style="text-align:center; padding: 10px;">
                                    <img src="${imageLogo}" alt="kryptoro" width="100" class="">
                                </td>
                            </tr>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    <tr style="margin:0;padding:0">
                                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                                    <img src="https://res.cloudinary.com/a2karya80559188/image/upload/v1622111346/1024_apaocb.png" style="width:169px;" alt="Email register" class="">
                                                </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:26px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h4>${sms}</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                    <p style="margin:0 30px;color:#3a4161"><h4>${comment}</h4></p>
                                    </td>
                                </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;font-weight:bold;line-height:20px;color:#000; padding:0 20px">
                                        Best regards, <br>
                                            Team Just Clubbing App.
                                        </td>
                                    </tr>

                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    })
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: sms,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            console.log("error", err);
        } else if (info) {
            console.log("infor", info)

        }
    })


}

//====================================Signup Otp===================================//

exports.sendSignupOtp = (email, subject, otp, sms, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Save Eat'
    copyrightMessage = "© Save Eat"
    HTML = `<!DOCTYPE html>
    <html lang="en-us">
    
    <head>
        <title>Save Eat</title>
        <meta charset="UTF-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    
            body {
                margin: 0;
                font-family: 'Arial';
                font-size: 14px;
            }
    
            * {
                box-sizing: border-box;
            }
        </style>
    </head>
    
    <body>
    
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin:auto;">
            <tr>
                <td style="background: #F5F5F5;padding:10px;">
    
                    <table cellspacing="0" cellpadding="0" border="0"
                        style="width: 100%; margin:auto; background-color: #fff; padding: 10px; border-radius: 10px; ">
                        <tr>
                            <td>
                                <table style="width: 100%; border-radius: 10px; overflow: hidden;">
                                    <tr>
                                        <td colspan="2" style="border-bottom:1px solid #ddd; padding:10px 0 15px 0;">
                                            <span style="display: block; width: 200px; margin: auto;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/Logo.png" style="width:100%">
                                            </span>
                                        </td>
                                    </tr>
    
    
                                    <tr>
                                        <td colspan="2">
                                            <h2 style="font-weight: 600;color:#ffc768;font-size: 24px;text-align: center;">
                                                Welcome to Save Eat App</h2>
                                        </td>
                                    </tr>
                       
    
                                    <tr>
                                        <td colspan="2" style="padding: 25px 0px;">
                                            <p style="font-weight: 500;color: #000;font-size:15px;line-height: 22px;">${otp} This
                                                is your one time password for new signup.</p>
                                        
                                            <p style="font-weight: 500;color: #000;font-size:16px;line-height: 22px;"> <b style="color: #ffc768;">${sms}</b></p>
                                            <p style="font-weight: 500;color: #000;font-size:15px;line-height: 22px;">Please do not share with anyone.</p>
                                            <p style="font-weight: 500;color: #000;font-size:15px;line-height: 22px;">Please contact <b><a href="mailto:contact@saveeat.com" style="color: #000;">contact@saveeat.com</a></b> for any queries regarding this.</p>
                                         
                                            <span style="display: inline-block;text-align: left;margin-top: 25px;">
                                                <h3
                                                    style="margin:0;font-weight: 600;color: #000;font-size:15px;line-height: 22px;text-align: center;">
                                                    Best Regards,</h3>
                                                <h3
                                                    style="margin:0;font-weight: 600;color: #000;font-size:15px;line-height: 22px;text-align: center;margin-top: 8px;">
                                                    Team SaveEat</h3>
                                            </span>
                                        </td>
                                    </tr>
    
    
    
    
    
                                    <tr>
                                        <td colspan="2" style="text-align: center; padding:40px 0 0">
                                            <p style="margin:0 0 30px; font-size: 20px; font-weight: 600; color: #000; ">
                                                <span>Stay Connected</span>
                                            </p>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/facebook.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/insta.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/twiitter.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/yooutube.png" style="max-width: 40px;">
                                            </a>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="height: 100px;">
    
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2"
                                            style="background-color: #f3f3f3; padding:20px 0px;border-radius: 5px;">
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;">
                                                <span>©2021-SaveEat. All rights reserved.</span>
                                            </p>
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;">
                                                <span>Mumbai I Estd. 2021</span>
                                            </p>
                                        </td>
                                    </tr>
    
                                </table>
                            </td>
                        </tr>
                    </table>
    
                </td>
            </tr>
        </table>
    
    </body>
    
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: sms,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })


}

//====================================Forgot otp====================================//

exports.sendForgotOtp = (email, subject, otp, sms, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Save Eat'
    copyrightMessage = "© Save Eat"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:25px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                    <p style="margin:0 30px;color:#3a4161"><h4>This is your one time password for forgot password.</h4></p>
                                        <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:15px;line-height:15px;color:#272c73!important;font-weight:600;margin-bottom:12px">${otp}</p>
                                    </td>
                                </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h4>${sms}</h4></p>
                                            <p style="margin:0 30px;color:#3a4161;text-align:center"><h4>Please contact contact@saveeat.com for any queries regarding this.</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>

                                    <tr>
                                    <td align="left" bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;font-weight:bold;line-height:20px;color:#000; padding:0 20px">
                                    Best regards, <br>
                                        Team Save Eat.
                                    </td>
                                </tr>
                                
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: sms,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })


}

exports.sendForgotOtp1 = (email, subject, otp, sms, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Save Eat'
    copyrightMessage = "© Save Eat"
    HTML = `<!DOCTYPE html>
    <html lang="en-us">
    
    <head>
        <title>Save Eat</title>
        <meta charset="UTF-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    
            body {
                margin: 0;
                font-family: 'Arial';
                font-size: 14px;
            }
    
            * {
                box-sizing: border-box;
            }
        </style>
    </head>
    
    <body>
    
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin:auto;">
            <tr>
                <td style="background: #F5F5F5;padding:10px;">
    
                    <table cellspacing="0" cellpadding="0" border="0"
                        style="width: 100%; margin:auto; background-color: #fff; padding: 10px; border-radius: 10px; ">
                        <tr>
                            <td>
                                <table style="width: 100%; border-radius: 10px; overflow: hidden;">
                                    <tr>
                                        <td colspan="2" style="border-bottom:1px solid #ddd; padding:10px 0 15px 0;">
                                            <span style="display: block; width: 200px; margin: auto;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/Logo.png" style="width:100%">
                                            </span>
                                        </td>
                                    </tr>
    
    
                                    <tr>
                                        <td colspan="2">
                                            <h2 style="font-weight: 600;color:#ffc768;font-size: 24px;text-align: center;">
                                                Welcome to Save Eat App</h2>
                                        </td>
                                    </tr>
                       
    
                                    <tr>
                                        <td colspan="2" style="padding: 25px 0px;">
                                            <p style="font-weight: 500;color: #000;font-size:15px;line-height: 22px;">${otp} This
                                                is your one time password for forgot password.</p>
                                        
                                            <p style="font-weight: 500;color: #000;font-size:16px;line-height: 22px;"> <b style="color: #ffc768;">${sms}</b></p>
                                            <p style="font-weight: 500;color: #000;font-size:15px;line-height: 22px;">Please do not share with anyone.</p>
                                            <p style="font-weight: 500;color: #000;font-size:15px;line-height: 22px;">Please contact <b><a href="mailto:contact@saveeat.com" style="color: #000;">contact@saveeat.com</a></b> for any queries regarding this.</p>
                                         
                                            <span style="display: inline-block;text-align: left;margin-top: 25px;">
                                                <h3
                                                    style="margin:0;font-weight: 600;color: #000;font-size:15px;line-height: 22px;text-align: center;">
                                                    Best Regards,</h3>
                                                <h3
                                                    style="margin:0;font-weight: 600;color: #000;font-size:15px;line-height: 22px;text-align: center;margin-top: 8px;">
                                                    Team SaveEat</h3>
                                            </span>
                                        </td>
                                    </tr>
    
    
    
    
    
                                    <tr>
                                        <td colspan="2" style="text-align: center; padding:40px 0 0">
                                            <p style="margin:0 0 30px; font-size: 20px; font-weight: 600; color: #000; ">
                                                <span>Stay Connected</span>
                                            </p>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/facebook.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/insta.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/twiitter.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);"
                                                style="display: inline-block; margin: 0 10px;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/yooutube.png" style="max-width: 40px;">
                                            </a>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="height: 100px;">
    
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2"
                                            style="background-color: #f3f3f3; padding:20px 0px;border-radius: 5px;">
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;">
                                                <span>©2021-SaveEat. All rights reserved.</span>
                                            </p>
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;">
                                                <span>Mumbai I Estd. 2021</span>
                                            </p>
                                        </td>
                                    </tr>
    
                                </table>
                            </td>
                        </tr>
                    </table>
    
                </td>
            </tr>
        </table>
    
    </body>
    
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: sms,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })


}

//====================================Email otp====================================//

exports.sendEmailForChangeEmail = (email, subject, otp, sms, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Save Eat'
    copyrightMessage = "© Save Eat"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    <tr style="margin:0;padding:0">
                                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                                    <img src="https://res.cloudinary.com/a2karya80559188/image/upload/v1622111346/1024_apaocb.png" style="width:169px;" alt="Email register" class="">
                                                </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:25px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                    <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                    <p style="margin:0 30px;color:#3a4161"><h4>This is your one time password for change email.</h4></p>
                                        <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:15px;line-height:15px;color:#272c73!important;font-weight:600;margin-bottom:12px">${otp}</p>
                                    </td>
                                </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h4>${sms}</h4></p>
                                            <p style="margin:0 30px;color:#3a4161;text-align:center"><h4>Please contact contact@saveeat.com for any queries regarding this.</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>

                                    <tr>
                                    <td align="left" bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;font-weight:bold;line-height:20px;color:#000; padding:0 20px">
                                    Best regards, <br>
                                        Team Save Eat.
                                    </td>
                                </tr>
                                
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: sms,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })


}

//====================================Verify Email=================================//

exports.sendMailVerification = (email, name, subject, link, callback) => {
    let html = `<html lang="en">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="">
      <meta name="author" content="">
      <title>Vendor & Users</title>
    </head>
    <body style="margin: 0px; padding: 0px; background-color: #eeeeee;">
      <div style="width:600px; margin:20px auto; background:#fff; font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
    <div>
        <table style="width: 100%; border: 1px solid #ccc;" cellpadding="0" cellspacing="0">
          <tbody>
          <tr style="margin:0;padding:0">
          <td bgcolor="#f1f1f1" height="100" style="text-align:center;background:#f1f1f1">
              <img src="https://res.cloudinary.com/a2karya80559188/image/upload/v1622111346/1024_apaocb.png" alt="Email register" class="" style="height: 115px;
    width: 177px;">
          </td>
      </tr>
              <tr>
                <td style="padding: 50px 15px 10px;">Dear ${name}, </td>
              </tr>
              <tr>
              <td style="padding: 10px 15px 10px;">You recently requested to reset your password for your account. Use the button below to reset it. Thank you for using Bite.Me App.</td>
            </tr>
            
              <tr>
              <td><p><a style="display: block; background: #4E9CAF; text-align: center; border-radius: 5px; color: white; font-weight: bold;" href=` + link + `>Reset Password</a></p></td>
              </tr>  
              <tr>
               <td style="padding: 10px 15px 10px;">If you did not requested to password reset, please ignore this mail or report to foodapp@contact.com if you have any query.
               </td>
              </tr>      
              <tr>
                <td style="padding: 25px 15px 20px;">
                  Thanks &amp; Regards <br> Team Bite.me
                  </td>
             </tr>
             <tr>
             <td style="text-align: center; padding: 20px; background-color: #4e555a; color: #eeeeee;">2021 copyright @ Bite.me, All rights  reserved </td>
           </tr>
          </tbody>
        </table>
        </div>
      </div>
    </body>
   </html>`
    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        html: html,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })
}

//====================================Account verification status===================//

exports.sendAccountVerificationStatus = (email, subject, sms, message, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/a2karya80559188/image/upload/v1591876980/Logo_02_1_zmqflr.png";
    welcomeMessage = message,
        copyrightMessage = "© Bite.me"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                <tr style="margin:0;padding:0">
                                <td style="text-align:center; padding: 10px;">
                                </td>
                            </tr>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                                            <img src="https://res.cloudinary.com/a2karya80559188/image/upload/v1622111346/1024_apaocb.png" style="width:169px;" alt="Email register" class="">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:26px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h4>${sms}</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr>
                                    <td align="left" bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;font-weight:bold;line-height:20px;color:#000; padding:0 20px">
                                    Best regards, <br>
                                        Team Bite.me.
                                    </td>
                                </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    })
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: sms,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            console.log("error", err);
        } else if (info) {
            console.log("infor", info)

        }
    })


}

//=====================================Send Credentials=============================//

exports.sendCredentialsHtmlEmail = (email, subject, clientEmail, clientUsername, clientPassword, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/a2karya80559188/image/upload/v1585374071/1.0Splash_t9wzkh.png";
    welcomeMessage = 'Welcome to Save Eat App'
    copyrightMessage = "© Save Eat"
    HTML = `<!DOCTYPE html>
    <html lang="en-us">
    <head>
        <title>Save Eat</title>
        <meta charset="UTF-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />  
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
            body{ margin: 0; font-family: 'Arial'; font-size: 14px; } 
            *{ box-sizing: border-box;} 
        </style>
    </head>
    <body>
    
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin:auto;">
            <tr>
                <td style="background: #F5F5F5;padding:10px;">
    
                    <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin:auto; background-color: #fff; padding: 10px; border-radius: 10px; ">
                        <tr>
                            <td>
                                <table style="width: 100%; border-radius: 10px; overflow: hidden;">
                                    <tr>
                                        <td colspan="2" style="border-bottom:1px solid #ddd; padding:10px 0 15px 0;">
                                            <span style="display: block; width: 200px; margin: auto;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/Logo.png" style="width:100%">   
                                            </span>
                                        </td> 
                                    </tr>
                             
    
                           <tr>
                               <td colspan="2">
                                  <h2 style="font-weight: 600;color:#ffc768;font-size: 24px;text-align: center;">Welcome to Save Eat App</h2>
                               </td>
                           </tr>
    <tr>
        <td  colspan="2">
            <p style="margin-bottom: 15px;"><span style="font-weight: 600;font-size: 16px;display: inline-block;">Email : </span><span style="font-weight: 400;font-size: 16px;display: inline-block;"> ${clientEmail}
            <p style="margin-bottom: 15px;"><span style="font-weight: 600;font-size: 16px;display: inline-block;">Name : </span><span style="font-weight: 400;font-size: 16px;display: inline-block;"> ${clientUsername}</span></p>
            <p style="margin-bottom: 15px;"><span style="font-weight: 600;font-size: 16px;display: inline-block;">Password : </span><span style="font-weight: 400;font-size: 16px;display: inline-block;"> ${clientPassword}</span></p>
      
        </td>
    </tr>
                     
    <tr>
        <td colspan="2" style="padding: 25px 0px;">
            <p style="font-weight: 500;color: #000;font-size:15px;line-height: 22px;">This is your login credentials. Do not share your password with anyone.</p>
            <p style="font-weight: 500;color: #000;font-size:16px;line-height: 22px;">Use this password for futher login process. This is system generated mail. Do not reply.</p>
            <p style="font-weight: 500;color: #000;font-size:16px;line-height: 22px;">Please contact at <b>contact@saveeat.com</b> for any queries regarding this.</p>
       <span style="display: inline-block;text-align: left;margin-top: 25px;">
    <h3 style="margin:0;font-weight: 600;color: #000;font-size:15px;line-height: 22px;text-align: center;">Best Regards,</h3>
    <h3 style="margin:0;font-weight: 600;color: #000;font-size:15px;line-height: 22px;text-align: center;margin-top: 8px;">Team SaveEat</h3>
    </span>
        </td>
    </tr>
                               
    
                           
    
                             
                                    <tr>
                                        <td colspan="2" style="text-align: center; padding:40px 0 0">
                                            <p style="margin:0 0 30px; font-size: 20px; font-weight: 600; color: #000; ">
                                                <span>Stay Connected</span>
                                            </p>
                                            <a target="_blank" href="javascript:void(0);" style="display: inline-block; margin: 0 10px;">
                                                <img src="https://www.saveeat.in/contact/facebook.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);" style="display: inline-block; margin: 0 10px;">
                                                <img src="https://www.saveeat.in/contact/insta.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);" style="display: inline-block; margin: 0 10px;">
                                                <img src="https://www.saveeat.in/contact/twiitter.png" style="max-width: 40px;">
                                            </a>
                                            <a target="_blank" href="javascript:void(0);" style="display: inline-block; margin: 0 10px;">
                                                <img src="https://www.saveeat.in/contact/yooutube.png" style="max-width: 40px;">
                                            </a> 
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="height: 100px;">
    
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="background-color: #f3f3f3; padding:20px 0px;border-radius: 5px;">
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;">
                                                <span>©2021-SaveEat. All rights reserved.</span>
                                            </p>
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;">
                                                <span>Mumbai I  Estd. 2021</span>
                                            </p> 
                                        </td>
                                    </tr>
    
                                </table>
                            </td>
                        </tr>
                    </table>
    
                </td>
            </tr>
        </table>
    
    </body>
    </html>`

    transporter = nodemailer.createTransport({
         // service: 'zoho',
         host: 'smtp.zoho.in',
         port: 465,
         // secure: true,
         auth: {
             user: realEmail,
             pass: realPassword
         }
    })
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            console.log("error", err);
        } else if (info) {
            console.log("infor", info)

        }
    })

}

//===================================Order Invoice===============================//

exports.orderInvoice = (email, subject, emailData, newOrderData, status, createdAt, address, callback) => {


    let invoiceArray = JSON.parse(newOrderData)
    let dyanmicdata = ''
    for (let j = 0; j < invoiceArray.length; j++) {
        let toppings = ''
        if (invoiceArray[j].extra.length > 0) {
            for (let z = 0; z < invoiceArray[j].extra.length; z++) {
                toppings += ` <tr>
                <td colspan="3">
                    <table style="width:100%">
                        <tr>
                            <td style="padding:10px 20px 10px 40px; font-family:'Open Sans',Open Sans,Verdana,sans-serif; text-align: left;">
                                <span>${invoiceArray[j].extra[z].name}</span>
                            </td>
                            <td style="padding:10px 20px; text-align: center; font-family:'Open Sans',Open Sans,Verdana,sans-serif; width: 100px;">
                                <span>1</span>
                            </td>
                            <td style="padding:10px 20px; text-align: right; font-family:'Open Sans',Open Sans,Verdana,sans-serif; width: 100px;">
                                <span>₹ ${invoiceArray[j].extra[z].price}</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`
            }
        }

        dyanmicdata += `<tbody style="border-bottom: 1px solid #ddd;">
        <tr style="background-color:#f9f9f9">
            <td style="padding:12px 20px; font-family:'Open Sans',Open Sans,Verdana,sans-serif; text-align: left;">
                <span>${invoiceArray[j].productData.foodName}</span>
            </td>
            <td style="padding:12px 20px; font-family:'Open Sans',Open Sans,Verdana,sans-serif; text-align: center; width: 100px;">
                <span>${invoiceArray[j].quantity}</span>
            </td>
            <td style="padding:12px 20px; font-family:'Open Sans',Open Sans,Verdana,sans-serif; text-align: right; width: 100px;">
                <span>₹ ${invoiceArray[j].productAmount}</span>
            </td>
        </tr>
        ${toppings}
       
    </tbody>`
    }
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://res.cloudinary.com/boss8055/image/upload/v1579161632/1024x1024.png";
    welcomeMessage = 'Welcome to Save Eat'
    copyrightMessage = "© Save Eat"
    HTML = `<!DOCTYPE html>
    <html lang="en-us">
    <head>
        <title>Save Eat</title>
        <meta charset="UTF-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />  
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
            body{ margin: 0; font-family: 'Roboto'; font-size: 14px; } 
            *{ box-sizing: border-box; font-family: 'Roboto';} 
        </style>
    </head>
    <body>
    
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin:auto;">
            <tr>
                <td style="background: #F5F5F5;padding:10px;">
    
                    <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin:auto; background-color: #fff; padding: 10px; border-radius: 10px; ">
                        <tr>
                            <td>
                                <table style="width: 100%; border-radius: 10px; overflow: hidden;">
                                    <tr>
                                        <td colspan="2" style="text-align:center; border-bottom:1px solid #ddd; padding:10px 0 15px 0;">
                                            <span style="display: inline-block; width: 200px; margin: auto;">
                                                <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/Logo.png" style="width:100%">   
                                            </span>
                                        </td> 
                                    </tr>
                                    <tr> 
                                        <td colspan="2" style="padding:15px 0 30px 0">
                                            <p style="margin: 0; line-height: 30px; font-family:'Open Sans',Open Sans,Verdana,sans-serif;">Greetings from SaveEat!</p>
    
                                            <p style="margin: 0; line-height: 30px; font-family:'Open Sans',Open Sans,Verdana,sans-serif;">Great work!. Your order was completed and you saved ${emailData.rescusedFood}kg(s) of food. </p>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td>
                                            <p style="margin:0 0 5px 0 ; font-weight: 600; font-size: 15px;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>Order No : <span>
                                            </p>
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>${emailData.orderNumber} <span>
                                            </p>
                                        </td>
                                        <td>
                                            <p style="margin:0 0 5px 0 ; font-weight: 600; font-size: 15px;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>Restaurant : <span>
                                            </p>
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>${emailData.businessName} <span>
                                            </p>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="padding:30px 0 0 0">
                                            <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif; margin:0 0 10px 0">
                                                <span>Your Order Summary</span> 
                                            </p>
    
                                            <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif; margin:0 0 10px 0">
                                                <span>Order No : </span>
                                                <strong>${emailData.orderNumber}</strong>
                                            </p>
    
                                            <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif; margin:0 0 10px 0">
                                                <span>Order placed at : </span>
                                                <strong>${createdAt}</strong>
                                            </p>
    
                                            <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif; margin:0 0 10px 0">
                                                <span>Order delivered at : </span>
                                                <strong>${emailData.orderDeliveredTime}</strong>
                                            </p>
    
                                            <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif; margin:0 0 10px 0">
                                                <span>Order Status : </span>
                                                <strong>${status}</strong>
                                            </p>
    
                                            <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif; margin:0 0 10px 0">
                                                <span>Ordered from : </span>
                                                <strong>${emailData.businessName}</strong>
                                            </p>
    
                                            <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif; margin:0 0 20px 0">
                                                <span>${address}</span>
                                            </p>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2">
                                            <table style="width: 100%; ">
                                                <thead>
                                                    <tr>
                                                        <th style="background-color: #e5e5e5; padding:12px 20px; font-family:'Open Sans',Open Sans,Verdana,sans-serif; text-align: left;">
                                                            <span>Item Name</span>
                                                        </th>
                                                        <th style="background-color: #e5e5e5; padding:12px 20px; font-family:'Open Sans',Open Sans,Verdana,sans-serif; text-align: center; width:100px;">
                                                            <span>Quantity</span>
                                                        </th>
                                                        <th style="background-color: #e5e5e5; padding:12px 20px; font-family:'Open Sans',Open Sans,Verdana,sans-serif; text-align: right; width:100px;">
                                                            <span>Price</span>
                                                        </th>
                                                    </tr>
                                                </thead>

                                                
                                                ${dyanmicdata}

                                                <tfoot style="text-align:right">
                                                    <tr>
                                                        <td colspan="3">
                                                            <p style="margin:0; padding: 10px 20px; font-weight: 500; display: block;">
                                                                <label style="min-width: 200px; text-align: left; display:inline-block;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">Sub Total : </label>
                                                                <span style="min-width: 100px; text-align: right; display:inline-block; font-family:'Open Sans',Open Sans,Verdana,sans-serif;" >₹ ${emailData.subTotal}</span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="3">
                                                            <p style="margin:0; padding: 10px 20px; font-weight: 500; display: block;">
                                                                <label style="min-width: 200px; text-align: left; display:inline-block;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">SaveEat Fee : </label>
                                                                <span style="min-width: 100px; text-align: right; display:inline-block; font-family:'Open Sans',Open Sans,Verdana,sans-serif;" >₹ ${emailData.saveEatFees}</span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="3">
                                                            <p style="margin:0; padding: 10px 20px; font-weight: 500; display: block;">
                                                                <label style="min-width: 200px; text-align: left; display:inline-block;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">Taxes : </label>
                                                                <span style="min-width: 100px; text-align: right; display:inline-block; font-family:'Open Sans',Open Sans,Verdana,sans-serif;" >₹ ${emailData.taxes}</span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr> 
                                                        <td colspan="3">
                                                            <p style="margin:0; padding: 10px 20px; font-weight: 500; display: block; background-color:#f3f3f3">
                                                                <label style="min-width: 200px; text-align: left; color: #ffb266; display:inline-block;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                                    Order Total
                                                                </label>
                                                                <span style="min-width: 100px; text-align: right; display:inline-block; font-family:'Open Sans',Open Sans,Verdana,sans-serif; color: #ffb266;">
                                                                    ₹ ${emailData.total} 
                                                                </span>
                                                            </p> 
                                                        </td> 
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="border-top: 1px solid #ddd;border-bottom: 1px solid #ddd;">
                                            <p style="text-align: center; margin: 0; padding:15px 0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>Amazing! You saved 
                                                    <strong style="color:#00cc00">₹ ${emailData.saveAmount}</strong> 
                                                    on this order and saved food as well. 
                                                </span>
                                            </p>
                                        </td>    
                                    </tr> 
    
                                    <tr>
                                        <td colspan="2" style="border-bottom: 1px solid #ddd; padding:15px 0">
                                            <p style="text-align: center; line-height: 25px; font-size: 14px;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>Disclaimer- This is an acknowledgement of Delivery of the Order and not an actual invoice. Details mentioned above including the menu prices and taxes (as applicable) are as provided by the Restaurant to SaveEat. Responsibility of charging (or not charging) taxes lies with the Restaurant and SaveEatdisclaims any liability that may arise in this respect.</span>
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                    <td colspan="2" style="text-align: center; padding:40px 0 0">
                                        <p style="margin:0 0 30px; font-size: 20px; font-weight: 600; color: #000; font-family:'Open Sans',Open Sans,Verdana,sans-serif; ">
                                            <span>Stay Connected</span>
                                        </p>
                                        <a target="_blank" href="https://www.facebook.com/SaveEat-110619234734023" style="display:inline-block; margin: 0 10px;">
                                            <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/facebook.png" style="max-width: 40px; width:40px">
                                        </a>
                                        <a target="_blank" href="https://www.instagram.com/SaveEatIndia/?hl=en" style="display:inline-block; margin: 0 10px;">
                                            <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/insta.png" style="max-width: 40px; width:40px">
                                        </a>
                                        <a target="_blank" href="https://twitter.com/SaveEatIndia" style="display:inline-block; margin: 0 10px;">
                                            <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/twiitter.png" style="max-width: 40px; width:40px">
                                        </a>
                                        <a target="_blank" href="https://www.youtube.com/channel/UC3aZvIGlPYSdvDz-RF--SqA" style="display:inline-block; margin: 0 10px;">
                                            <img src="https://saveeatdev.s3.ap-south-1.amazonaws.com/yooutube.png" style="max-width: 40px; width:40px">
                                        </a> 
                                    </td>
                                </tr>

                                    <tr>
                                        <td colspan="2" style="height: 100px;">
    
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="background-color: #f3f3f3; padding:20px 0px;border-radius: 5px;">
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>©2021-SaveEat. All rights reserved.</span>
                                            </p>
                                            <p style="text-align: center; font-size: 14px; line-height: 30px; margin: 0px;font-family:'Open Sans',Open Sans,Verdana,sans-serif;">
                                                <span>Mumbai I  Estd. 2021</span>
                                            </p> 
                                        </td>
                                    </tr>
    
                                </table>
                            </td>
                        </tr>
                    </table>
    
                </td>
            </tr>
        </table>
    
    </body>
    </html>`

    transporter = nodemailer.createTransport(smtpTransport({
        // service: 'zoho',
        host: 'smtp.zoho.in',
        port: 465,
        // secure: true,
        auth: {
            user: realEmail,
            pass: realPassword
        }
    }))
    var messageObj = {
        from: realEmail,
        to: email,
        subject: subject,
        text: `Save Eat`,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log("Error and Info is===========", err, info);
        if (err) {
            callback(null, err);
        } else if (info) {
            callback(null, info)

        }
    })


}
