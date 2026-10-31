import { useState } from "react";
import useAppContext from "../context/useAppContext";

const getErrorMessage = (error) => {
  if (error.code === "invalid_credentials") {
    return "E-mail ou mot de passe incorrect.";
  }
  if (error.code === "signup_disabled") {
    return "La création de compte est désactivée.";
  }
  return error.message;
};

const AuthForm = () => {
  const { signIn, signUp } = useAppContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsSubmitting(true);

    const { data, error: authError } = isSignUp
      ? await signUp(email.trim(), password)
      : await signIn(email.trim(), password);

    setIsSubmitting(false);

    if (authError) {
      setError(getErrorMessage(authError));
    } else if (isSignUp && !data.session) {
      setInfo("Compte créé. Confirme ton adresse depuis l'e-mail reçu.");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Choses à faire</h1>
        <p>
          {isSignUp
            ? "Crée ton compte pour retrouver tes tâches partout."
            : "Connecte-toi pour retrouver tes tâches sur tous tes appareils."}
        </p>

        <label htmlFor="auth-email">E-mail</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="auth-password">Mot de passe</label>
        <input
          id="auth-password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="auth-message auth-message--error">{error}</p>}
        {info && <p className="auth-message">{info}</p>}

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSignUp ? "Créer mon compte" : "Se connecter"}
        </button>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setIsSignUp((active) => !active);
            setError("");
            setInfo("");
          }}
        >
          {isSignUp ? "J'ai déjà un compte" : "Créer un compte"}
        </button>
      </form>
    </main>
  );
};

export default AuthForm;
