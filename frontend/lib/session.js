// In /lib/session.js - update verifySessionToken
export async function verifySessionToken(token) {
  try {
    console.log('🔐 Verifying session token format...');
    
    // Check if it's a Base64 token (your current format)
    if (token && !token.includes('.') && token.length > 50) {
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        console.log('✅ Base64 token decoded:', decoded);
        
        // Check expiration
        const now = Date.now();
        if (decoded.exp && decoded.exp < now) {
          console.log('❌ Token expired');
          return null;
        }
        
        return {
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role
        };
      } catch (base64Error) {
        console.log('❌ Base64 decode failed:', base64Error.message);
      }
    }
    
    // If not Base64, try as JWT
    if (token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          console.log('✅ JWT token decoded:', payload);
          return {
            userId: payload.userId,
            username: payload.username,
            email: payload.email,
            role: payload.role
          };
        } catch (jwtError) {
          console.log('❌ JWT decode failed:', jwtError.message);
        }
      }
    }
    
    console.log('❌ Token format not recognized');
    return null;
    
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return null;
  }
}