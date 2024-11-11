import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://ministore-server.vercel.app/api/googleCallback",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const email = profile.emails && profile.emails[0] && profile.emails[0].value;
                if (!email) throw new Error("Email not found in profile");

                const user = {
                    name: profile.displayName,
                    email,
                    password: profile.id
                }
                cb(null, user);
            } catch (err) {
                cb(err);
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.email);
})

passport.deserializeUser((user, done) => {
    try {
        done(null, user);
    } catch (error) {
        done(err, null);
    }
})
export default passport;
