import NodeCache from "node-cache";

const EXPIRE_IN_SECOND = 100;

const cache = new NodeCache({ stdTTL: EXPIRE_IN_SECOND });

function generateVerificationCode(phoneNumber?: string): string {
  if (!phoneNumber) throw new Error("no phone number");

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  cache.set(phoneNumber, code);

  console.log("generatedCode", code);

  return code;
}

function verifyVerificationCode(phoneNumber: string, code: string): boolean {
  const storedCode = cache.get(phoneNumber) as string;

  console.log("storedCode", storedCode, "code", code);

  const verified = storedCode === code;

  return verified;
}

function getCodeByPhoneNumber(phoneNumber: string): string | undefined {
  const storedCode = cache.get(phoneNumber) as string;
  console.log("getCodeByPhoneNumber", storedCode);

  return storedCode;
}

export {
  generateVerificationCode,
  verifyVerificationCode,
  getCodeByPhoneNumber,
};

