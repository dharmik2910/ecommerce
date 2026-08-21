export default function Footer() {
  return (
    <footer className="border-t border-walnut-200/60 bg-walnut-900 py-10 text-walnut-100">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-xl">Hearthwood</p>
          <p className="mt-1 text-sm text-walnut-300">Furniture built from real materials, meant to be used.</p>
        </div>
        <p className="text-xs text-walnut-400">© {new Date().getFullYear()} Hearthwood. All rights reserved.</p>
      </div>
    </footer>
  );
}
