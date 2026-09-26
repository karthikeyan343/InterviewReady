import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${escapedEmail}$`, "i") },
    });

    if (existingUser) {
      res.status(409).json({
        message: "Email is already registered. Please try with a different email.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${escapedEmail}$`, "i") },
    });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    if (!user.password) {
      res.status(401).json({
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        message: "JWT secret is not configured",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const googleLoginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { credential, flow = "login", mode } = req.body;
    const isRegister = flow === "register" || mode === "register";

    if (!credential) {
      res.status(400).json({
        message: "Google credential is required",
      });
      return;
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      res.status(500).json({
        message: "Google Client ID is not configured",
      });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(401).json({
        message: "Invalid Google credential",
      });
      return;
    }

    const {
      sub: googleId,
      email,
      email_verified: emailVerified,
      name,
      picture,
    } = payload;

    if (!googleId || !email) {
      res.status(401).json({
        message: "Google account information is incomplete",
      });
      return;
    }

    if (!emailVerified) {
      res.status(401).json({
        message: "Google email is not verified",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let user = await User.findOne({
      $or: [
        { googleId },
        { email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } },
      ],
    });

    if (isRegister) {
      if (user) {
        res.status(409).json({
          message: "Email is already registered. Please try with a different email.",
        });
        return;
      }

      user = await User.create({
        name: name?.trim() || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        avatar: picture,
        authProvider: "google",
      });
    } else {
      if (user) {
        let shouldSave = false;

        if (!user.googleId) {
          user.googleId = googleId;
          shouldSave = true;
        }

        if (picture && user.avatar !== picture) {
          user.avatar = picture;
          shouldSave = true;
        }

        if (!user.authProvider) {
          user.authProvider = "google";
          shouldSave = true;
        }

        if (shouldSave) {
          await user.save();
        }
      } else {
        user = await User.create({
          name: name?.trim() || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          googleId,
          avatar: picture,
          authProvider: "google",
        });
      }
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        message: "JWT secret is not configured",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.status(isRegister ? 201 : 200).json({
      message: isRegister ? "Google registration successful" : "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};