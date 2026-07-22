import { Surface } from "@/components/ui/surface";

type ProcessStepProps = {
  body: string;
  number: string;
  title: string;
};

export function ProcessStep({ body, number, title }: ProcessStepProps) {
  return (
    <Surface className="grid gap-8 p-6 md:grid-cols-[5rem_1fr] md:p-8">
      <div className="font-mono text-sm text-[var(--text-muted)]">{number}</div>
      <div>
        <h3 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
        <p className="mt-3 max-w-[48ch] text-base leading-7 text-[var(--text-muted)]">
          {body}
        </p>
      </div>
    </Surface>
  );
}
