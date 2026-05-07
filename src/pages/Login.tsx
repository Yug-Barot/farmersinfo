import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf, Mail, Lock, User, ArrowRight, Loader2, Phone, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";

const Login = () => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [phonePassword, setPhonePassword] = useState("");
  const [phoneConfirmPassword, setPhoneConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      toast({ title: t("login.passwordsMismatch") || "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: t("login.signUpFailed") || "Sign up failed", description: error, variant: "destructive" });
      } else {
        toast({ title: t("login.accountCreated") || "Account created! 🌱", description: t("login.checkEmail") || "Check your email to confirm your account." });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: t("login.signInFailed") || "Sign in failed", description: error, variant: "destructive" });
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  const sendOtp = () => {
    if (!phone || phone.length < 10) {
      toast({ title: t("login.invalidPhone") || "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast({ title: t("login.otpSent") || "OTP Sent! 📱", description: `${t("login.demoOtp") || "Demo OTP"}: ${code}` });
    }, 1000);
  };

  const verifyOtp = () => {
    if (otp !== generatedOtp) {
      toast({ title: t("login.invalidOtp") || "Invalid OTP", variant: "destructive" });
      return;
    }
    setOtpVerified(true);
    toast({ title: t("login.otpVerified") || "OTP Verified! ✅", description: t("login.enterDetails") || "Please enter your details to continue." });
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneName.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }
    if (phonePassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (phonePassword !== phoneConfirmPassword) {
      toast({ title: t("login.passwordsMismatch") || "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const demoEmail = `${phone}@phone.cropwise.demo`;
    // Try sign in first
    const { error: signInError } = await signIn(demoEmail, phonePassword);
    if (!signInError) {
      navigate("/");
      setLoading(false);
      return;
    }
    // Sign up
    const { error: signUpError } = await signUp(demoEmail, phonePassword, phoneName);
    if (signUpError) {
      toast({ title: t("login.signUpFailed") || "Sign up failed", description: signUpError, variant: "destructive" });
      setLoading(false);
      return;
    }
    // Try sign in after signup
    const { error } = await signIn(demoEmail, phonePassword);
    if (error) {
      toast({ title: t("login.accountCreated") || "Account created! 🌱", description: t("login.checkEmail") || "Please check your email to confirm." });
    } else {
      toast({ title: t("login.accountCreated") || "Account created! 🌱" });
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-2xl font-bold mb-8">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-secondary-foreground" />
          </div>
          <span className="text-primary">Crop</span><span className="text-foreground">Wise</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <h1 className="text-2xl font-bold text-foreground font-display text-center mb-1">
            {isSignUp ? t("login.createAccount") : t("login.title")}
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-6">{t("login.subtitle")}</p>

          <div className="flex gap-2 mb-6">
            <button onClick={() => { setLoginMethod("email"); setOtpSent(false); setOtpVerified(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${loginMethod === "email" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}>
              <Mail className="w-4 h-4" /> {t("login.email")}
            </button>
            <button onClick={() => { setLoginMethod("phone"); setIsSignUp(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${loginMethod === "phone" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}>
              <Phone className="w-4 h-4" /> {t("login.phone") || "Phone"}
            </button>
          </div>

          {loginMethod === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.fullName")}</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("login.fullName")} className="bg-transparent outline-none text-foreground text-sm w-full" required />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.email")}</label>
                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("login.email")} className="bg-transparent outline-none text-foreground text-sm w-full" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.password")}</label>
                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("login.password")} className="bg-transparent outline-none text-foreground text-sm w-full" required minLength={6} />
                </div>
              </div>
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.confirmPassword")}</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("login.confirmPassword")} className="bg-transparent outline-none text-foreground text-sm w-full" required minLength={6} />
                  </div>
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSignUp ? t("login.createAccount") : t("login.signIn")} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.phoneNumber") || "Phone Number"}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">+91</span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" className="bg-transparent outline-none text-foreground text-sm w-full" maxLength={10} />
                    </div>
                  </div>
                  <button onClick={sendOtp} disabled={loading || phone.length < 10} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {t("login.sendOtp") || "Send OTP"}
                  </button>
                </>
              ) : !otpVerified ? (
                <>
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">{t("login.otpSentTo") || "OTP sent to"} +91-{phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.enterOtp") || "Enter OTP"}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" className="bg-transparent outline-none text-foreground text-sm w-full tracking-[0.5em] text-center font-bold" maxLength={4} />
                    </div>
                  </div>
                  <button onClick={verifyOtp} disabled={loading || otp.length < 4} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {t("login.verifyOtp") || "Verify OTP"} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full text-sm text-muted-foreground hover:text-foreground text-center">
                    {t("login.changeNumber") || "Change number"}
                  </button>
                </>
              ) : (
                <form onSubmit={handlePhoneSignUp} className="space-y-4">
                  <div className="text-center mb-2">
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium">
                      <Shield className="w-4 h-4" /> {t("login.phoneVerified") || "Phone Verified"}: +91-{phone}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.fullName")}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <input type="text" value={phoneName} onChange={(e) => setPhoneName(e.target.value)} placeholder={t("login.fullName") || "Full Name"} className="bg-transparent outline-none text-foreground text-sm w-full" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.password")}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <input type="password" value={phonePassword} onChange={(e) => setPhonePassword(e.target.value)} placeholder={t("login.password") || "Create Password"} className="bg-transparent outline-none text-foreground text-sm w-full" required minLength={6} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.confirmPassword")}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <input type="password" value={phoneConfirmPassword} onChange={(e) => setPhoneConfirmPassword(e.target.value)} placeholder={t("login.confirmPassword") || "Confirm Password"} className="bg-transparent outline-none text-foreground text-sm w-full" required minLength={6} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {t("login.createAccount") || "Create Account"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <button
            onClick={async () => {
              const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
              if (result.error) {
                toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
              }
            }}
            className="w-full flex items-center justify-center gap-3 bg-muted border border-border rounded-lg py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          {loginMethod === "email" && (
            <p className="text-sm text-muted-foreground text-center mt-6">
              {isSignUp ? t("login.haveAccount") : t("login.noAccount")}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                {isSignUp ? t("login.signIn") : t("login.signUp")}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
