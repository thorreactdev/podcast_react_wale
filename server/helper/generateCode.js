export function generateVerificationCode(){
    let verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return verificationCode;
}
