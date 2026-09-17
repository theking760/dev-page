import { useState, useEffect } from 'react';
import { Code2, Github } from 'lucide-react';

const SECTIONS = [
  { id: 'hero', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'PROJECTS' },
];

export default function DevSidebar() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActive(s.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-border bg-background z-40">
        <div className="p-8 border-b border-border">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-bold tracking-tight">techno.dev</span>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground mt-1">full-stack dev</div>
        </div>
        <nav className="flex-1 p-8 space-y-3">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`block font-mono text-xs tracking-widest transition-colors ${
                active === s.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-border">
          <a
            href="https://github.com/theking760"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="font-mono text-xs">GITHUB</span>
          </a>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur flex items-center px-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-bold">techno.dev</span>
        </div>
      </header>
    </>
  );
}
