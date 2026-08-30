export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="ambient-square ambient-one" />
      <div className="ambient-square ambient-two" />
      <div className="ambient-square ambient-three" />
      <div className="ambient-line" />
    </div>
  );
}
