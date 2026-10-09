import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import { Alert, Button, Field, Input, TextLink } from "../components/ui";

function SignupPage() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (password.length < 8 || password.length > 15) {
      setError("Password must be between 8 and 15 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signup({ name, email, password });
    setLoading(false);

    if (result.success) {
      navigate(result.role ? "/student" : "/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <AuthCard
      title="Create a student account"
      description="Sign up to see your courses, assignments and attendance."
      footer={
        <>
          <p>
            Already have an account? <TextLink to="/login">Sign in</TextLink>
          </p>
          <p className="text-xs">Admin and staff accounts must be provided by an administrator.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error">{error}</Alert>}

        <Field label="Full name">
          <Input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
          />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>

        <Field label="Password" hint="Use 8 to 15 characters.">
          <Input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            maxLength={15}
          />
        </Field>

        <Field label="Confirm password">
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
            maxLength={15}
          />
        </Field>

        <Button type="submit" className="w-full" loading={loading} loadingLabel="Creating account...">
          Sign up
        </Button>
      </form>
    </AuthCard>
  );
}

export default SignupPage;
