import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DevSidebar from '@/components/dev/DevSidebar';
import Hero from '@/components/dev/Hero';
import ProjectSlat from '@/components/dev/ProjectSlat';

const FOCUS_AREAS = [
  { title: 'Game Development', desc: 'Building playable experiences with Python & Pygame.' },
  { title: 'Prototyping', desc: 'Turning ideas into working games, fast.' },
  { title: 'Polish & Feel', desc: 'Sweating the details that make a game fun to play.' },
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    loadProjects();
    const unsubscribe = base44.entities.Project.subscribe(() => loadProjects());
    return unsubscribe;
  }, []);

  useEffect(() => {
    const onScroll = () => setShowAdmin(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const loadProjects = async () => {
    try {
      const all = await base44.entities.Project.list('-display_order', 50);
      setProjects(all.filter((p) => p.is_visible));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DevSidebar />

      <main className="lg:ml-64">
        <div className="pt-14 lg:pt-0">
          <Hero />

          {/* About */}
          <section id="about" className="py-16 sm:py-24 px-6 sm:px-12 lg:px-20 border-t border-border">
            <div className="max-w-6xl mx-auto">
              <div className="font-mono text-xs text-primary mb-2">02 / about</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-6">A bit about me</h2>
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl">
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    I'm a game developer who builds with Python and Pygame. Most
                    of my projects start as a quick prototype and grow into
                    polished, playable releases.
                  </p>
                  <p>
                    My approach is simple: understand the game you want to make,
                    build something real, iterate fast, and sweat the details that
                    make it feel good to play. Python and Pygame are where I'm most
                    at home.
                  </p>
                </div>
                <div className="space-y-3">
                  {FOCUS_AREAS.map((f) => (
                    <div
                      key={f.title}
                      className="p-4 rounded-lg border border-border bg-card/50 hover:border-primary/40 transition-colors"
                    >
                      <div className="font-heading text-sm font-semibold text-foreground">
                        {f.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="py-16 sm:py-24 border-t border-border">
            <div className="px-6 sm:px-12 lg:px-20 mb-10 max-w-6xl mx-auto">
              <div className="font-mono text-xs text-primary mb-2">03 / projects</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold">Selected work</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Things I've built. Click any project to see the details.
              </p>
            </div>

            {loading ? (
              <div className="px-6 sm:px-12 py-8">
                <div className="font-mono text-xs text-muted-foreground animate-pulse">
                  loading projects...
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="px-6 sm:px-12 py-16 text-center border-t border-border">
                <div className="font-mono text-xs text-muted-foreground/40">
                  no projects on display yet — check back soon.
                </div>
              </div>
            ) : (
              <div className="border-t border-border">
                {projects.map((project, i) => (
                  <ProjectSlat key={project.id} project={project} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* Contact */}
          <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-20 border-t border-border">
            <div className="max-w-6xl mx-auto text-center">
              <div className="font-mono text-xs text-primary mb-2">04 / contact</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                Let's build something
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                Open to interesting projects, collaborations, and conversations about
                software. Feel free to reach out.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="mailto:hello@techno.dev"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium text-sm px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Get in touch
                </a>
                <a
                  href="https://github.com/theking760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-5 py-2.5 rounded-md hover:bg-card transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          </section>

          <footer className="border-t border-border px-6 sm:px-12 py-10">
            <div className="font-mono text-[10px] text-muted-foreground/30">
              © {new Date().getFullYear()} techno.dev · built with care
            </div>
          </footer>

        </div>
      </main>

      <Link
        to="/admin-login"
        className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-500 shadow-lg ${
          showAdmin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Lock className="w-3.5 h-3.5" /> Admin
      </Link>
    </div>
  );
}
