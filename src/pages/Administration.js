import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { Card, Container, PageHero } from "../components/ui";

function Administration() {
  return (
    <>
      <PageHero
        eyebrow="Gomal University"
        title="Administration"
        description="Leadership and governance of the university."
      />

      <Container className="py-10 lg:py-14">
        <Card as="section" id="vc-message" padded={false} className="mx-auto max-w-4xl scroll-mt-6">
          <header className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="h-8 w-8" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Vice Chancellor's Message</h2>
              <p className="mt-1 text-sm font-medium text-ink">Prof. Dr. Shakeeb Ullah</p>
              <p className="text-sm text-ink-secondary">Gomal University, Dera Ismail Khan</p>
            </div>
          </header>

          <div className="space-y-6 p-5 text-base leading-7 text-ink sm:p-8">
            <p className="text-lg leading-8">
              Taking the charge of Gomal University is a pleasant experience. This strategically unique – comprehensive university of KP (with all faculties – Science, Arts, Engineering, Pharmacy, Veterinary, Agriculture etc.) has enormous potentials including but not limited to hundreds of thousands of alumni all across the globe, diverse student population from all the provinces of Pakistan, highest student body from the former FATA region and the highest number of international students in any in land public sector university. The commitment of faculty members and students for attaining high standards of instructional environment is pleasantly amazing.
            </p>

            <blockquote className="space-y-4 border-l-2 border-gold pl-5 text-ink-secondary">
              <p>
                I am writing to express my grave concern over the sudden and deadly outbreak of corona pandemic – COVID-19 and resultant disturbance, thereby caused, of all planned academic activities. Corona pandemic has not only affected Gomal University and our motherland but has also touched the whole humanity across the globe.
              </p>
              <p>
                This is, no doubt, a hard time and Gomal family does feel the intense pain and is hopeful that this nightmare will be over soon.
              </p>
            </blockquote>

            <p>
              The lockdowns and restrictions will be lifted and once people will be free to lead a normal routine life of their own. However, during these testing and demanding times, lives of many low paid/ daily wage-workers are in distress and they are hardly able to earn bread and butter. All such deserving and needy people need our special attention. We shall donate generously according to our religious teachings and Sunnah. So, please come forward and play your part selflessly, actively and vigorously; donate Zakat, Sadqaat and any other possible charity (ies) at this critical juncture. Moreover, the real motive and spirit shall be to serve our brethren and humanity without any ostentation. Allah, the Almighty will reward us all for this.
            </p>

            <p className="rounded-lg bg-page p-5 font-medium">
              The university is open to all, for suggestions and ideas to uplift the academic and research standards. We, all the stakeholders, envision bringing its level at par with the leading universities of the World within three year (In Sha'Allah).
            </p>

            <footer className="border-t border-line pt-6 text-sm leading-6 text-ink-secondary">
              <p>Sincerely,</p>
              <p className="mt-1 text-base font-semibold text-ink">Prof. Dr. Shakeeb Ullah</p>
              <p>Vice-Chancellor</p>
              <p>Gomal University, Dera Ismail Khan</p>
            </footer>
          </div>
        </Card>
      </Container>
    </>
  );
}

export default Administration;
