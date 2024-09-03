/* eslint-disable func-names */
const speakeasy = require("speakeasy");

function OtpStartegy() {
  const generateOTP = () => {
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    return { secret: secret.base32, token };
  };

  const verifyOTP = (base32Secret, token) => {
    return speakeasy.totp.verify({
      secret: base32Secret,
      encoding: "base32",
      token,
      window: 4,
    });
  };

  return {
    generateOTP,
    verifyOTP,
  };
}

module.exports = OtpStartegy;
