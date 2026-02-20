
# ☁️ SkyVault - Secure Enterprise File Sharing

SkyVault is a professional-grade file sharing application designed with a focus on security, user experience, and ease of deployment.

## 🚀 HANDLING "NETWORK ERROR"

If you see a **Network Error** while Registering or Logging in, it is because the Node.js backend is not running. 

**I have implemented an Automatic Fallback:**
1. The app will now automatically switch to **Mock Mode** if it cannot reach `localhost:5000`.
2. You can Register, Verify OTP, and Login using the browser's storage.
3. **Demo OTP Code:** Use `123456` to verify any account in Mock Mode.

### 🛠️ Real Backend Setup (Local Machine)
To use the real database and email system:
1. `cd backend`
2. Create a `.env` file (see `.env.example`).
3. Run `npm install` and `npm start`.
4. Ensure your local **MongoDB** service is active.

---

## 🛡️ Security Logic
- **Hashing**: Passwords and OTPs are hashed using `bcrypt` (12 rounds).
- **JWT**: Secure access tokens with refresh token persistence.
- **OTP Verification**: Multi-step flow to prevent unverified account access.
- **Resend Limits**: Max 3 OTP resends per session.

*Made with ❤️ by SkyVault Team*
