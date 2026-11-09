// server/src/middleware/fixCookies.js
// This middleware strips the __Secure- prefix and Secure flag from Better Auth cookies
// during local development, because Better Auth 1.x ignores useSecureCookies: false.
// server/src/middleware/fixCookies.js
// This middleware strips the __Secure- prefix and Secure flag from Better Auth cookies
// during local development, because Better Auth 1.x ignores useSecureCookies: false.

export function fixCookies(req, res, next) {
  // Only apply on localhost/development
  if (process.env.NODE_ENV !== 'development') {
    console.log('[fixCookies] Skipping (NODE_ENV is not development)');
    return next();
  }
 

  const originalSetHeader = res.setHeader.bind(res);

  res.setHeader = function (name, value) {
    if (name.toLowerCase() === 'set-cookie') {
      console.log('[fixCookies] Intercepted Set-Cookie:');
      console.log('   BEFORE:', JSON.stringify(value));

      if (Array.isArray(value)) {
        value = value.map((cookie) => {
          let fixed = cookie.replace(/^__Secure-/i, '');
          fixed = fixed.replace(/;\s*Secure/gi, '');
          if (!fixed.includes('SameSite')) {
            fixed += '; SameSite=Lax';
          }
          return fixed;
        });
      } else if (typeof value === 'string') {
        value = value.replace(/^__Secure-/i, '').replace(/;\s*Secure/gi, '');
        if (!value.includes('SameSite')) {
          value += '; SameSite=Lax';
        }
      }

   
    }
    return originalSetHeader(name, value);
  };

  next();
}