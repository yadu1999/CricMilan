// CricMilan Ultra-Modern Frontend Scripts 2.0

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && e.target !== menuToggle) {
        mainNav.classList.remove('active');
      }
    });
  }

  // 2. Dynamic Reading Progress Bar
  const progressBar = document.getElementById('readingProgressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrolled + '%';
      }
    });
  }

  // 3. Dynamic Date Display in Header
  const dateContainer = document.getElementById('currentDate');
  if (dateContainer) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const today = new Date();
    dateContainer.textContent = today.toLocaleDateString('en-US', options);
  }

  // 4. Keyboard Shortcut '/' for Search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      window.location.href = '/search';
    }
  });

  // 5. Social Share & Copy Link Integration
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', () => {
      const rawUrl = window.location.href.replace(/cricmilan\.com/gi, 'cricmilan.in');
      const url = encodeURIComponent(rawUrl);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';

      if (button.classList.contains('fb')) {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (button.classList.contains('tw')) {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      } else if (button.classList.contains('wa')) {
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
      } else if (button.id === 'copyLinkBtn') {
        navigator.clipboard.writeText(rawUrl).then(() => {
          const toast = document.getElementById('copyToast');
          if (toast) {
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 3000);
          }
        }).catch(() => {
          prompt('Copy article link:', rawUrl);
        });
        return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400,resizable=yes');
      }
    });
  });

  // 6. Interactive Article Reactions
  const reactionsContainer = document.getElementById('reactionsContainer');
  if (reactionsContainer) {
    const articleId = reactionsContainer.getAttribute('data-article-id');
    const reactionButtons = reactionsContainer.querySelectorAll('.reaction-btn');

    reactionButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const reactionType = btn.getAttribute('data-reaction');
        try {
          const response = await fetch(`/api/articles/${articleId}/react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reaction: reactionType })
          });
          const data = await response.json();
          if (data.success && data.reactions) {
            // Update counts on buttons
            Object.keys(data.reactions).forEach(type => {
              const countEl = document.getElementById(`count-${type}`);
              if (countEl) countEl.textContent = data.reactions[type];
            });

            btn.style.transform = 'scale(1.15)';
            setTimeout(() => { btn.style.transform = ''; }, 250);

            const toast = document.getElementById('reactionToast');
            if (toast) toast.style.display = 'block';
          }
        } catch (err) {
          console.error('Reaction error:', err);
        }
      });
    });
  }

  // 7. Fan Poll Widget Interaction
  const submitPollBtn = document.getElementById('submitPollBtn');
  if (submitPollBtn) {
    submitPollBtn.addEventListener('click', () => {
      submitPollBtn.disabled = true;
      submitPollBtn.style.opacity = '0.6';
      submitPollBtn.textContent = 'Vote Recorded';
      const thanks = document.getElementById('pollThanksMsg');
      if (thanks) thanks.style.display = 'block';
    });
  }
});
