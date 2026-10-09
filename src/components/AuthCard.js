import React from "react";
import { Card } from "./ui";

// The centred card used by the sign-in and sign-up pages.
function AuthCard({ title, description, footer, children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-10 sm:items-center sm:py-14">
      <div className="w-full max-w-md">
        <Card padded={false} className="p-5 sm:p-8">
          <div className="text-center">
            <img src="/logo.png" alt="" className="mx-auto h-12 w-9 object-cover object-left" />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            {description && <p className="mt-1.5 text-sm text-ink-secondary">{description}</p>}
          </div>
          <div className="mt-6">{children}</div>
        </Card>
        {footer && <div className="mt-5 space-y-2 text-center text-sm text-ink-secondary">{footer}</div>}
      </div>
    </div>
  );
}

export default AuthCard;
