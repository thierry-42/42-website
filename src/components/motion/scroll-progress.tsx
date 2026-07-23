export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="scroll-progress fixed inset-x-0 top-[calc(var(--header-height)-2px)] z-[60] h-0.5 origin-left bg-signal-400"
    />
  );
}
