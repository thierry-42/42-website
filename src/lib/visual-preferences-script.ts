import { visualPreferencesStorageKey } from "@/lib/visual-preferences";

export const visualPreferencesPrePaintScript = `(()=>{try{const s=localStorage.getItem("${visualPreferencesStorageKey}");if(!s)return;const p=JSON.parse(s),e=document.documentElement,b=["current","brand-kit"],v=["standard","protan","deutan","tritan","monochrome"],c=["standard","high"];if(p&&b.includes(p.brandTheme)&&v.includes(p.visionMode)&&c.includes(p.contrastMode)){e.dataset.brandTheme=p.brandTheme;e.dataset.visionMode=p.visionMode;e.dataset.contrastMode=p.contrastMode}}catch{}})();`;
