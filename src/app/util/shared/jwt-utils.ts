import jwt from 'jsonwebtoken';
// import config from 'config';

// const privateKey = config.get<string>('privateKey');
const privateKey = process.env.PRIVATE_KEY as string;
// const publicKey = config.get<string>('publicKey');
const publicKey = process.env.PUBLIC_KEY as string;
// console.log({ privateKey, publicKey });

export function signJwt(object: object, options?: jwt.SignOptions | undefined) {
  console.log({ object, options, privateKey });
  // newline chars need to be removed from the private key
  // const privateKeyWithoutNewline = privateKey.replace(/\\n/g, '\n');
  // return jwt.sign(object, privateKeyWithoutNewline, {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
}
