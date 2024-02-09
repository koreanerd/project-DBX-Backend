/*eslint-disable no-undef */
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");
const User = require("../models/User");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sg32l%40team-dbx.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const login = async function (req, res, next) {
  const idToken = req.body.idToken;
  const email = req.body.email;

  if (!idToken || !email) {
    res.status(400).json({
      result: "Error",
      message: "Both idToken and email are required",
    });
    return;
  }

  try {
    const userCount = await User.countDocuments();
    const authenticatedUser = await getAuth().verifyIdToken(idToken);
    const user = await User.find({ email: authenticatedUser.email }).exec();

    if (authenticatedUser.email !== email) {
      throw new Error("Unauthorized");
    }

    if (!user.length) {
      new User({
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        isAdmin: true,
      }).save();
    }

    if (!userCount) {
      res.json({
        result: "OK",
        isInitialUser: true,
        isUser: true,
        isAdmin: user.length ? user[0].isAdmin : true,
      });

      return;
    }

    res.json({
      result: "OK",
      isUser: true,
      isAdmin: user.length ? user[0].isAdmin : true,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      res.statusCode = 401;
      res.json({
        result: "Error",
        message: "401 Invalid User",
      });

      return;
    } else {
      next(error);
    }
  }
};

module.exports = {
  login: login,
};
