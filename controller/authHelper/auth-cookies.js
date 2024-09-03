const { serialize, parse } = require('cookie');

const setTokenCookie = (res, tokenName, token, maxAge) => {
  const cookie = createCookie(tokenName, token, maxAge);
  res.setHeader('Set-Cookie', cookie);
};

const createCookie = (tokenName, token, maxAge) => {
  return serialize(tokenName, token, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV == 'production',
    path: '/',
    // sameSite: 'None',
  });
};

const setTokenCookies = (res, token) => {
  const [header, payload, signature] = token.split('.');
  let maxAge = 604800000;
  res
    .cookie('utdp1', header, {
      maxAge: maxAge,
      expires: new Date(Date.now() + maxAge * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      path: '/',
      // sameSite: 'None',
    })
    .cookie('utdp2', payload, {
      maxAge: maxAge,
      expires: new Date(Date.now() + maxAge * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      path: '/',
      // sameSite: 'None',
    })
    .cookie('utdp3', signature, {
      maxAge: maxAge,
      expires: new Date(Date.now() + maxAge * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      path: '/',
      // sameSite: 'None',
    });
};

const removeTokenCookie = (res, tokenName) => {
  const cookie = serialize(tokenName, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
};

const removeJwtTokenCookies = (res) => {
  res
    .cookie('utdp1', '', { maxAge: -1, expires: 'Thu, 01 Jan 1970 00:00:01 GMT' })
    .cookie('utdp2', '', { maxAge: -1, expires: 'Thu, 01 Jan 1970 00:00:01 GMT' })
    .cookie('utdp3', '', { maxAge: -1, expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
};

const parseCookies = (req) => {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
};

const getTokenCookie = (req, tokenName) => {
  const cookies = parseCookies(req);
  return cookies[tokenName];
};

module.exports = {
  setTokenCookie,
  setTokenCookies,
  removeTokenCookie,
  removeJwtTokenCookies,
  parseCookies,
  getTokenCookie,
};
