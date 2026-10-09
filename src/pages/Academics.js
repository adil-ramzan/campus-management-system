import React from "react";
import ProgramCatalog from "../components/ProgramCatalog";
import { Badge, Card, CheckList, Container, PageHero, Section } from "../components/ui";

const FACULTIES = [
  {
    name: "Faculty of Science",
    description:
      "The Faculty of Science at Gomal University, located in Dera Ismail Khan, Pakistan, is a prominent academic division dedicated to advancing knowledge in the natural and physical sciences.",
    points: [
      "Undergraduate and graduate programs in Biology, Chemistry, Physics, and Mathematics",
      "Modern laboratories and research facilities",
      "Highly qualified faculty engaged in research",
    ],
    tags: ["Research Focused"],
  },
  {
    name: "Faculty of Arts and Social Sciences",
    description:
      "The Faculty of Arts & Social Sciences at Gomal University stands as a cornerstone of intellectual and cultural exploration, offering a rich array of programs.",
    points: [
      "Departments: English, Urdu, Political Science, Sociology, Economics, Psychology, Islamic Studies",
      "Well-equipped libraries and research centers",
      "Emphasis on community engagement and ethical leadership",
    ],
    tags: ["Interdisciplinary", "Cultural Studies"],
  },
  {
    name: "Faculty of Law and Administrative Sciences",
    description:
      "The Faculty of Law and Administrative Studies at Gomal University is dedicated to the study and research of legal and administrative sciences.",
    points: [
      "Comprehensive legal education covering constitutional, criminal, civil, and international law",
      "Programs in public administration and business administration",
      "Focus on ethical practice and leadership development",
    ],
    tags: ["Legal Studies", "Governance"],
  },
  {
    name: "Faculty of Computing",
    description:
      "The Department of Computing at Gomal University offers a comprehensive education in computer science, software engineering, and information technology.",
    points: [
      "Undergraduate and postgraduate programs in computing fields",
      "Modern computing labs and advanced software tools",
      "Strong industry connections and collaborative research",
    ],
    tags: ["Technology", "Innovation"],
  },
];

function Academics() {
  return (
    <>
      <PageHero
        eyebrow="Gomal University"
        title="Academics"
        description="Programs and faculties that lead education, research and innovation across the university."
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
          id="faculties"
          title="Faculties"
          description="Learn more about our esteemed faculties who are leading education, research, and innovation in their respective fields."
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {FACULTIES.map((faculty) => (
              <Card key={faculty.name} as="article" className="flex flex-col">
                <h3 className="border-l-2 border-gold pl-3 text-lg font-semibold text-ink">{faculty.name}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-secondary">{faculty.description}</p>
                <CheckList items={faculty.points} className="mt-4 flex-1" />
                <div className="mt-5 flex flex-wrap gap-2">
                  {faculty.tags.map((tag) => (
                    <Badge key={tag} tone="primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
}

export default Academics;
