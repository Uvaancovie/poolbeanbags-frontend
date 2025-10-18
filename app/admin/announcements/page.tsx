"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Card from '../../../components/ui/Card';
import { API_BASE } from 'lib/api';

type Announcement = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  body_richtext?: string;
  banner_image?: string;
  published_at?: string;
  start_at?: string;
  end_at?: string;
  is_featured: boolean;
  created_at: string;
};

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form state
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [bodyRichtext, setBodyRichtext] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  async function fetchAnnouncements() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/announcements`);
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.user.role !== 'admin') {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
      return;
    }

    setAuthLoading(false);
    fetchAnnouncements();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Please log in first');
        router.push('/admin/login');
        return;
      }

      const url = editingAnnouncement
        ? `${API_BASE}/api/admin/announcements/${editingAnnouncement.id}`
        : `${API_BASE}/api/admin/announcements`;

      const method = editingAnnouncement ? 'PUT' : 'POST';

      // Use JSON (skip FormData for now)
      const body = {
        slug,
        title,
        excerpt,
        body_richtext: bodyRichtext,
        start_at: startAt || null,
        end_at: endAt || null,
        is_featured: isFeatured
      };
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (res.ok) {
        fetchAnnouncements();
        resetForm();
        setShowCreateForm(false);
        setEditingAnnouncement(null);
      } else {
        alert('Failed to save announcement');
      }
    } catch (err) {
      console.error('Error saving announcement:', err);
      alert('Error saving announcement');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Please log in first');
        router.push('/admin/login');
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (res.ok) {
        fetchAnnouncements();
      } else {
        alert('Failed to delete announcement');
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('Error deleting announcement');
    }
  }

  function resetForm() {
    setSlug('');
    setTitle('');
    setExcerpt('');
    setBodyRichtext('');
    setStartAt('');
    setEndAt('');
    setIsFeatured(false);
    setBannerImageFile(null);
    setBannerImagePreview(null);
  }

  function startEdit(announcement: Announcement) {
    setEditingAnnouncement(announcement);
    setSlug(announcement.slug);
    setTitle(announcement.title);
    setExcerpt(announcement.excerpt || '');
    setBodyRichtext(announcement.body_richtext || '');
    setStartAt(announcement.start_at ? new Date(announcement.start_at).toISOString().slice(0, 16) : '');
    setEndAt(announcement.end_at ? new Date(announcement.end_at).toISOString().slice(0, 16) : '');
    setIsFeatured(announcement.is_featured);
    setShowCreateForm(true);
  }

  function formatDate(dateString?: string) {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-4xl font-bold text-base-content mb-4">Loading Announcements...</h1>
            <progress className="progress progress-primary w-56 mx-auto"></progress>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-2">Announcement Management</h1>
            <p className="text-base-content/60">Create and manage promotional announcements and specials</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingAnnouncement(null);
              setShowCreateForm(!showCreateForm);
            }}
            className="bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {showCreateForm ? 'Cancel' : '+ New Announcement'}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="p-8 mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-base-content mb-6">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Title *</label>
                  <Input
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder="Announcement title"
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Slug *</label>
                  <Input
                    value={slug}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-base-content/50">Used in announcement URLs</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">Excerpt</label>
                <Textarea
                  value={excerpt}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the announcement..."
                  className="w-full min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">Full Content (Rich Text)</label>
                <Textarea
                  value={bodyRichtext}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBodyRichtext(e.target.value)}
                  placeholder="Detailed announcement content..."
                  className="w-full min-h-[120px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Start Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={startAt}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartAt(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">End Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndAt(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">Banner Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const f = e.target.files?.[0] || null;
                      setBannerImageFile(f);
                      if (f) setBannerImagePreview(URL.createObjectURL(f)); else setBannerImagePreview(null);
                    }}
                    className="file-input file-input-bordered w-full file-input-primary"
                  />
                </div>
                {bannerImagePreview && (
                  <div className="mt-4 relative group">
                    <img
                      src={bannerImagePreview}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Banner Preview</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-base-content">
                  Mark as Featured
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      {editingAnnouncement ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingAnnouncement ? 'Update Announcement' : 'Create Announcement'
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingAnnouncement(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border-2 border-base-300 hover:border-base-400 rounded-lg transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-6">
          {announcements.length === 0 ? (
            <Card className="p-12 text-center bg-white/50 backdrop-blur-sm">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No announcements yet</h3>
              <p className="text-base-content/60">Create your first announcement to promote specials and updates.</p>
            </Card>
          ) : (
            announcements.map(announcement => (
              <Card key={announcement.id} className="p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-base-content">{announcement.title}</h3>
                      {announcement.is_featured && (
                        <span className="badge badge-warning badge-sm">Featured</span>
                      )}
                    </div>
                    <p className="text-base-content/70 mb-3">{announcement.excerpt || 'No excerpt'}</p>
                    <div className="flex items-center gap-6 text-sm text-base-content/50">
                      <span>Slug: {announcement.slug}</span>
                      <span>Created: {formatDate(announcement.created_at)}</span>
                      <span>Start: {formatDate(announcement.start_at)}</span>
                      <span>End: {formatDate(announcement.end_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => startEdit(announcement)}
                      variant="outline"
                      className="btn-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(announcement.id)}
                      variant="outline"
                      className="btn-sm btn-error"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}