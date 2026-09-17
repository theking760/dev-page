import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminProjectForm({ project, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: project?.title || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    tech_stack: project?.tech_stack || [],
    problem: project?.problem || '',
    solution: project?.solution || '',
    repo_url: project?.repo_url || '',
    demo_url: project?.demo_url || '',
    image_url: project?.image_url || '',
    is_visible: project?.is_visible ?? false,
  });
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !form.tech_stack.includes(trimmed)) {
      update('tech_stack', [...form.tech_stack, trimmed]);
    }
    setTechInput('');
  };

  const removeTech = (tech) => {
    update('tech_stack', form.tech_stack.filter((t) => t !== tech));
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      update('image_url', file_url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form };
      if (project?.id) {
        await base44.entities.Project.update(project.id, data);
      } else {
        await base44.entities.Project.create(data);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          required
          placeholder="Project name"
        />
      </div>

      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={form.tagline}
          onChange={(e) => update('tagline', e.target.value)}
          placeholder="One-line summary"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          placeholder="Full project description"
        />
      </div>

      <div className="space-y-2">
        <Label>Tech Stack</Label>
        <Input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTech();
            }
          }}
          placeholder="Type and press Enter..."
        />
        {form.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tech_stack.map((tech, i) => (
              <span
                key={i}
                className="flex items-center gap-1 font-mono text-xs px-2 py-1 border border-border"
              >
                {tech}
                <button type="button" onClick={() => removeTech(tech)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Problem</Label>
          <Textarea
            value={form.problem}
            onChange={(e) => update('problem', e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Solution</Label>
          <Textarea
            value={form.solution}
            onChange={(e) => update('solution', e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Repo URL</Label>
          <Input
            value={form.repo_url}
            onChange={(e) => update('repo_url', e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label>Demo URL</Label>
          <Input
            value={form.demo_url}
            onChange={(e) => update('demo_url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          {form.image_url && (
            <span className="text-xs text-muted-foreground font-mono">image_set ✓</span>
          )}
        </div>
        {form.image_url && (
          <div className="mt-2 aspect-video w-full max-w-xs overflow-hidden border border-border">
            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.is_visible}
          onCheckedChange={(v) => update('is_visible', v)}
        />
        <Label>Visible to public</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {project ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
