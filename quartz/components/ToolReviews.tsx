import { QuartzComponent, QuartzComponentProps } from "./types"

const SUPABASE_URL = "https://hcjgbndiletkhuomdxex.supabase.co"
const SUPABASE_KEY = "sb_publishable_daQBlmHjpHDyLRcAseA-gw_eJ9cqfMB"

const ToolReviews: QuartzComponent = (props: QuartzComponentProps) => {
  const slug = props.fileData.slug?.split("/").pop()

  return (
    <div className="tool-reviews" data-slug={slug}>
      <h2 className="reviews-title">🖤 Community Experiences</h2>

      <div className="reviews-summary">
        <div className="summary-left">
          <span className="avg-stars">☆☆☆☆☆</span>
          <span className="avg-score">(0)</span>
        </div>

        <div className="summary-right">
          <select className="sort-select">
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      <div className="review-filters"></div>
      <div className="reviews-list">Loading...</div>

      {/* 🔥 SUBMIT */}
      <div className="review-submit">
        <h3>Share your experience</h3>

        <input type="text" placeholder="Name (optional)" className="review-name" />

        <select className="review-rating">
          <option value="">Rating</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>

        {/* ✅ TAG CHIPS */}
        <div className="tag-picker">
          <span data-tag="easy">easy</span>
          <span data-tag="fast">fast</span>
          <span data-tag="buggy">buggy</span>
          <span data-tag="confusing">confusing</span>
          <span data-tag="powerful">powerful</span>
        </div>

        <textarea placeholder="Write your experience..." className="review-textarea"></textarea>

        <button className="review-submit-btn">Submit Review</button>

        <p className="review-status"></p>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          (async () => {
            const slug = "${slug}";
            const container = document.querySelector('.tool-reviews[data-slug="' + slug + '"]');
            if (!container) return;

            const listEl = container.querySelector(".reviews-list");
            const filterContainer = container.querySelector(".review-filters");
            const sortSelect = container.querySelector(".sort-select");
            const statusEl = container.querySelector(".review-status");

            // 🔐 user identity
            let userId = localStorage.getItem("review_user_id");
            if (!userId) {
              userId = crypto.randomUUID();
              localStorage.setItem("review_user_id", userId);
            }

            let reviews = [];
            let activeFilters = [];
            let selectedTags = [];

            // ✅ TAG PICKER
            container.querySelectorAll(".tag-picker span").forEach(el => {
              el.onclick = () => {
                const tag = el.dataset.tag;
                if (selectedTags.includes(tag)) {
                  selectedTags = selectedTags.filter(t => t !== tag);
                  el.classList.remove("active");
                } else {
                  selectedTags.push(tag);
                  el.classList.add("active");
                }
              };
            });

            async function fetchReviews() {
              const res = await fetch(
                "${SUPABASE_URL}/rest/v1/reviews?approved=eq.true",
                {
                  headers: {
                    apikey: "${SUPABASE_KEY}",
                    Authorization: "Bearer ${SUPABASE_KEY}"
                  }
                }
              );

              reviews = (await res.json()).filter(r => r.tool_slug === slug);
            }

            function buildFilters() {
              const tagSet = new Set();
              reviews.forEach(r => (r.tags || []).forEach(t => tagSet.add(t)));

              filterContainer.innerHTML = [...tagSet]
                .map(t => '<span data-tag="' + t + '">' + t + '</span>')
                .join("");

              filterContainer.querySelectorAll("span").forEach(el => {
                el.onclick = () => {
                  const tag = el.dataset.tag;
                  if (activeFilters.includes(tag)) {
                    activeFilters = activeFilters.filter(t => t !== tag);
                    el.classList.remove("active");
                  } else {
                    activeFilters.push(tag);
                    el.classList.add("active");
                  }
                  render();
                };
              });
            }

            function render() {
              let filtered = [...reviews];

              if (activeFilters.length) {
                filtered = filtered.filter(r =>
                  r.tags && r.tags.some(t => activeFilters.includes(t))
                );
              }

              const sort = sortSelect.value;
              if (sort === "highest") filtered.sort((a,b)=>b.rating-a.rating);
              else if (sort === "lowest") filtered.sort((a,b)=>a.rating-b.rating);
              else filtered.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

              if (!filtered.length) {
                listEl.innerHTML = "<p class='empty'>No matching experiences yet.</p>";
                return;
              }

              listEl.innerHTML = filtered.map(r => {
                const isOwner = r.user_id === userId;

                return \`
                  <div class="review-card">
                    <div class="stars">
                      \${"★".repeat(r.rating)}\${"☆".repeat(5-r.rating)}
                    </div>

                    \${r.tags ? '<div class="review-tags">' + r.tags.map(t=>'<span>'+t+'</span>').join("") + '</div>' : ""}

                    <div class="review-text">\${window.marked ? marked.parse(r.content) : r.content}</div>

                    \${r.name ? '<div class="review-author">— '+r.name+'</div>' : ""}

                    \${isOwner ? \`
                      <div class="review-actions">
                        <button data-id="\${r.id}" class="edit-btn">Edit</button>
                        <button data-id="\${r.id}" class="delete-btn">Delete</button>
                      </div>
                    \` : ""}
                  </div>
                \`;
              }).join("");

              // delete
              container.querySelectorAll(".delete-btn").forEach(btn => {
                btn.onclick = async () => {
                  await fetch("${SUPABASE_URL}/rest/v1/reviews?id=eq."+btn.dataset.id, {
                    method: "DELETE",
                    headers: {
                      apikey: "${SUPABASE_KEY}",
                      Authorization: "Bearer ${SUPABASE_KEY}"
                    }
                  });
                  await init();
                };
              });

              // edit
              container.querySelectorAll(".edit-btn").forEach(btn => {
                btn.onclick = async () => {
                  const newText = prompt("Edit your review:");
                  if (!newText) return;

                  await fetch("${SUPABASE_URL}/rest/v1/reviews?id=eq."+btn.dataset.id, {
                    method: "PATCH",
                    headers: {
                      apikey: "${SUPABASE_KEY}",
                      Authorization: "Bearer ${SUPABASE_KEY}",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ content: newText })
                  });

                  await init();
                };
              });
            }

            async function init() {
              await fetchReviews();

              if (reviews.length) {
                const avg = (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1);
                container.querySelector(".avg-score").textContent = "("+avg+")";
                container.querySelector(".avg-stars").textContent =
                  "★".repeat(Math.round(avg)) + "☆".repeat(5-Math.round(avg));
              }

              buildFilters();
              render();
            }

            // 🔥 submit
            container.querySelector(".review-submit-btn").onclick = async () => {
              const name = container.querySelector(".review-name").value;
              const rating = container.querySelector(".review-rating").value;
              const content = container.querySelector(".review-textarea").value;

              // 🛑 spam protection
              const last = localStorage.getItem("last_review_time");
              if (last && Date.now() - last < 60000) {
                statusEl.textContent = "Slow down — wait a minute.";
                return;
              }

              if (!rating || content.length < 10) {
                statusEl.textContent = "Add rating + meaningful review.";
                return;
              }

              statusEl.textContent = "Submitting...";

              await fetch("${SUPABASE_URL}/rest/v1/reviews", {
                method: "POST",
                headers: {
                  apikey: "${SUPABASE_KEY}",
                  Authorization: "Bearer ${SUPABASE_KEY}",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  tool_slug: slug,
                  name,
                  rating: Number(rating),
                  content,
                  tags: selectedTags,
                  user_id: userId,
                  approved: false
                })
              });

              localStorage.setItem("last_review_time", Date.now());

              statusEl.textContent = "Submitted for approval.";

              await init();
            };

            sortSelect.onchange = render;

            init();
          })();
        `,
        }}
      />
    </div>
  )
}

export default ToolReviews