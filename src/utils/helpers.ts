export function generateSpriteId(): string {
  return `sprite_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const BUILTIN_SPRITES: { name: string; svg: string; width?: number; height?: number }[] = [
  {
    name: "Kite",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><polygon points="40,8 72,35 40,72 8,35" fill="#3385fc" stroke="#1551e0" stroke-width="2"/><line x1="40" y1="8" x2="40" y2="72" stroke="#1551e0" stroke-width="1" opacity="0.3"/><line x1="8" y1="35" x2="72" y2="35" stroke="#1551e0" stroke-width="1" opacity="0.3"/><circle cx="40" cy="35" r="4" fill="#fff" opacity="0.7"/></svg>`,
  },
  {
    name: "Cat",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="50" rx="22" ry="18" fill="#f0a050"/><circle cx="40" cy="32" r="18" fill="#f0a050"/><polygon points="25,20 30,8 35,22" fill="#f0a050"/><polygon points="45,22 50,8 55,20" fill="#f0a050"/><circle cx="33" cy="30" r="3" fill="#333"/><circle cx="47" cy="30" r="3" fill="#333"/><polygon points="38,38 42,38 40,42" fill="#ff6b6b"/><path d="M 30 44 Q 40 50 50 44" stroke="#333" stroke-width="1.5" fill="none"/><polygon points="40,42 35,48 45,48" fill="#ff6b6b"/></svg>`,
  },
  {
    name: "Robot",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><rect x="20" y="20" width="40" height="40" rx="6" fill="#666"/><rect x="28" y="28" width="24" height="16" rx="3" fill="#333"/><circle cx="35" cy="36" r="3" fill="#00ff88"/><circle cx="45" cy="36" r="3" fill="#00ff88"/><rect x="30" y="50" width="20" height="4" rx="2" fill="#333"/><rect x="38" y="12" width="4" height="8" fill="#666"/><circle cx="40" cy="10" r="3" fill="#ff4444"/><rect x="15" y="35" width="5" height="10" fill="#666"/><rect x="60" y="35" width="5" height="10" fill="#666"/></svg>`,
  },
  {
    name: "Ball",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="32" fill="#ff4444" stroke="#cc0000" stroke-width="2"/><path d="M 40 8 Q 60 40 40 72" stroke="#fff" stroke-width="3" fill="none" opacity="0.6"/><path d="M 8 40 Q 40 25 72 40" stroke="#fff" stroke-width="2" fill="none" opacity="0.4"/></svg>`,
  },
  {
    name: "Star",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><polygon points="40,8 50,30 72,30 55,45 62,68 40,55 18,68 25,45 8,30 30,30" fill="#ffd700" stroke="#e6b800" stroke-width="2"/></svg>`,
  },
  {
    name: "Apple",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path d="M 40 20 C 20 20 12 35 12 50 C 12 65 25 72 40 72 C 55 72 68 65 68 50 C 68 35 60 20 40 20 Z" fill="#e02020" stroke="#a01010" stroke-width="2"/><path d="M 40 20 Q 42 10 50 8" stroke="#5a3a1a" stroke-width="3" fill="none"/><ellipse cx="35" cy="15" rx="8" ry="4" fill="#4caf50" transform="rotate(-30 35 15)"/></svg>`,
  },
  {
    name: "Ghost",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path d="M 20 30 Q 20 10 40 10 Q 60 10 60 30 L 60 68 L 52 60 L 44 68 L 36 60 L 28 68 L 20 60 Z" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/><circle cx="32" cy="30" r="4" fill="#333"/><circle cx="48" cy="30" r="4" fill="#333"/></svg>`,
  },
  {
    name: "Bird",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="45" rx="20" ry="14" fill="#4fc3f7" stroke="#0288d1" stroke-width="2"/><ellipse cx="35" cy="30" rx="12" ry="10" fill="#4fc3f7" stroke="#0288d1" stroke-width="2"/><polygon points="22,28 14,32 22,35" fill="#ff9800"/><circle cx="38" cy="28" r="2" fill="#333"/><ellipse cx="50" cy="40" rx="12" ry="8" fill="#29b6f6" stroke="#0288d1" stroke-width="1.5"/><path d="M 55 50 Q 60 55 55 60" stroke="#ff9800" stroke-width="2" fill="none"/></svg>`,
  },
  {
    name: "Car",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100" height="60"><rect x="10" y="25" width="80" height="20" rx="4" fill="#e02020"/><rect x="22" y="15" width="56" height="15" rx="3" fill="#e02020"/><rect x="26" y="17" width="20" height="11" fill="#b3d9ff"/><rect x="50" y="17" width="24" height="11" fill="#b3d9ff"/><circle cx="25" cy="45" r="8" fill="#333"/><circle cx="25" cy="45" r="4" fill="#666"/><circle cx="75" cy="45" r="8" fill="#333"/><circle cx="75" cy="45" r="4" fill="#666"/></svg>`,
    width: 100,
    height: 60,
  },
  {
    name: "Heart",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path d="M 40 68 C 40 68 12 48 12 28 C 12 18 20 12 30 12 C 36 12 40 16 40 20 C 40 16 44 12 50 12 C 60 12 68 18 68 28 C 68 48 40 68 40 68 Z" fill="#ff4757" stroke="#e63946" stroke-width="2"/></svg>`,
  },
  {
    name: "Fish",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="38" cy="40" rx="24" ry="14" fill="#ff9800" stroke="#e65100" stroke-width="2"/><polygon points="14,40 2,28 2,52" fill="#ff9800" stroke="#e65100" stroke-width="2"/><circle cx="48" cy="36" r="4" fill="#fff"/><circle cx="48" cy="36" r="2" fill="#333"/><path d="M 28 40 Q 38 32 48 40 Q 38 48 28 40" fill="#e65100" opacity="0.3"/><path d="M 56 35 Q 62 40 56 45" stroke="#e65100" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    name: "Butterfly",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><line x1="40" y1="20" x2="40" y2="60" stroke="#333" stroke-width="2"/><ellipse cx="22" cy="34" rx="18" ry="14" fill="#ab47bc" stroke="#7b1fa2" stroke-width="2" transform="rotate(-20 22 34)"/><ellipse cx="58" cy="34" rx="18" ry="14" fill="#ab47bc" stroke="#7b1fa2" stroke-width="2" transform="rotate(20 58 34)"/><ellipse cx="24" cy="52" rx="14" ry="10" fill="#ce93d8" stroke="#7b1fa2" stroke-width="2" transform="rotate(-15 24 52)"/><ellipse cx="56" cy="52" rx="14" ry="10" fill="#ce93d8" stroke="#7b1fa2" stroke-width="2" transform="rotate(15 56 52)"/><circle cx="40" cy="22" r="4" fill="#333"/><line x1="40" y1="18" x2="35" y2="10" stroke="#333" stroke-width="1.5"/><line x1="40" y1="18" x2="45" y2="10" stroke="#333" stroke-width="1.5"/></svg>`,
  },
  {
    name: "Mushroom",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path d="M 16 38 Q 16 16 40 16 Q 64 16 64 38 Z" fill="#e53935" stroke="#c62828" stroke-width="2"/><circle cx="28" cy="28" r="5" fill="#fff"/><circle cx="48" cy="24" r="4" fill="#fff"/><circle cx="52" cy="34" r="3" fill="#fff"/><rect x="32" y="38" width="16" height="28" rx="3" fill="#f5deb3" stroke="#d4a76a" stroke-width="1.5"/></svg>`,
  },
  {
    name: "Rocket",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><polygon points="40,4 54,30 54,55 26,55 26,30" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="2"/><circle cx="40" cy="30" r="6" fill="#42a5f5" stroke="#1976d2" stroke-width="2"/><polygon points="26,45 16,60 26,55" fill="#ef5350" stroke="#c62828" stroke-width="2"/><polygon points="54,45 64,60 54,55" fill="#ef5350" stroke="#c62828" stroke-width="2"/><polygon points="34,55 38,72 32,72" fill="#ff9800"/><polygon points="46,55 48,68 42,68" fill="#ff9800"/></svg>`,
  },
  {
    name: "Flower",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="22" r="10" fill="#ec407a"/><circle cx="24" cy="34" r="10" fill="#ec407a"/><circle cx="56" cy="34" r="10" fill="#ec407a"/><circle cx="30" cy="48" r="10" fill="#ec407a"/><circle cx="50" cy="48" r="10" fill="#ec407a"/><circle cx="40" cy="36" r="7" fill="#ffeb3b"/><line x1="40" y1="48" x2="40" y2="70" stroke="#4caf50" stroke-width="3"/><path d="M 40 60 Q 30 55 26 62" stroke="#4caf50" stroke-width="2" fill="none"/></svg>`,
  },
  {
    name: "Planet",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="22" fill="#5c6bc0" stroke="#3949ab" stroke-width="2"/><ellipse cx="40" cy="40" rx="36" ry="10" fill="none" stroke="#ffb74d" stroke-width="3" transform="rotate(-20 40 40)"/><circle cx="32" cy="34" r="5" fill="#7986cb" opacity="0.7"/><circle cx="48" cy="44" r="4" fill="#7986cb" opacity="0.7"/></svg>`,
  },
  {
    name: "Dinosaur",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="42" cy="50" rx="22" ry="16" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><path d="M 20 40 Q 10 30 14 20 Q 20 14 28 20" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><polygon points="14,20 8,12 18,16" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><circle cx="20" cy="26" r="2" fill="#333"/><rect x="30" y="62" width="6" height="10" fill="#388e3c"/><rect x="48" y="62" width="6" height="10" fill="#388e3c"/><polygon points="56,45 72,38 70,52" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><polygon points="60,42 68,40 66,48" fill="#388e3c" opacity="0.5"/></svg>`,
  },
  {
    name: "Ghost2",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path d="M 16 32 Q 16 8 40 8 Q 64 8 64 32 L 64 72 L 56 64 L 48 72 L 40 64 L 32 72 L 24 64 L 16 72 Z" fill="#b3e5fc" stroke="#4fc3f7" stroke-width="2"/><circle cx="30" cy="30" r="5" fill="#333"/><circle cx="50" cy="30" r="5" fill="#333"/><path d="M 30 42 Q 40 48 50 42" stroke="#333" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    name: "Pacman",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path d="M 40 40 L 70 20 A 35 35 0 1 0 70 60 Z" fill="#ffd600" stroke="#f9a825" stroke-width="2"/><circle cx="34" cy="24" r="4" fill="#333"/></svg>`,
  },
  {
    name: "Boy",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="24" r="14" fill="#ffcc80"/><path d="M 26 18 Q 28 8 40 8 Q 52 8 54 18 Q 50 14 40 14 Q 30 14 26 18 Z" fill="#5d4037"/><circle cx="34" cy="24" r="2" fill="#333"/><circle cx="46" cy="24" r="2" fill="#333"/><path d="M 34 30 Q 40 34 46 30" stroke="#333" stroke-width="1.5" fill="none"/><rect x="28" y="38" width="24" height="28" rx="4" fill="#42a5f5"/><rect x="34" y="66" width="5" height="8" fill="#333"/><rect x="41" y="66" width="5" height="8" fill="#333"/><rect x="24" y="42" width="4" height="14" rx="2" fill="#42a5f5"/><rect x="52" y="42" width="4" height="14" rx="2" fill="#42a5f5"/></svg>`,
  },
  {
    name: "Girl",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="24" r="14" fill="#ffcc80"/><path d="M 24 22 Q 22 8 40 6 Q 58 8 56 22 Q 54 16 40 14 Q 26 16 24 22 Z" fill="#8d6e63"/><path d="M 26 30 Q 24 40 28 44 L 24 44 Q 22 36 26 30" fill="#8d6e63"/><path d="M 54 30 Q 56 40 52 44 L 56 44 Q 58 36 54 30" fill="#8d6e63"/><circle cx="34" cy="24" r="2" fill="#333"/><circle cx="46" cy="24" r="2" fill="#333"/><path d="M 34 30 Q 40 34 46 30" stroke="#e91e63" stroke-width="1.5" fill="none"/><path d="M 28 38 Q 40 34 52 38 L 50 66 L 30 66 Z" fill="#ec407a"/><rect x="34" y="66" width="5" height="8" fill="#e91e63"/><rect x="41" y="66" width="5" height="8" fill="#e91e63"/></svg>`,
  },
  {
    name: "Ninja",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="22" r="14" fill="#424242"/><rect x="28" y="20" width="24" height="6" fill="#ffcc80"/><circle cx="34" cy="23" r="1.5" fill="#333"/><circle cx="46" cy="23" r="1.5" fill="#333"/><path d="M 28 36 L 52 36 L 56 68 L 24 68 Z" fill="#616161"/><polygon points="40,36 36,50 44,50" fill="#424242"/><rect x="20" y="40" width="6" height="20" rx="2" fill="#616161"/><rect x="54" y="40" width="6" height="20" rx="2" fill="#616161"/><polygon points="56,44 68,36 66,48" fill="#f44336" opacity="0.8"/></svg>`,
  },
  {
    name: "Princess",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="26" r="13" fill="#ffcc80"/><circle cx="34" cy="26" r="2" fill="#333"/><circle cx="46" cy="26" r="2" fill="#333"/><path d="M 34 32 Q 40 36 46 32" stroke="#e91e63" stroke-width="1.5" fill="none"/><polygon points="26,18 30,6 34,18 40,4 46,18 50,6 54,18" fill="#ffd700" stroke="#f9a825" stroke-width="1.5"/><circle cx="40" cy="12" r="2" fill="#e91e63"/><path d="M 28 38 Q 40 34 52 38 L 54 68 L 26 68 Z" fill="#ce93d8"/><polygon points="40,38 36,55 44,55" fill="#ab47bc"/><rect x="34" y="68" width="5" height="6" fill="#ce93d8"/><rect x="41" y="68" width="5" height="6" fill="#ce93d8"/></svg>`,
  },
  {
    name: "Astronaut",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="26" r="16" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="2"/><rect x="30" y="22" width="20" height="10" rx="4" fill="#42a5f5" opacity="0.7"/><circle cx="36" cy="26" r="1.5" fill="#333"/><circle cx="44" cy="26" r="1.5" fill="#333"/><rect x="28" y="40" width="24" height="28" rx="4" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="2"/><circle cx="40" cy="52" r="4" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="1"/><rect x="24" y="44" width="4" height="16" rx="2" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="1"/><rect x="52" y="44" width="4" height="16" rx="2" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="1"/><rect x="34" y="68" width="5" height="6" fill="#bdbdbd"/><rect x="41" y="68" width="5" height="6" fill="#bdbdbd"/></svg>`,
  },
  {
    name: "Wizard",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="30" r="12" fill="#ffcc80"/><circle cx="35" cy="30" r="1.5" fill="#333"/><circle cx="45" cy="30" r="1.5" fill="#333"/><path d="M 36 36 Q 40 40 44 36" stroke="#333" stroke-width="1" fill="none"/><polygon points="40,2 50,22 30,22" fill="#5e35b1" stroke="#4527a0" stroke-width="2"/><circle cx="38" cy="10" r="2" fill="#ffd700"/><circle cx="44" cy="16" r="1.5" fill="#ffd700"/><path d="M 26 40 Q 40 36 54 40 L 58 70 L 22 70 Z" fill="#5e35b1"/><polygon points="40,40 36,56 44,56" fill="#4527a0"/><rect x="56" y="36" width="4" height="24" rx="2" fill="#8d6e63"/><circle cx="58" cy="34" r="6" fill="#66bb6a" opacity="0.7"/></svg>`,
  },
  {
    name: "Dog",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="48" rx="20" ry="16" fill="#a1887f"/><circle cx="40" cy="32" r="16" fill="#a1887f"/><polygon points="28,18 24,8 32,20" fill="#8d6e63"/><polygon points="52,20 56,8 48,18" fill="#8d6e63"/><circle cx="34" cy="30" r="2.5" fill="#333"/><circle cx="46" cy="30" r="2.5" fill="#333"/><circle cx="40" cy="38" r="3" fill="#333"/><path d="M 36 42 Q 40 46 44 42" stroke="#333" stroke-width="1.5" fill="none"/><ellipse cx="40" cy="40" rx="4" ry="3" fill="#6d4c41" opacity="0.4"/><path d="M 60 48 Q 68 50 66 58" fill="#8d6e63"/></svg>`,
  },
  {
    name: "Rabbit",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="50" rx="18" ry="16" fill="#f5f5f5"/><circle cx="40" cy="36" r="14" fill="#f5f5f5"/><ellipse cx="32" cy="16" rx="5" ry="14" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1"/><ellipse cx="48" cy="16" rx="5" ry="14" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1"/><ellipse cx="32" cy="18" rx="2.5" ry="9" fill="#f8bbd0"/><ellipse cx="48" cy="18" rx="2.5" ry="9" fill="#f8bbd0"/><circle cx="35" cy="34" r="2" fill="#333"/><circle cx="45" cy="34" r="2" fill="#333"/><circle cx="40" cy="40" r="2" fill="#ff80ab"/><path d="M 36 43 Q 40 46 44 43" stroke="#333" stroke-width="1" fill="none"/><circle cx="58" cy="50" r="6" fill="#f5f5f5"/></svg>`,
  },
  {
    name: "Panda",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="48" rx="22" ry="18" fill="#fff" stroke="#e0e0e0" stroke-width="1"/><circle cx="40" cy="32" r="18" fill="#fff" stroke="#e0e0e0" stroke-width="1"/><ellipse cx="30" cy="24" rx="6" ry="8" fill="#333"/><ellipse cx="50" cy="24" rx="6" ry="8" fill="#333"/><ellipse cx="33" cy="32" rx="4" ry="5" fill="#333"/><ellipse cx="47" cy="32" rx="4" ry="5" fill="#333"/><circle cx="34" cy="31" r="1.5" fill="#fff"/><circle cx="48" cy="31" r="1.5" fill="#fff"/><circle cx="40" cy="38" r="2" fill="#333"/><path d="M 36 42 Q 40 45 44 42" stroke="#333" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    name: "Tiger",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="48" rx="22" ry="18" fill="#ff9800"/><circle cx="40" cy="32" r="18" fill="#ff9800"/><polygon points="26,18 22,6 32,18" fill="#ff9800"/><polygon points="48,18 52,6 58,18" fill="#ff9800"/><polygon points="26,18 24,10 30,16" fill="#e65100"/><polygon points="48,18 52,10 56,16" fill="#e65100"/><path d="M 28 44 Q 30 48 28 52" stroke="#e65100" stroke-width="2" fill="none"/><path d="M 52 44 Q 50 48 52 52" stroke="#e65100" stroke-width="2" fill="none"/><path d="M 36 50 Q 40 54 44 50" stroke="#e65100" stroke-width="2" fill="none"/><circle cx="33" cy="30" r="2.5" fill="#333"/><circle cx="47" cy="30" r="2.5" fill="#333"/><circle cx="40" cy="38" r="2.5" fill="#333"/><path d="M 35 42 Q 40 45 45 42" stroke="#333" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    name: "Bear",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="50" rx="22" ry="18" fill="#8d6e63"/><circle cx="40" cy="34" r="18" fill="#8d6e63"/><circle cx="26" cy="20" r="7" fill="#8d6e63"/><circle cx="54" cy="20" r="7" fill="#8d6e63"/><circle cx="26" cy="20" r="3" fill="#6d4c41"/><circle cx="54" cy="20" r="3" fill="#6d4c41"/><circle cx="40" cy="38" r="6" fill="#d7ccc8"/><circle cx="34" cy="32" r="2" fill="#333"/><circle cx="46" cy="32" r="2" fill="#333"/><circle cx="40" cy="38" r="2" fill="#333"/><path d="M 36 44 Q 40 47 44 44" stroke="#333" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    name: "Frog",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="48" rx="24" ry="18" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><circle cx="28" cy="32" r="10" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><circle cx="52" cy="32" r="10" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><circle cx="28" cy="32" r="5" fill="#fff"/><circle cx="52" cy="32" r="5" fill="#fff"/><circle cx="28" cy="33" r="2.5" fill="#333"/><circle cx="52" cy="33" r="2.5" fill="#333"/><path d="M 28 50 Q 40 56 52 50" stroke="#388e3c" stroke-width="2" fill="none"/><path d="M 16 56 Q 12 60 16 64" fill="#66bb6a" stroke="#388e3c" stroke-width="1.5"/><path d="M 64 56 Q 68 60 64 64" fill="#66bb6a" stroke="#388e3c" stroke-width="1.5"/></svg>`,
  },
  {
    name: "Penguin",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="46" rx="20" ry="24" fill="#37474f"/><ellipse cx="40" cy="48" rx="14" ry="18" fill="#eceff1"/><circle cx="34" cy="28" r="2.5" fill="#333"/><circle cx="46" cy="28" r="2.5" fill="#333"/><polygon points="36,34 44,34 40,40" fill="#ff9800"/><polygon points="36,34 40,38 44,34" fill="#e65100"/><ellipse cx="40" cy="70" rx="10" ry="5" fill="#ff9800"/><ellipse cx="28" cy="46" rx="5" ry="12" fill="#37474f" transform="rotate(-15 28 46)"/><ellipse cx="52" cy="46" rx="5" ry="12" fill="#37474f" transform="rotate(15 52 46)"/></svg>`,
  },
  {
    name: "Turtle",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="44" rx="24" ry="18" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/><polygon points="40,28 28,38 28,50 40,60 52,50 52,38" fill="#66bb6a" stroke="#2e7d32" stroke-width="1.5"/><path d="M 40 28 L 40 60" stroke="#2e7d32" stroke-width="1"/><path d="M 28 38 L 52 38" stroke="#2e7d32" stroke-width="1"/><path d="M 28 50 L 52 50" stroke="#2e7d32" stroke-width="1"/><circle cx="40" cy="22" r="8" fill="#66bb6a" stroke="#2e7d32" stroke-width="1.5"/><circle cx="37" cy="21" r="1.5" fill="#333"/><circle cx="43" cy="21" r="1.5" fill="#333"/><path d="M 36 25 Q 40 27 44 25" stroke="#333" stroke-width="1" fill="none"/><ellipse cx="14" cy="44" rx="5" ry="6" fill="#66bb6a"/><ellipse cx="66" cy="44" rx="5" ry="6" fill="#66bb6a"/><ellipse cx="24" cy="60" rx="5" ry="5" fill="#66bb6a"/><ellipse cx="56" cy="60" rx="5" ry="5" fill="#66bb6a"/></svg>`,
  },
  {
    name: "Owl",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="44" rx="22" ry="24" fill="#795548"/><circle cx="40" cy="28" r="18" fill="#795548"/><polygon points="24,16 20,6 30,16" fill="#795548"/><polygon points="50,16 54,6 60,16" fill="#795548"/><circle cx="32" cy="28" r="8" fill="#fff"/><circle cx="48" cy="28" r="8" fill="#fff"/><circle cx="32" cy="28" r="4" fill="#333"/><circle cx="48" cy="28" r="4" fill="#333"/><circle cx="33" cy="27" r="1.5" fill="#fff"/><circle cx="49" cy="27" r="1.5" fill="#fff"/><polygon points="36,38 44,38 40,44" fill="#ff9800"/><path d="M 28 48 L 36 52" stroke="#5d4037" stroke-width="1.5"/><path d="M 52 48 L 44 52" stroke="#5d4037" stroke-width="1.5"/><path d="M 24 56 Q 40 64 56 56" stroke="#5d4037" stroke-width="1" fill="none" opacity="0.4"/></svg>`,
  },
  {
    name: "Lion",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="40" r="30" fill="#ffb74d"/><polygon points="40,8 46,2 42,10 50,4 46,12 54,8 50,16 58,14 52,20 60,22 52,26 60,32 50,30 56,38 46,34 48,44 40,38 32,44 34,34 24,38 30,30 20,32 28,26 20,22 28,20 22,14 30,16 26,8 34,12 30,4 38,10 34,2" fill="#ff9800" opacity="0.7"/><ellipse cx="40" cy="42" rx="20" ry="18" fill="#ffcc80"/><circle cx="33" cy="36" r="2.5" fill="#333"/><circle cx="47" cy="36" r="2.5" fill="#333"/><circle cx="40" cy="42" r="3" fill="#333"/><path d="M 35 47 Q 40 50 45 47" stroke="#333" stroke-width="1.5" fill="none"/><path d="M 30 44 Q 40 50 50 44 Q 45 54 40 54 Q 35 54 30 44" fill="#fff5e0" opacity="0.5"/></svg>`,
  },
  {
    name: "Monkey",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="48" rx="20" ry="18" fill="#8d6e63"/><circle cx="40" cy="34" r="18" fill="#8d6e63"/><circle cx="26" cy="24" r="7" fill="#a1887f"/><circle cx="54" cy="24" r="7" fill="#a1887f"/><circle cx="26" cy="24" r="4" fill="#d7ccc8"/><circle cx="54" cy="24" r="4" fill="#d7ccc8"/><ellipse cx="40" cy="40" rx="12" ry="10" fill="#d7ccc8"/><circle cx="35" cy="34" r="2" fill="#333"/><circle cx="45" cy="34" r="2" fill="#333"/><circle cx="40" cy="40" r="2" fill="#333"/><path d="M 36 44 Q 40 47 44 44" stroke="#333" stroke-width="1.5" fill="none"/><path d="M 58 50 Q 66 48 68 54 Q 64 56 58 54" fill="#8d6e63"/></svg>`,
  },
  {
    name: "Elephant",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="38" cy="44" rx="24" ry="20" fill="#90a4ae"/><circle cx="30" cy="28" r="12" fill="#90a4ae"/><circle cx="52" cy="28" r="10" fill="#90a4ae"/><ellipse cx="20" cy="24" rx="8" ry="10" fill="#78909c"/><ellipse cx="58" cy="24" rx="7" ry="9" fill="#78909c"/><circle cx="32" cy="30" r="2" fill="#333"/><circle cx="52" cy="28" r="2" fill="#333"/><path d="M 26 44 Q 18 52 22 62 Q 26 66 28 58" fill="#90a4ae"/><path d="M 50 52 Q 56 62 48 66 Q 44 60 46 54" fill="#90a4ae"/><rect x="26" y="62" width="5" height="10" fill="#78909c"/><rect x="46" y="62" width="5" height="10" fill="#78909c"/><path d="M 22 54 Q 16 56 20 60" stroke="#78909c" stroke-width="2" fill="none"/></svg>`,
  },
  {
    name: "Giraffe",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><rect x="32" y="10" width="16" height="30" rx="4" fill="#ffcc80"/><circle cx="40" cy="12" r="10" fill="#ffcc80"/><polygon points="35,4 37,0 39,6" fill="#ffcc80" stroke="#e6a85c" stroke-width="1"/><polygon points="41,6 43,0 45,4" fill="#ffcc80" stroke="#e6a85c" stroke-width="1"/><circle cx="37" cy="12" r="1.5" fill="#333"/><circle cx="43" cy="12" r="1.5" fill="#333"/><circle cx="32" cy="20" r="2.5" fill="#e6a85c" opacity="0.6"/><circle cx="42" cy="26" r="2" fill="#e6a85c" opacity="0.6"/><circle cx="36" cy="30" r="2.5" fill="#e6a85c" opacity="0.6"/><ellipse cx="40" cy="52" rx="22" ry="14" fill="#ffcc80"/><circle cx="30" cy="50" r="3" fill="#e6a85c" opacity="0.6"/><circle cx="44" cy="56" r="2.5" fill="#e6a85c" opacity="0.6"/><circle cx="50" cy="48" r="2" fill="#e6a85c" opacity="0.6"/><rect x="28" y="64" width="5" height="10" fill="#ffcc80"/><rect x="46" y="64" width="5" height="10" fill="#ffcc80"/><path d="M 24 46 Q 18 50 22 56" fill="#ffcc80"/></svg>`,
  },
  {
    name: "Snake",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path d="M 10 60 Q 24 50 24 60 Q 24 70 40 60 Q 56 50 56 60 Q 56 70 70 56" fill="none" stroke="#66bb6a" stroke-width="14" stroke-linecap="round"/><path d="M 10 60 Q 24 50 24 60 Q 24 70 40 60 Q 56 50 56 60 Q 56 70 70 56" fill="none" stroke="#4caf50" stroke-width="10" stroke-linecap="round"/><circle cx="68" cy="54" r="9" fill="#66bb6a"/><circle cx="71" cy="52" r="2" fill="#333"/><path d="M 74 56 L 78 54 M 74 58 L 78 60" stroke="#e53935" stroke-width="1.5"/><circle cx="30" cy="56" r="2" fill="#388e3c" opacity="0.5"/><circle cx="46" cy="56" r="2" fill="#388e3c" opacity="0.5"/></svg>`,
  },
  {
    name: "Octopus",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="32" r="20" fill="#ec407a" stroke="#c2185b" stroke-width="2"/><path d="M 22 42 Q 16 56 20 66 Q 24 62 24 52" fill="#ec407a"/><path d="M 32 48 Q 28 60 30 70 Q 34 66 34 54" fill="#ec407a"/><path d="M 40 48 Q 40 60 40 72 Q 44 68 44 54" fill="#ec407a"/><path d="M 48 48 Q 52 60 50 70 Q 46 66 46 54" fill="#ec407a"/><path d="M 58 42 Q 64 56 60 66 Q 56 62 56 52" fill="#ec407a"/><circle cx="33" cy="28" r="4" fill="#fff"/><circle cx="47" cy="28" r="4" fill="#fff"/><circle cx="33" cy="29" r="2" fill="#333"/><circle cx="47" cy="29" r="2" fill="#333"/><path d="M 34 38 Q 40 42 46 38" stroke="#333" stroke-width="1.5" fill="none"/><circle cx="26" cy="64" r="2" fill="#f8bbd0"/><circle cx="38" cy="68" r="2" fill="#f8bbd0"/><circle cx="52" cy="64" r="2" fill="#f8bbd0"/></svg>`,
  },
  {
    name: "Dragon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="36" cy="46" rx="22" ry="14" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><circle cx="50" cy="32" r="14" fill="#66bb6a" stroke="#388e3c" stroke-width="2"/><polygon points="40,20 36,10 44,18" fill="#66bb6a" stroke="#388e3c" stroke-width="1.5"/><polygon points="48,18 46,8 54,16" fill="#66bb6a" stroke="#388e3c" stroke-width="1.5"/><circle cx="54" cy="30" r="2.5" fill="#333"/><circle cx="56" cy="30" r="1" fill="#fff"/><polygon points="58,34 66,32 62,40" fill="#388e3c"/><polygon points="58,38 66,40 60,44" fill="#388e3c"/><path d="M 14 46 Q 4 40 8 50 Q 12 52 16 48" fill="#66bb6a" stroke="#388e3c" stroke-width="1.5"/><polygon points="10,48 4,46 6,52" fill="#66bb6a"/><path d="M 28 38 L 26 30 L 32 36" fill="#388e3c" opacity="0.5"/><path d="M 38 38 L 36 30 L 42 36" fill="#388e3c" opacity="0.5"/><path d="M 48 40 L 46 32 L 52 38" fill="#388e3c" opacity="0.5"/></svg>`,
  },
  {
    name: "Unicorn",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="38" cy="48" rx="20" ry="16" fill="#fff" stroke="#e0e0e0" stroke-width="2"/><circle cx="52" cy="32" r="16" fill="#fff" stroke="#e0e0e0" stroke-width="2"/><polygon points="58,16 62,2 66,18" fill="#ce93d8" stroke="#ab47bc" stroke-width="1.5"/><polygon points="60,14 62,6 64,16" fill="#ba68c8"/><path d="M 46 20 Q 42 10 48 8 Q 52 12 50 20" fill="#f48fb1" opacity="0.7"/><path d="M 44 22 Q 40 14 45 12 Q 49 16 47 22" fill="#fff176" opacity="0.7"/><circle cx="56" cy="30" r="2" fill="#333"/><circle cx="58" cy="30" r="0.8" fill="#fff"/><path d="M 52 38 Q 56 42 60 38" stroke="#333" stroke-width="1" fill="none"/><path d="M 16 48 Q 10 52 14 60 Q 18 56 18 50" fill="#fff" stroke="#e0e0e0" stroke-width="1.5"/><rect x="30" y="62" width="5" height="8" fill="#fff"/><rect x="50" y="62" width="5" height="8" fill="#fff"/></svg>`,
  },
  {
    name: "Alien",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><ellipse cx="40" cy="36" rx="18" ry="24" fill="#81c784" stroke="#388e3c" stroke-width="2"/><ellipse cx="32" cy="28" rx="6" ry="8" fill="#333"/><ellipse cx="48" cy="28" rx="6" ry="8" fill="#333"/><circle cx="33" cy="27" r="2" fill="#a5d6a7"/><circle cx="49" cy="27" r="2" fill="#a5d6a7"/><path d="M 34 42 Q 40 46 46 42" stroke="#388e3c" stroke-width="1.5" fill="none"/><ellipse cx="40" cy="60" rx="12" ry="6" fill="#81c784"/><path d="M 22 62 Q 18 66 22 70" fill="#81c784"/><path d="M 58 62 Q 62 66 58 70" fill="#81c784"/><circle cx="28" cy="50" r="1.5" fill="#388e3c" opacity="0.5"/><circle cx="52" cy="50" r="1.5" fill="#388e3c" opacity="0.5"/></svg>`,
  },
  {
    name: "Cake",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><rect x="16" y="42" width="48" height="26" rx="3" fill="#ffab91"/><rect x="16" y="42" width="48" height="6" fill="#ff8a65"/><rect x="12" y="36" width="56" height="8" rx="2" fill="#fff3e0" stroke="#ffcc80" stroke-width="1"/><circle cx="26" cy="40" r="2" fill="#ec407a"/><circle cx="40" cy="40" r="2" fill="#ec407a"/><circle cx="54" cy="40" r="2" fill="#ec407a"/><rect x="37" y="22" width="6" height="14" fill="#ffd700"/><rect x="38" y="18" width="4" height="6" fill="#ff6f00"/><circle cx="40" cy="14" r="3" fill="#ffeb3b"/><circle cx="40" cy="50" r="2" fill="#e91e63" opacity="0.5"/><circle cx="54" cy="54" r="2" fill="#e91e63" opacity="0.5"/><circle cx="28" cy="56" r="2" fill="#e91e63" opacity="0.5"/></svg>`,
  },
  {
    name: "Pizza",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><polygon points="40,4 72,68 8,68" fill="#ffd54f" stroke="#f9a825" stroke-width="2"/><polygon points="40,12 66,64 14,64" fill="#ffab91"/><circle cx="30" cy="36" r="5" fill="#e53935"/><circle cx="50" cy="40" r="4" fill="#e53935"/><circle cx="38" cy="52" r="5" fill="#e53935"/><circle cx="22" cy="56" r="3" fill="#e53935"/><circle cx="54" cy="56" r="3" fill="#e53935"/><circle cx="34" cy="30" r="2" fill="#fff" opacity="0.7"/><circle cx="48" cy="46" r="1.5" fill="#fff" opacity="0.7"/><path d="M 40 4 L 40 68" stroke="#e65100" stroke-width="0.5" opacity="0.3"/></svg>`,
  },
];

const BUILTIN_BACKDROPS: { name: string; svg: string }[] = [
  {
    name: "Sky",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#87ceeb"/><circle cx="380" cy="60" r="30" fill="#fff8dc" opacity="0.8"/><polygon points="0,300 100,250 180,290 280,240 380,280 480,260 480,360 0,360" fill="#8bc34a" opacity="0.5"/></svg>`,
  },
  {
    name: "Space",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#0a0a2e"/><circle cx="50" cy="40" r="1.5" fill="#fff"/><circle cx="120" cy="80" r="1" fill="#fff"/><circle cx="200" cy="30" r="2" fill="#fff"/><circle cx="300" cy="60" r="1.5" fill="#fff"/><circle cx="400" cy="100" r="1" fill="#fff"/><circle cx="80" cy="200" r="1" fill="#fff"/><circle cx="350" cy="250" r="2" fill="#fff"/><circle cx="450" cy="200" r="1.5" fill="#fff"/><circle cx="250" cy="300" r="1" fill="#fff"/><circle cx="160" cy="280" r="1.5" fill="#fff"/><circle cx="380" cy="160" r="1" fill="#fff"/><circle cx="30" cy="320" r="1" fill="#fff"/></svg>`,
  },
  {
    name: "Stage",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#2d2d2d"/><rect x="60" y="40" width="360" height="280" fill="#8b4513"/><rect x="80" y="60" width="320" height="240" fill="#deb887"/><circle cx="240" cy="120" r="30" fill="#ffd700" opacity="0.3"/></svg>`,
  },
  {
    name: "Forest",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="200" fill="#87ceeb"/><rect y="200" width="480" height="160" fill="#556b2f"/><polygon points="50,200 90,120 130,200" fill="#228b22"/><polygon points="120,200 170,100 220,200" fill="#2e8b2e"/><polygon points="320,200 370,110 420,200" fill="#228b22"/><polygon points="380,200 430,130 470,200" fill="#2e8b2e"/></svg>`,
  },
  {
    name: "City",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#ff6b6b"/><rect y="240" width="480" height="120" fill="#444"/><rect x="30" y="140" width="60" height="100" fill="#555"/><rect x="100" y="100" width="70" height="140" fill="#666"/><rect x="180" y="160" width="50" height="80" fill="#555"/><rect x="240" y="80" width="80" height="160" fill="#777"/><rect x="330" y="130" width="60" height="110" fill="#555"/><rect x="400" y="110" width="60" height="130" fill="#666"/></svg>`,
  },
  {
    name: "Blank",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#fff"/></svg>`,
  },
  {
    name: "Beach",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="180" fill="#4fc3f7"/><rect y="180" width="480" height="80" fill="#26c6da" opacity="0.6"/><rect y="240" width="480" height="120" fill="#fdd835"/><circle cx="90" cy="50" r="25" fill="#fff" opacity="0.8"/><circle cx="160" cy="40" r="20" fill="#fff" opacity="0.7"/><polygon points="380,240 370,180 390,180" fill="#6d4c41"/><polygon points="380,240 390,180 410,190" fill="#6d4c41"/><circle cx="380" cy="170" r="22" fill="#66bb6a"/><rect x="376" y="170" width="8" height="70" fill="#6d4c41"/></svg>`,
  },
  {
    name: "Underwater",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#0277bd"/><rect width="480" height="360" fill="#0288d1" opacity="0.5"/><path d="M 0 280 Q 80 260 160 280 Q 240 300 320 280 Q 400 260 480 280 L 480 360 L 0 360 Z" fill="#1b5e20" opacity="0.6"/><path d="M 40 320 L 40 280 L 44 285 L 44 320" stroke="#2e7d32" stroke-width="2" fill="#2e7d32"/><path d="M 120 325 L 120 290 L 124 295 L 124 325" stroke="#2e7d32" stroke-width="2" fill="#2e7d32"/><path d="M 300 320 L 300 270 L 304 275 L 304 320" stroke="#2e7d32" stroke-width="2" fill="#2e7d32"/><path d="M 400 325 L 400 285 L 404 290 L 404 325" stroke="#2e7d32" stroke-width="2" fill="#2e7d32"/><circle cx="60" cy="60" r="8" fill="#fff" opacity="0.3"/><circle cx="200" cy="100" r="6" fill="#fff" opacity="0.2"/><circle cx="340" cy="50" r="10" fill="#fff" opacity="0.3"/><circle cx="420" cy="120" r="5" fill="#fff" opacity="0.2"/></svg>`,
  },
  {
    name: "Garden",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="220" fill="#81c784"/><rect y="220" width="480" height="140" fill="#558b2f"/><circle cx="80" cy="180" r="12" fill="#ec407a"/><circle cx="80" cy="178" r="5" fill="#ffeb3b"/><rect x="78" y="180" width="4" height="30" fill="#4caf50"/><circle cx="200" cy="160" r="10" fill="#ec407a"/><circle cx="200" cy="158" r="4" fill="#ffeb3b"/><rect x="198" y="160" width="4" height="25" fill="#4caf50"/><circle cx="340" cy="175" r="14" fill="#ec407a"/><circle cx="340" cy="173" r="6" fill="#ffeb3b"/><rect x="338" y="175" width="4" height="32" fill="#4caf50"/><circle cx="50" cy="50" r="20" fill="#fff8dc" opacity="0.8"/><circle cx="120" cy="60" r="16" fill="#fff" opacity="0.7"/><circle cx="280" cy="40" r="22" fill="#fff" opacity="0.8"/><circle cx="400" cy="70" r="18" fill="#fff" opacity="0.7"/></svg>`,
  },
  {
    name: "Desert",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="200" fill="#ffb74d"/><rect y="200" width="480" height="160" fill="#ffd54f"/><path d="M 0 240 Q 120 200 240 240 Q 360 270 480 230 L 480 360 L 0 360 Z" fill="#f9a825" opacity="0.5"/><circle cx="400" cy="50" r="30" fill="#ffeb3b" opacity="0.9"/><polygon points="80,200 100,150 120,200" fill="#8d6e63" opacity="0.4"/><polygon points="100,200 120,160 140,200" fill="#8d6e63" opacity="0.3"/></svg>`,
  },
  {
    name: "Night",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#1a237e"/><circle cx="380" cy="60" r="24" fill="#fffde7" opacity="0.9"/><circle cx="370" cy="52" r="20" fill="#1a237e"/><circle cx="50" cy="40" r="1" fill="#fff"/><circle cx="120" cy="80" r="1" fill="#fff"/><circle cx="200" cy="30" r="1.5" fill="#fff"/><circle cx="300" cy="100" r="1" fill="#fff"/><circle cx="80" cy="120" r="1" fill="#fff"/><circle cx="250" cy="160" r="1" fill="#fff"/><circle cx="160" cy="50" r="1" fill="#fff"/><circle cx="440" cy="180" r="1.5" fill="#fff"/><polygon points="0,300 80,220 160,290 240,230 320,280 400,240 480,270 480,360 0,360" fill="#0d1444"/></svg>`,
  },
  {
    name: "Snow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="220" fill="#b3e5fc"/><rect y="220" width="480" height="140" fill="#eceff1"/><polygon points="0,220 100,160 200,220" fill="#90a4ae" opacity="0.5"/><polygon points="160,220 260,140 360,220" fill="#90a4ae" opacity="0.6"/><polygon points="320,220 400,170 480,220" fill="#90a4ae" opacity="0.5"/><circle cx="80" cy="240" r="4" fill="#fff"/><circle cx="200" cy="260" r="3" fill="#fff"/><circle cx="340" cy="245" r="5" fill="#fff"/><circle cx="420" cy="270" r="4" fill="#fff"/><circle cx="120" cy="290" r="3" fill="#fff"/><circle cx="280" cy="300" r="4" fill="#fff"/><polygon points="380,220 370,200 390,200 380,180 400,190 390,210" fill="#4caf50" opacity="0.3"/></svg>`,
  },
  {
    name: "Castle",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#7986cb"/><rect y="240" width="480" height="120" fill="#558b2f"/><rect x="120" y="120" width="240" height="140" fill="#90a4ae"/><rect x="100" y="100" width="40" height="40" fill="#78909c"/><rect x="100" y="100" width="10" height="40" fill="#546e7a"/><rect x="120" y="100" width="10" height="40" fill="#546e7a"/><rect x="130" y="100" width="10" height="40" fill="#546e7a"/><rect x="340" y="100" width="40" height="40" fill="#78909c"/><rect x="340" y="100" width="10" height="40" fill="#546e7a"/><rect x="360" y="100" width="10" height="40" fill="#546e7a"/><rect x="370" y="100" width="10" height="40" fill="#546e7a"/><rect x="220" y="90" width="40" height="50" fill="#78909c"/><rect x="232" y="70" width="16" height="30" fill="#ef5350"/><rect x="180" y="160" width="30" height="60" fill="#5d4037"/><rect x="270" y="160" width="30" height="60" fill="#5d4037"/></svg>`,
  },
  {
    name: "Rainbow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><rect width="480" height="360" fill="#e1f5fe"/><path d="M 40 280 A 200 200 0 0 1 440 280" fill="none" stroke="#ef5350" stroke-width="14"/><path d="M 54 280 A 186 186 0 0 1 426 280" fill="none" stroke="#ff9800" stroke-width="14"/><path d="M 68 280 A 172 172 0 0 1 412 280" fill="none" stroke="#ffeb3b" stroke-width="14"/><path d="M 82 280 A 158 158 0 0 1 398 280" fill="none" stroke="#4caf50" stroke-width="14"/><path d="M 96 280 A 144 144 0 0 1 384 280" fill="none" stroke="#42a5f5" stroke-width="14"/><path d="M 110 280 A 130 130 0 0 1 370 280" fill="none" stroke="#7e57c2" stroke-width="14"/><rect y="280" width="480" height="80" fill="#a5d6a7"/><circle cx="70" cy="50" r="25" fill="#fff8dc" opacity="0.8"/><circle cx="160" cy="40" r="20" fill="#fff" opacity="0.7"/></svg>`,
  },
];

export function getBuiltinSprites() {
  return BUILTIN_SPRITES.map((s) => ({
    name: s.name,
    dataUrl: `data:image/svg+xml;base64,${btoa(s.svg)}`,
    width: s.width ?? 80,
    height: s.height ?? 80,
  }));
}

export function getBuiltinBackdrops() {
  return BUILTIN_BACKDROPS.map((b) => ({
    name: b.name,
    dataUrl: `data:image/svg+xml;base64,${btoa(b.svg)}`,
  }));
}

export function svgToCostume(name: string, svg: string, width = 80, height = 80) {
  return {
    id: generateId("costume"),
    name,
    dataUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    width,
    height,
  };
}
