import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, Users } from "lucide-react";

const posts = [
  {
    author: "Rajesh Kumar",
    location: "Haryana",
    avatar: "RK",
    time: "2 hours ago",
    content: "Just harvested my wheat crop using SRI method. Got 20% more yield compared to last year! Happy to share my experience with fellow farmers.",
    likes: 45,
    replies: 12,
    tag: "Success Story",
  },
  {
    author: "Priya Sharma",
    location: "Maharashtra",
    avatar: "PS",
    time: "5 hours ago",
    content: "Anyone facing problems with aphids on mustard crops this season? I tried neem oil spray and it worked wonders. 🌿",
    likes: 32,
    replies: 28,
    tag: "Pest Control",
  },
  {
    author: "Amit Singh",
    location: "Punjab",
    avatar: "AS",
    time: "1 day ago",
    content: "Installed drip irrigation on my 5-acre farm. Water usage reduced by 50% and my tomato yield increased significantly. Highly recommend!",
    likes: 78,
    replies: 34,
    tag: "Innovation",
  },
];

const CommunitySection = () => (
  <section id="community" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Farmer Community</h2>
        <p className="section-subtitle">
          Connect with thousands of farmers, share experiences, and learn from each other
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {posts.map((post, i) => (
          <motion.div
            key={post.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {post.avatar}
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">{post.author}</div>
                <div className="text-xs text-muted-foreground">{post.location} • {post.time}</div>
              </div>
              <span className="ml-auto bg-accent text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {post.tag}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 text-muted-foreground text-xs">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> {post.replies} replies
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-full px-5 py-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">2,345</span> farmers online now
        </div>
      </div>
    </div>
  </section>
);

export default CommunitySection;
