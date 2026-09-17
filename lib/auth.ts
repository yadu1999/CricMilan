import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'cricmilan-super-secret-key-123987'
);

const COOKIE_NAME = 'cricmilan_admin_session';

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ username, isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<{ username: string; isAdmin: boolean } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      username: payload.username as string,
      isAdmin: !!payload.isAdmin
    };
  } catch (err) {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || !session.isAdmin) return null;
  return { username: session.username };
}

export { COOKIE_NAME };
