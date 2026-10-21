"use client";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function BulkStudio() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []) as File[];
    const today = new Date().toDateString();
    const used = parseInt(localStorage.getItem(today) || "0");
    if (used + selected.length > 10) {
      alert(`Free: 10/day. Você já usou ${used}. Pro $9/mês = 500/dia (em breve)`);
      return;
    }
    setFiles(selected);
  };

  const processAndZip = async () => {
    setLoading(true);
    const zip = new JSZip();
    
    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round(((i+1)/files.length)*100));
      const file = files[i];
      
      // Redimensiona para 2000x2000 e comprime 100% offline via Canvas
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise(res => img.onload = res);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = 2000; canvas.height = 2000;
      // fundo branco para JPG
      ctx.fillStyle = "#fff"; ctx.fillRect(0,0,2000,2000);
      // centraliza imagem
      const scale = Math.min(2000/img.width, 2000/img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, (2000-w)/2, (2000-h)/2, w, h);
      
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), "image/jpeg", 0.8));
      zip.file(`shopify-seo-${i+1}.jpg`, blob);
    }
    
    const content = await zip.generateAsync({type:"blob"});
    saveAs(content, `bulk-studio-${files.length}.zip`);
    
    const today = new Date().toDateString();
    localStorage.setItem(today, String((parseInt(localStorage.getItem(today)||"0")) + files.length));
    setLoading(false);
    setProgress(100);
  };

  return (
    <div className="p-6 bg-white rounded-xl border">
      <h2 className="text-2xl font-bold">📦 Private Bulk Studio</h2>
      <p className="text-sm text-gray-600">100% offline. Suas fotos nunca saem do seu navegador.</p>
      <input type="file" multiple accept="image/*" onChange={handleFiles} className="my-4 block w-full border p-2 rounded" />
      {files.length > 0 && (
        <button onClick={processAndZip} disabled={loading} className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50">
          {loading ? `Processando... ${progress}%` : `Processar ${files.length} imagens → Baixar ZIP`}
        </button>
      )}
      {progress === 100 && <p className="text-green-600 text-sm mt-2">✓ Pronto! ZIP baixado. Teste com suas fotos reais.</p>}
    </div>
  );
}