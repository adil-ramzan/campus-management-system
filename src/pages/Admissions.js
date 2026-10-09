import React from "react";
import ProgramCatalog from "../components/ProgramCatalog";
import { Button, Card, CheckList, Container, PageHero, Section } from "../components/ui";

const INTERNATIONAL_FEATURES = [
  {
    title: "Comfortable Hostel Facilities",
    points: [
      "Modern, secure on-campus housing with 24/7 security",
      "Fully furnished rooms with study areas",
      "Halal food options with international cuisine",
      "High-speed internet throughout facilities",
      "Dedicated international student lounges",
    ],
  },
  {
    title: "Generous Scholarship Programs",
    points: [
      "Merit-based scholarships covering 25-100% of tuition",
      "Special grants for students from developing nations",
      "Research assistantships for postgraduate students",
      "Work-study programs available after first year",
      "Alumni-sponsored scholarships for exceptional candidates",
    ],
  },
  {
    title: "World-Class Education",
    points: [
      "Internationally accredited programs",
      "Faculty with global teaching experience",
      "State-of-the-art research facilities",
      "Exchange programs with partner universities worldwide",
      "English-medium instruction with language support",
    ],
  },
  {
    title: "Comprehensive Support Services",
    points: [
      "Dedicated visa and immigration assistance",
      "On-campus health center with multi-lingual staff",
      "Counseling and wellness programs",
      "Prayer facilities and religious support",
      "International student association and mentorship programs",
    ],
  },
];

const CAMPUS_POINTS = [
  "30-acre botanical garden and walking trails",
  "Comprehensive recycling and waste management",
  "Modern, well-maintained academic buildings",
  "Water purification systems throughout campus",
  "Solar-powered facilities reducing carbon footprint",
  "Bicycle-sharing program and pedestrian-friendly design",
];

const ADMISSION_STEPS = [
  "Submit online application with required documents",
  "Receive conditional offer letter (typically within 2 weeks)",
  "Pay tuition deposit to secure admission",
  "Receive official admission letter for visa application",
  "Complete visa process with our guidance",
  "Attend orientation program before classes begin",
];

function Admissions() {
  return (
    <>
      <PageHero
        eyebrow="Gomal University"
        title="Admissions"
        description="Find a program, see what the university offers international students, and follow the admission process step by step."
      />

      <Container className="space-y-14 py-10 lg:py-14">
        <Section
          id="programs"
          title="Programs"
          description="Explore our range of undergraduate and postgraduate programs across disciplines tailored for academic excellence and career readiness."
        >
          <ProgramCatalog />
        </Section>

        <Section
          id="international-students"
          title="International Students"
          description="We proudly host students from over 25 countries, creating a vibrant multicultural learning environment. Our international students find a home away from home with comprehensive support services designed to ensure academic success and personal growth."
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {INTERNATIONAL_FEATURES.map((feature) => (
                <Card key={feature.title} as="article">
                  <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
                  <CheckList items={feature.points} className="mt-4" />
                </Card>
              ))}
            </div>

            <Card as="article">
              <h3 className="text-lg font-semibold text-ink">Clean & Sustainable Campus</h3>
              <p className="mt-2 text-sm leading-6 text-ink-secondary">
                Our university takes pride in maintaining a green, pollution-free environment with:
              </p>
              <CheckList items={CAMPUS_POINTS} columns className="mt-4" />
            </Card>

            <Card as="article">
              <h3 className="text-lg font-semibold text-ink">Admission Process for International Students</h3>
              <ol className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                {ADMISSION_STEPS.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-sm leading-6 text-ink">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-t border-line pt-5 text-sm leading-6 text-ink-secondary">
                Our international admissions team provides personalized assistance at every step, ensuring a smooth
                transition to university life.
              </p>
            </Card>
          </div>
        </Section>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Questions about admission?</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              The admissions office can help with programs, documents and deadlines.
            </p>
          </div>
          <Button to="/contact" className="shrink-0">
            Contact admissions
          </Button>
        </Card>
      </Container>
    </>
  );
}

export default Admissions;
