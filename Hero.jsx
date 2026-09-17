import { motion } from 'framer-motion';
import { Github, ArrowDown, Mail } from 'lucide-react';

const STACK = ['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL'];

export default function Hero() {
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 sm:px-12 lg:px-20 pt-20 lg:pt-0"
    >
      <div className="max-w-6xl w-full mx-auto grid gap-12 lg:gap-16 items-center">
        {/* Left: Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="font-mono text-xs text-primary mb-6 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-primary" />
            </span>
            available for work
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Hi, I'm <span className="text-primary">Techno&nbsp;Dev</span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-muted-foreground font-heading">
            Game Developer · Python & Pygame
          </p>

          <p className="mt-6 text-sm sm:text-base text-muted-foreground/80 leading-relaxed max-w-lg">
            I build games with Python and Pygame — turning ideas into playable,
            polished experiences from quick prototypes to finished releases. I
            care about the details that make a game feel good to play.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium text-sm px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              View Projects <ArrowDown className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/theking760"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-5 py-2.5 rounded-md hover:bg-card transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
