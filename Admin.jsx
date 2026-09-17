import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { isAdminAuthenticated, clearAdminSession } from '@/lib/adminAuth';
import AdminProjectForm from '@/components/dev/AdminProjectForm';

export default function Admin() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [authed, setAuthed] = useState(() => isAdminAuthenticated());

  useEffect(() => {
    if (!authed) {
      navigate('/', { replace: true });
      return;
    }
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const all = await base44.entities.Project.list('-display_order', 100);
      setProjects(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (project) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, is_visible: !p.is_visible } : p
      )
    );
    try {
      await base44.entities.Project.update(project.id, {
        is_visible: !project.is_visible,
      });
    } catch {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_visible: project.is_visible } : p
        )
      );
    }
  };

  const handleDelete = async (project) => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    await base44.entities.Project.delete(project.id);
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate('/');
  };

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setDialogOpen(true);
  };
  const handleSaved = () => {
    setDialogOpen(false);
    setEditing(null);
    loadProjects();
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="px-4 sm:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div className="font-mono text-sm font-bold text-primary">
              {'> techno.dev / admin'}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="px-4 sm:px-12 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-mono text-xl sm:text-2xl font-bold">Projects</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {projects.length} total · {projects.filter((p) => p.is_visible).length} visible
            </p>
          </div>
          <Button onClick={openNew}>
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <div className="font-mono text-xs text-muted-foreground">
              {'> no projects found'}
            </div>
            <Button onClick={openNew} className="mt-4">
              <Plus className="w-4 h-4" /> Create your first project
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-border bg-card overflow-hidden"
              >
                <div className="aspect-video bg-muted relative">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-xs text-muted-foreground/30">
                        no image
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute top-2 right-2 font-mono text-[9px] px-2 py-1 ${
                      project.is_visible
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background/80 text-muted-foreground'
                    }`}
                  >
                    {project.is_visible ? 'VISIBLE' : 'HIDDEN'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-mono text-sm font-bold truncate">{project.title}</h3>
                  {project.tagline && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {project.tagline}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(project)}>
                      <Pencil className="w-3 h-3" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                      {project.is_visible ? (
                        <Eye className="w-3 h-3 text-primary" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      )}
                      <Switch
                        checked={project.is_visible}
                        onCheckedChange={() => toggleVisibility(project)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-mono">
              {editing ? 'Edit Project' : 'New Project'}
            </DialogTitle>
          </DialogHeader>
          <AdminProjectForm
            project={editing}
            onSaved={handleSaved}
            onCancel={() => {
              setDialogOpen(false);
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
