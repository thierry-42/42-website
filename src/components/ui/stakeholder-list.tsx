type StakeholderListProps = {
  ariaLabel: string;
  items: readonly string[];
};

export function StakeholderList({ ariaLabel, items }: StakeholderListProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="grid gap-2 sm:flex sm:flex-wrap"
      data-testid="stakeholder-list"
    >
      {items.map((item, index) => (
        <li
          className="grid min-h-11 grid-cols-[2rem_minmax(0,1fr)] items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm leading-5 text-[var(--text-muted)] sm:min-h-8 sm:grid-cols-1 sm:rounded-full sm:px-3 sm:py-1 sm:font-mono sm:text-[0.6875rem] sm:tracking-[0.06em]"
          key={item}
        >
          <span
            aria-hidden="true"
            className="font-mono text-[0.625rem] text-[var(--text-muted)] sm:hidden"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
