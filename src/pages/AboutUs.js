import React from "react";
import { Button, Card, Container, PageHero } from "../components/ui";

const KEY_FACTS = [
  ["Founded", "1974"],
  ["Location", "Dera Ismail Khan, Khyber Pakhtunkhwa"],
  ["Campuses", "3"],
  ["Faculties", "7"],
  ["Affiliated colleges", "50+"],
  ["Research centers & institutes", "20+"],
  ["Students enrolled", "Over 25,000"],
];

const STATEMENTS = [
  {
    title: "Overview",
    text: "Established in 1974, Gomal University is one of the oldest and most prestigious institutions of higher education in Pakistan. Located in the Khyber Pakhtunkhwa province, the university offers a diverse range of academic programs and is known for its commitment to excellence in education and research.",
  },
  {
    title: "Our Mission",
    text: "Gomal University strives to foster an environment of academic excellence and research innovation, aiming to produce highly skilled professionals equipped with ethical values and leadership qualities.",
  },
  {
    title: "Our Vision",
    text: "To be a center of excellence in higher education, driving societal development through knowledge, innovation, and leadership.",
  },
];

function AboutUs() {
  return (
    <>
      <PageHero
        eyebrow="Established 1974"
        title="About Gomal University"
        description="Empowering Education, Research, and Innovation"
      />

      <Container className="space-y-8 py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="space-y-8 lg:col-span-2">
            {STATEMENTS.map(({ title, text }) => (
              <section key={title}>
                <h2 className="text-xl font-semibold text-ink">{title}</h2>
                <p className="mt-2 text-base leading-7 text-ink-secondary">{text}</p>
              </section>
            ))}
          </Card>

          <Card as="aside" className="self-start">
            <h2 className="border-l-2 border-gold pl-3 text-base font-semibold text-ink">Key Facts</h2>
            <dl className="mt-4 divide-y divide-line text-sm">
              {KEY_FACTS.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-ink-secondary">{label}</dt>
                  <dd className="text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Join Gomal University</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Be part of a thriving academic community and shape your future.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="secondary" to="/admissions">
              View admissions
            </Button>
            <Button to="/contact">Contact Us</Button>
          </div>
        </Card>
      </Container>
    </>
  );
}

export default AboutUs;
