import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf, Mail, Lock, User, ArrowRight } from "lucide-react";

const Login = () => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isSignUp ? "Sign up functionality requires backend integration." : "Sign in functionality requires backend integration.");
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("login.password")} className="bg-transparent outline-none text-foreground text-sm w-full" required />
              </div>
            </div>
            {isSignUp && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.confirmPassword")}</label>
                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <input type="password" placeholder={t("login.confirmPassword")} className="bg-transparent outline-none text-foreground text-sm w-full" required />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">{t("login.forgotPassword")}</button>
              </div>
            )}

            <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {isSignUp ? t("login.createAccount") : t("login.signIn")} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignUp ? t("login.haveAccount") : t("login.noAccount")}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
              {isSignUp ? t("login.signIn") : t("login.signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
