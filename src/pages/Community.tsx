import { useState, useEffect } from "react";
import { Users, TrendingUp, MessageCircle, Heart, Plus, Search, Send, Trash2, Image, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null } | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null } | null;
}

const Community = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"story" | "discussion">("story");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInput, setCommentInput] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, stories: 0, discussions: 0, likes: 0 });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching posts:", postsError);
        setLoading(false);
        return;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setStats({ total: 0, stories: 0, discussions: 0, likes: 0 });
        setLoading(false);
        return;
      }

      // Fetch profiles for all user_ids
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap: Record<string, string | null> = {};
      profilesData?.forEach(p => { profileMap[p.user_id] = p.display_name; });

      const enrichedPosts: Post[] = postsData.map(p => ({
        ...p,
        profiles: { display_name: profileMap[p.user_id] || null },
      }));

      setPosts(enrichedPosts);
      setStats({
        total: enrichedPosts.length,
        stories: enrichedPosts.filter(p => p.category === "story").length,
        discussions: enrichedPosts.filter(p => p.category === "discussion").length,
        likes: enrichedPosts.reduce((sum, p) => sum + p.likes_count, 0),
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("post_likes").select("post_id").eq("user_id", user.id)
      .then(({ data }) => { if (data) setLikedPosts(new Set(data.map(l => l.post_id))); });
  }, [user]);

  const handleImageSelect = (file: File | null) => {
    setNewImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const createPost = async () => {
    if (!user) { toast({ title: "Please sign in to post", variant: "destructive" }); return; }
    if (!newTitle.trim() || !newContent.trim()) {
      toast({ title: "Title and content are required", variant: "destructive" });
      return;
    }
    setCreating(true);
    let imageUrl: string | null = null;

    if (newImage) {
      const ext = newImage.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("community-images").upload(path, newImage);
      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({ title: "Image upload failed", description: uploadError.message, variant: "destructive" });
      } else {
        const { data: urlData } = supabase.storage.from("community-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("community_posts").insert({
      user_id: user.id,
      title: newTitle,
      content: newContent,
      image_url: imageUrl,
      category: tab,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      toast({ title: "Failed to create post", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Post created successfully!" });
    }

    setNewTitle("");
    setNewContent("");
    setNewImage(null);
    setImagePreview(null);
    setShowCreateModal(false);
    await fetchPosts();
    setCreating(false);
  };

  const toggleLike = async (postId: string) => {
    if (!user) { toast({ title: "Please sign in to like", variant: "destructive" }); return; }
    if (likedPosts.has(postId)) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      setLikedPosts(prev => { const n = new Set(prev); n.delete(postId); return n; });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p));
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      setLikedPosts(prev => new Set(prev).add(postId));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
    }
  };

  const loadComments = async (postId: string) => {
    const { data: commentsData } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at");

    if (commentsData && commentsData.length > 0) {
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap: Record<string, string | null> = {};
      profilesData?.forEach(p => { profileMap[p.user_id] = p.display_name; });

      const enriched: Comment[] = commentsData.map(c => ({
        ...c,
        profiles: { display_name: profileMap[c.user_id] || null },
      }));
      setComments(prev => ({ ...prev, [postId]: enriched }));
    } else {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  const addComment = async (postId: string) => {
    if (!user || !commentInput.trim()) return;
    const { error } = await supabase.from("post_comments").insert({ post_id: postId, user_id: user.id, content: commentInput });
    if (error) {
      toast({ title: "Failed to add comment", variant: "destructive" });
      return;
    }
    setCommentInput("");
    loadComments(postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p));
  };

  const toggleExpand = (postId: string) => {
    if (expandedPost === postId) { setExpandedPost(null); return; }
    setExpandedPost(postId);
    loadComments(postId);
  };

  const filtered = posts.filter(p => p.category === tab && (search ? p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div><h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("community.title")}</h1><p className="text-muted-foreground">{t("community.subtitle")}</p></div>
            <button onClick={() => { if (!user) { toast({ title: "Please sign in", variant: "destructive" }); return; } setShowCreateModal(true); }}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"><Plus className="w-4 h-4" /> {tab === "story" ? t("community.shareStory") : t("community.startDiscussion")}</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: t("community.totalPosts"), value: stats.total, color: "text-primary" },
              { icon: TrendingUp, label: t("community.successStories"), value: stats.stories, color: "text-primary" },
              { icon: MessageCircle, label: t("community.discussions"), value: stats.discussions, color: "text-primary" },
              { icon: Heart, label: t("community.totalLikes"), value: stats.likes, color: "text-destructive" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5"><div className="flex items-center gap-3"><s.icon className={`w-6 h-6 ${s.color}`} /><div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div></div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-2">
              <button onClick={() => setTab("story")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "story" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>{t("community.successStories")}</button>
              <button onClick={() => setTab("discussion")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "discussion" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>{t("community.discussions")}</button>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 max-w-xs">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("community.searchPosts")} className="bg-transparent outline-none text-sm text-foreground w-full" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-16 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{t("community.emptyState")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(post => (
                <div key={post.id} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {(post.profiles?.display_name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{post.profiles?.display_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">{post.content}</p>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="rounded-xl mb-3 max-h-80 object-cover w-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${likedPosts.has(post.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} /> {post.likes_count}
                    </button>
                    <button onClick={() => toggleExpand(post.id)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                      <MessageCircle className="w-4 h-4" /> {post.comments_count}
                    </button>
                    {user && post.user_id === user.id && (
                      <button onClick={async () => { await supabase.from("community_posts").delete().eq("id", post.id); fetchPosts(); }} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                  {expandedPost === post.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      {(comments[post.id] || []).map(c => (
                        <div key={c.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {(c.profiles?.display_name || "U")[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">{c.profiles?.display_name || "User"}</p>
                            <p className="text-sm text-muted-foreground">{c.content}</p>
                          </div>
                        </div>
                      ))}
                      {user && (
                        <div className="flex gap-2">
                          <input value={commentInput} onChange={e => setCommentInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment(post.id)} placeholder="Add a comment..." className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none text-foreground" />
                          <button onClick={() => addComment(post.id)} className="bg-primary text-primary-foreground px-3 rounded-lg"><Send className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground font-display mb-4">{tab === "story" ? t("community.shareYourStory") : t("community.startADiscussion")}</h2>
            <div className="space-y-4">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title" className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm outline-none text-foreground" />
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Share your experience..." rows={4} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm outline-none text-foreground resize-none" />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                  <Image className="w-4 h-4" /> Add Image
                  <input type="file" accept="image/*" onChange={e => handleImageSelect(e.target.files?.[0] || null)} className="hidden" />
                </label>
                {newImage && <span className="text-xs text-primary">{newImage.name}</span>}
              </div>
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="rounded-lg max-h-40 object-cover" />
                  <button onClick={() => { setNewImage(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setShowCreateModal(false); setNewImage(null); setImagePreview(null); }} className="px-4 py-2 rounded-lg text-sm border border-border text-foreground">Cancel</button>
                <button onClick={createPost} disabled={creating || !newTitle.trim() || !newContent.trim()} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />} Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Community;
