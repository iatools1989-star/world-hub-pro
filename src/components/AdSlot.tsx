export default function AdSlot({ label = 'AdSense' }: { label?: string }) {
  return (
    <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-xl p-4 text-center">
      <div className="text-[11px] tracking-widest font-black text-zinc-400">{label} • $8 RPM • Global</div>
      <div className="mt-2 text-sm font-bold text-zinc-600">Anúncio Responsivo</div>
      <div className="text-xs text-zinc-400">Substitua por seu &lt;ins className="adsbygoogle"&gt; após aprovação</div>
    </div>
  );
}
