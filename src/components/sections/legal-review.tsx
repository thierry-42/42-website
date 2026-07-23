import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Surface } from "@/components/ui/surface";
import type { LegalDocumentContent } from "@/content/legal-content";

type LegalDocumentProps = {
  contactEmail: string;
  document: LegalDocumentContent;
};

export function LegalDocument({ contactEmail, document }: LegalDocumentProps) {
  return (
    <Section surface="paper">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:col-span-4">
            <Surface className="overflow-hidden">
              <div className="border-b border-[var(--border)] p-6">
                <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  Last updated
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em]">
                  {document.effectiveDate}
                </p>
              </div>
              <nav aria-label="On this page" className="p-6">
                <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  On this page
                </p>
                <ol className="mt-5 grid gap-3">
                  {document.sections.map((section, index) => (
                    <li
                      className="grid grid-cols-[2rem_1fr] gap-2 text-sm leading-5"
                      key={section.id}
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[0.6875rem] text-[var(--text-muted)]"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <a
                        className="font-semibold underline-offset-4 hover:underline"
                        href={`#${section.id}`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </Surface>
          </aside>

          <article className="lg:col-span-8">
            <div className="border-b border-ink-950/16 pb-10">
              <p className="max-w-[68ch] text-lg leading-8">
                {document.introduction}
              </p>
            </div>

            <div className="divide-y divide-ink-950/14">
              {document.sections.map((section, index) => (
                <section
                  className="scroll-mt-28 py-10 first:pt-12"
                  id={section.id}
                  key={section.id}
                >
                  <div className="grid gap-5 sm:grid-cols-[3rem_1fr]">
                    <p
                      aria-hidden="true"
                      className="pt-1 font-mono text-xs text-[var(--text-muted)]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div>
                      <h2 className="text-3xl leading-tight font-semibold tracking-[-0.045em] sm:text-4xl">
                        {section.title}
                      </h2>
                      <div className="mt-6 grid max-w-[70ch] gap-5 text-base leading-7 text-ink-950/76">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      {section.bullets ? (
                        <ul className="mt-6 grid max-w-[70ch] gap-3 pl-5 text-base leading-7 text-ink-950/76">
                          {section.bullets.map((item) => (
                            <li className="list-disc pl-1" key={item}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {section.links ? (
                        <div className="mt-6 flex flex-wrap gap-4">
                          {section.links.map((link) => (
                            <Link
                              className="text-sm font-semibold underline underline-offset-4"
                              href={link.href}
                              key={link.href}
                              prefetch={false}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <p className="border-t border-ink-950/16 pt-8 text-sm leading-6 text-[var(--text-muted)]">
              Questions about this document may be sent to{" "}
              <a
                className="font-semibold text-[var(--foreground)] underline underline-offset-4"
                href={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </a>
              .
            </p>
          </article>
        </div>
      </Container>
    </Section>
  );
}
