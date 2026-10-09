import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import { Alert, Button, Field, IconInput, TextLink } from "../components/ui";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8 || password.length > 15) {
      setError("Password must be between 8 and 15 characters long.");
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      if (result.role === "admin") navigate("/admin");
      else if (result.role === "staff") navigate("/staff");
      else if (result.role === "student") navigate("/student");
      else navigate("/");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <AuthCard
      title="Sign in"
      description="Use your university account to open your dashboard."
      footer={
        <>
          <p>
            Don't have an account? <TextLink to="/signup">Sign up</TextLink>
          </p>
          <p>
            Forgot your password? <TextLink to="/contact">Contact the university</TextLink>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error">{error}</Alert>}

        <Field label="Email">
          <IconInput
            icon={EnvelopeIcon}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </Field>

        <Field label="Password">
          <IconInput
            icon={LockClosedIcon}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              if (e.target.value.length <= 15) {
                setPassword(e.target.value);
              }
            }}
            required
            placeholder="Enter your password"
          />
        </Field>

        <Button type="submit" className="w-full" loading={loading} loadingLabel="Signing in...">
          Login
        </Button>
      </form>
    </AuthCard>
  );
}

export default LoginPage;
