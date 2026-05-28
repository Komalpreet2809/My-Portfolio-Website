import AmbientRiveMascot from "./AmbientRiveMascot";

export default function PortfolioStackSection() {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-24">
      <h2 className="font-mono text-7xl font-black uppercase tracking-tight md:text-9xl">
        My Stack
      </h2>

      <AmbientRiveMascot
        className="absolute right-[8vw] top-[34%] z-10"
        src="/rive/ambient-mascot-placeholder.riv"
        stateMachineName="Mascot"
      />

      <div className="mt-24 grid gap-4 md:grid-cols-2">
        {/* Existing stack cards go here. */}
      </div>
    </section>
  );
}
