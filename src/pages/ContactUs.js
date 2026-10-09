import React, { useState } from "react";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Card, Container, Field, Input, PageHero, Textarea, focusRing } from "../components/ui";

const linkClass = `rounded text-primary underline-offset-2 hover:text-primary-hover hover:underline ${focusRing}`;

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setSent(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <PageHero
        eyebrow="Gomal University"
        title="Contact"
        description="Have questions? Feel free to reach out to us anytime!"
      />

      <Container className="py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-5">
          <Card as="section" className="self-start lg:col-span-2">
            <h2 className="text-lg font-semibold text-ink">Get in Touch</h2>
            <p className="mt-1 text-sm text-ink-secondary">Reach the university by post, phone or email.</p>
            <dl className="mt-5 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPinIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="font-medium text-ink">Address</dt>
                  <dd className="mt-0.5 text-ink-secondary">Gomal University, KPK, Pakistan</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="font-medium text-ink">Phone</dt>
                  <dd className="mt-0.5">
                    <a href="tel:+92-966-750-424-29" className={linkClass}>
                      +92 (966) 750-424-29
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="font-medium text-ink">Email</dt>
                  <dd className="mt-0.5">
                    <a href="mailto:info@gu.edu.pk" className={`break-all ${linkClass}`}>
                      info@gu.edu.pk
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Card>

          <Card as="section" className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-ink">Send a Message</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {sent && <Alert tone="success">Message sent successfully!</Alert>}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <Input type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required />
                </Field>
                <Field label="Email">
                  <Input type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required />
                </Field>
              </div>
              <Field label="Message">
                <Textarea name="message" rows={5} value={formData.message} onChange={handleChange} required />
              </Field>
              <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default ContactUs;
