import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import prisma from "../prismaClient";

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  throw new Error("Missing required Google OAuth environment variables");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      const googleId = profile.id;

      if (!email) {
        return done(new Error("No email found in Google profile"), false);
      }

      try {
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId }, { email }],
          },
        });

        if (!user) {
          // create a new user if not found
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              googleId,
            },
          });
        } else if (!user.googleId) {
          // if user exists but has no googleId yet, update it
          user = await prisma.user.update({
            where: { email },
            data: { googleId },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", JSON.stringify(user, null, 2));
  if (!user || !user.id) {
    console.error("User object is invalid:", user);
    return done(new Error("User object is invalid or missing id"), null);
  }
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
