import { Context, Hono } from "hono";
import { CookieStore, sessionMiddleware } from "hono-sessions";
import { getCookie, setCookie } from "hono/cookie";
import { generateState, OAuth2Client } from "oslo/oauth2";

import { prisma } from "../config/Prisma";

export const routeLoginGoogle = new Hono();
const store = new CookieStore();

const googleOAuth2Client = new OAuth2Client(
  Bun.env.GOOGLE_CLIENT_ID as string,
  "https://accounts.google.com/o/oauth2/v2/auth",
  "https://oauth2.googleapis.com/token",
  {
    redirectURI: "http://localhost:3000/login/google/callback",
  }
);

const getGoogleUser = async (accessToken: string) => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return await response.json();
};

routeLoginGoogle.use(
  "*",
  sessionMiddleware({
    store,
    encryptionKey: Bun.env.SESSION_ENCRYPTION_KEY,
    expireAfterSeconds: 900,
    cookieOptions: {
      path: "/",
      httpOnly: true,
    },
  })
);

routeLoginGoogle
  .get("/", async (c: Context) => {
    const session = c.get("session");
    const user = session.get("user");

    return c.html(`
      <html>
        <body>
          ${
            user
              ? `<div>User: ${JSON.stringify(
                  user
                )}</div><a href='/logout'>Logout</a>`
              : `<div><a href='/login/google'>Google Login</a></div>`
          }
        </body>
      </html>
    `);
  })
  .get("/login/google", async (c: Context) => {
    const session = c.get("session");
    const user = session.get("user");

    if (user) {
      return c.redirect("/profissional");
    }

    console.log(user);

    const googleOAuth2State = generateState();

    const url = await googleOAuth2Client.createAuthorizationURL({
      state: googleOAuth2State,
      scopes: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });

    setCookie(c, "google_oauth2_state", googleOAuth2State, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 60 * 60,
    });

    return c.redirect(url.toString() + "&prompt=select_account");
  })
  .get("/login/google/callback", async (c: Context) => {
    const { state, code } = c.req.query();
    const googleOAuth2State = getCookie(c, "google_oauth2_state");

    if (!googleOAuth2State || !state || googleOAuth2State !== state) {
      return c.status(400);
    }

    console.log(`code: ${code}`);

    const { access_token } = await googleOAuth2Client.validateAuthorizationCode(
      code,
      {
        credentials: Bun.env.GOOGLE_CLIENT_SECRET,
        authenticateWith: "request_body",
      }
    );

    console.log(`accessToken: ${access_token}`);

    const user = await getGoogleUser(access_token);

    await prisma.profissionalSaude.upsert({
      where: { email: user.email },
      update: {
        nome: user.name,
        foto_perfil: user.picture,
        googleId: user.sub,
      },
      create: {
        nome: user.name,
        email: user.email,
        senha: "",
        foto_perfil: user.picture,
        createdAt: new Date().toDateString(),
        googleId: user.sub,
      },
    });

    // set user information to the session cookie
    const session = c.get("session");
    session.set("user", user);

    return c.redirect("/profissional");
  })
  .get("/logout", async (c: Context) => {
    c.get("session").deleteSession();
    return c.redirect("/");
  });
