import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import "dotenv/config";
import * as UserService from '../services/userService.js';
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const {token, user_id} = await UserService.authenticateUser(email, password);
        console.log("Login result: ", token, user_id)
        return res.json({ token, user_id });
    } catch(err) {
        console.log(err);
        if (err.message === 'Email not found') {
        res.status(400).json({message: 'Email not found'});
        } else if (err.message === 'Incorrect Password') {
        res.status(401).json({message: 'Incorrect Password'});
        } else {
            res.status(500).send("Server error");
        }
    }
});

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const newUser = await UserService.registerUser(name, email, password);
        if ((!newUser.token || !newUser.user_id) && newUser.status === 409) {
            return res.json({ msg: newUser.msg, status: newUser.status });
        }
        return res.json({ token: newUser.token, user_id: newUser.user_id });
    } catch (error) {
        console.log("There is an error on register");
    }
});

router.get("/user/profile", auth, async (req, res) => {
    const id = req.user.id;
    const userData = await UserService.getUserDataById(id);
    if (!userData) return res.status(401).json({msg: 'Something went wrong on user data'})
    const { name, email, user_id } = userData;
    return res.send({name, email, user_id});
});

router.get("/users/get", async (req, res) => {
    const users = await UserService.getAllUsers();
    if (!users) return res.status(401).json({ msg: 'Something Went Wrong Getting Users'});
    return res.json(users);
})

router.delete("/users/:userId/delete", async (req, res) => {
    const userId = req.params.userId;
    const deletedUser = await UserService.deleteUser(userId);
    if (!deletedUser) return res.status(401).json({ msg: 'Something Went Wrong Deleting User!'});
    return res.json(deletedUser);
})

router.post(
    "/google", 
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
)

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login"
    }), (req, res, next) => {
        next();
    },
    async (req, res) => {
        const user = req.user;
        try {
            const role = user.email === "yhtet1934@gmail.com" ? 'admin' : 'user'; // for initial admin setup
            const isUserExist = await UserService.getUserByEmail(user.email);
            if (isUserExist) {
                const { token, user_id } = await UserService.authenticateUser(user.email, user.password)
                return res.redirect(`http://localhost:5173?token=${token}&user_id=${user_id}`);
            } else {
                const { token, user_id } = await UserService.registerUser(user.name, user.email, user.password, role);
                return res.redirect(`http://localhost:5173?token=${token}&user_id=${user_id}`);
            }
        } catch(err) {
            console.log(err);
            return res.status(500).send("Registration failed.");
        }
    }
)

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const user = { name: profile.displayName, email: profile.email, password: profile.id }
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

export default router;