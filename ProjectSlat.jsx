import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Github } from 'lucide-react';
import { Image as ContentImage } from '@/components/ui/image';

export default function ProjectSlat({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="group relative border-b border-border">
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 bg-primary transition-opacity duration-300 ${
          expanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
        }`}
      />

      <button
        onClick={() => setExpanded(!expanded)}
        className="relative w-full flex items-center gap-4 sm:gap-6 py-6 sm:py-7 px-6 sm:px-12 text-left hover:bg-card/50 transition-colors"
      >
        <span className="font-mono text-xs text-muted-foreground/40 hidden sm:block w-6 shrink-0">
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.tagline && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 truncate">
              {project.tagline}
            </p>
          )}
        </div>
        {project.tech_stack?.length > 0 && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {project.tech_stack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
            expanded ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 sm:px-12 pb-10 sm:pl-12 sm:pr-12 grid md:grid-cols-2 gap-6 sm:gap-8">
              {project.image_url && (
                <div className="aspect-video overflow-hidden rounded-lg border border-border">
                  <ContentImage
                    src={project.image_url}
                    className="w-full h-full"
                    fittingType="fill"
                  />
                </div>
              )}
              <div className="space-y-5">
                {project.description && (
                  <div>
                    <div className="font-mono text-[10px] text-primary mb-1.5 tracking-wider">
                      OVERVIEW
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                )}
                {project.problem && (
                  <div>
                    <div className="font-mono text-[10px] text-primary mb-1.5 tracking-wider">
                      PROBLEM
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <div className="font-mono text-[10px] text-primary mb-1.5 tracking-wider">
                      SOLUTION
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
                {project.tech_stack?.length > 0 && (
                  <div>
                    <div className="font-mono text-[10px] text-primary mb-1.5 tracking-wider">
                      STACK
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, i) => (
                        <span
                          key={i}
                          className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-4 pt-1">
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-4 h-4" /> Repository
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
