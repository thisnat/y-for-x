// Global settings state
let settings = {
  showQuotesBtn: true,
  quotesOpenType: 'newTab',
  viewPostsBtn: true,
  viewPostsOpenType: 'newTab'
};

// Reserved non-profile paths on X
const reservedPaths = new Set([
  'home', 'explore', 'notifications', 'messages', 'search', 'settings',
  'i', 'tos', 'privacy', 'about', 'jobs', 'hashtag', 'personalization',
  'account', 'privacy_and_safety', 'safety', 'share', 'list', 'lists',
  'bookmarks', 'verified-choose', 'compose', 'intent', 'followers',
  'following', 'likes', 'media', 'lists', 'communities', 'connect',
  'premium', 'business', 'ads', 'creator-monetization', 'monetization',
  'about', 'privacy', 'tos', 'drafts'
]);

// Initialize settings and observer
chrome.storage.local.get({
  showQuotesBtn: true,
  quotesOpenType: 'newTab',
  viewPostsBtn: true,
  viewPostsOpenType: 'newTab'
}, (items) => {
  settings = items;
  updateQuotesButtons();
  updateViewPostsButton();
  startObserver();
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.showQuotesBtn) settings.showQuotesBtn = changes.showQuotesBtn.newValue;
  if (changes.quotesOpenType) settings.quotesOpenType = changes.quotesOpenType.newValue;
  if (changes.viewPostsBtn) settings.viewPostsBtn = changes.viewPostsBtn.newValue;
  if (changes.viewPostsOpenType) settings.viewPostsOpenType = changes.viewPostsOpenType.newValue;
  
  updateQuotesButtons();
  updateViewPostsButton();
});

// Get status path from tweet article
function getTweetStatusUrl(tweetArticle) {
  // 1. Check timestamp link inside the tweet (timeline view)
  const timeElement = tweetArticle.querySelector('time');
  if (timeElement) {
    const statusLink = timeElement.closest('a');
    if (statusLink) {
      const href = statusLink.getAttribute('href');
      if (href) {
        const match = href.match(/^\/([^\/]+)\/status\/(\d+)/);
        if (match) return `/${match[1]}/status/${match[2]}`;
      }
    } else {
      // 2. Main tweet in detail view (no anchor wrapping the time element)
      const match = window.location.pathname.match(/^\/([^\/]+)\/status\/(\d+)/);
      if (match) {
        return `/${match[1]}/status/${match[2]}`;
      }
    }
  }

  // 3. Fallback: search for any link containing status pattern
  const statusLink = tweetArticle.querySelector('a[href*="/status/"]');
  if (statusLink) {
    const href = statusLink.getAttribute('href');
    const match = href.match(/^\/([^\/]+)\/status\/(\d+)/);
    if (match) return `/${match[1]}/status/${match[2]}`;
  }

  return null;
}

// Create the Quotes button node matching X's exact DOM structure
function createQuotesButton(statusPath, repostContainer) {
  const container = document.createElement('div');
  if (repostContainer) {
    container.className = repostContainer.className;
  }
  container.classList.add('y-quotes-container');

  const link = document.createElement('a');
  link.href = `${window.location.origin}${statusPath}/quotes`;
  link.className = 'y-quotes-btn';
  link.title = 'View Quotes';

  if (settings.quotesOpenType === 'newTab') {
    link.target = '_blank';
  }

  if (repostContainer) {
    const nativeBtn = repostContainer.querySelector('button') ||
                      repostContainer.querySelector('[role="button"]') ||
                      repostContainer.querySelector('a') ||
                      repostContainer.firstElementChild;
    if (nativeBtn) {
      link.className = nativeBtn.className;
      link.classList.add('y-quotes-btn');
    }
  }

  link.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const innerDiv = document.createElement('div');
  innerDiv.setAttribute('dir', 'ltr');
  innerDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q';
  
  if (repostContainer) {
    const nativeInnerDiv = repostContainer.querySelector('div[dir="ltr"]');
    if (nativeInnerDiv) {
      innerDiv.className = nativeInnerDiv.className;
    }
  }
  innerDiv.classList.add('y-quotes-inner-div');

  const iconContainer = document.createElement('div');
  iconContainer.className = 'css-175oi2r r-xoduu5';
  if (repostContainer) {
    const nativeInnerDiv = repostContainer.querySelector('div[dir="ltr"]');
    if (nativeInnerDiv && nativeInnerDiv.firstElementChild) {
      iconContainer.className = nativeInnerDiv.firstElementChild.className;
    }
  }
  iconContainer.classList.add('y-quotes-icon-container');

  const backdrop = document.createElement('div');
  backdrop.className = 'css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l';
  if (repostContainer) {
    const nativeInnerDiv = repostContainer.querySelector('div[dir="ltr"]');
    if (nativeInnerDiv && nativeInnerDiv.firstElementChild && nativeInnerDiv.firstElementChild.firstElementChild) {
      backdrop.className = nativeInnerDiv.firstElementChild.firstElementChild.className;
    }
  }
  backdrop.classList.add('y-quotes-backdrop');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-50lct3 r-1srniue y-quotes-svg');
  
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z');
  
  g.appendChild(path);
  svg.appendChild(g);

  iconContainer.appendChild(backdrop);
  iconContainer.appendChild(svg);

  const textContainer = document.createElement('div');
  textContainer.className = 'css-175oi2r r-xoduu5 r-1udh08x y-quotes-text-container';
  
  if (repostContainer) {
    const nativeInnerDiv = repostContainer.querySelector('div[dir="ltr"]');
    if (nativeInnerDiv && nativeInnerDiv.children.length > 1) {
      textContainer.className = nativeInnerDiv.children[1].className;
      textContainer.classList.add('y-quotes-text-container');
    }
  }

  const textSpan = document.createElement('span');
  textSpan.className = 'y-quotes-text';
  textSpan.textContent = 'Quotes';

  if (repostContainer) {
    const nativeText = repostContainer.querySelector('span');
    if (nativeText) {
      textSpan.className = nativeText.className;
      textSpan.classList.add('y-quotes-text');
    }
  }

  textContainer.appendChild(textSpan);

  innerDiv.appendChild(iconContainer);
  innerDiv.appendChild(textContainer);
  link.appendChild(innerDiv);
  container.appendChild(link);

  return container;
}

// Inject Quotes button into a tweet article
function injectQuotesButton(tweetArticle) {
  if (tweetArticle.dataset.yQuotesAdded) return;

  const statusPath = getTweetStatusUrl(tweetArticle);
  if (!statusPath) return;

  // Find the action bar (group containing reply, retweet, like)
  const actionBars = Array.from(tweetArticle.querySelectorAll('div[role="group"]'));
  const mainActionBar = actionBars.find(bar => {
    return bar.querySelector('[data-testid="reply"]') ||
           bar.querySelector('[data-testid="retweet"]') ||
           bar.querySelector('[data-testid="like"]');
  });

  if (!mainActionBar) return;

  // Find retweet button container to clone styles and insert after
  const childDivs = Array.from(mainActionBar.children);
  const repostContainer = childDivs.find(child =>
    child.querySelector('[data-testid="retweet"]') ||
    child.querySelector('[data-testid="unretweet"]')
  );

  const quotesBtn = createQuotesButton(statusPath, repostContainer);

  if (repostContainer) {
    repostContainer.insertAdjacentElement('afterend', quotesBtn);
  } else {
    // Fallback: insert before the last item (typically Share or Bookmark)
    if (mainActionBar.children.length > 0) {
      mainActionBar.insertBefore(quotesBtn, mainActionBar.lastElementChild);
    } else {
      mainActionBar.appendChild(quotesBtn);
    }
  }

  tweetArticle.dataset.yQuotesAdded = 'true';
}

// Scan page for tweets and inject buttons
function scanAndInject() {
  if (settings.showQuotesBtn) {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach(injectQuotesButton);
  }
}

// Clean up all injected Quotes buttons
function removeQuotesButtons() {
  const buttons = document.querySelectorAll('.y-quotes-container');
  buttons.forEach(btn => btn.remove());

  const processedTweets = document.querySelectorAll('[data-y-quotes-added]');
  processedTweets.forEach(tweet => {
    delete tweet.dataset.yQuotesAdded;
  });
}

// Update the target attribute of existing Quotes links
function updateQuotesOpenType() {
  const buttons = document.querySelectorAll('.y-quotes-btn');
  buttons.forEach(link => {
    if (settings.quotesOpenType === 'newTab') {
      link.target = '_blank';
    } else {
      link.removeAttribute('target');
    }
  });
}

// Update Quotes UI state
function updateQuotesButtons() {
  if (settings.showQuotesBtn) {
    scanAndInject();
    updateQuotesOpenType();
  } else {
    removeQuotesButtons();
  }
}

// --- View User's Posts Feature (Always Native Design) ---

// Create view posts button cloning X's native action button styles
function createViewPostsButton(username, actionBtn) {
  const link = document.createElement('a');
  link.href = `${window.location.origin}/search?q=from%3A${username}`;
  link.className = 'y-view-posts-btn';
  
  if (settings.viewPostsOpenType === 'newTab') {
    link.target = '_blank';
  }

  // Prevent parent click
  link.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const buttonText = `View @${username}'s posts`;

  if (actionBtn) {
    // Clone native button classes & styles
    link.className = actionBtn.className + ' y-view-posts-btn';
    const nativeStyle = actionBtn.getAttribute('style');
    if (nativeStyle) {
      link.setAttribute('style', nativeStyle);
    }

    // Clone native inner layout div
    const nativeInnerDiv = actionBtn.querySelector('div[dir="ltr"]');
    if (nativeInnerDiv) {
      const innerDiv = document.createElement('div');
      innerDiv.setAttribute('dir', 'ltr');
      innerDiv.className = nativeInnerDiv.className;
      const innerStyle = nativeInnerDiv.getAttribute('style');
      if (innerStyle) {
        innerDiv.setAttribute('style', innerStyle);
      }

      // Clone span layout
      const nativeSpan = nativeInnerDiv.querySelector('span');
      if (nativeSpan) {
        const wrapperSpan1 = document.createElement('div');
        wrapperSpan1.className = 'css-175oi2r r-xoduu5';

        const span1 = document.createElement('span');
        span1.className = nativeSpan.className;

        const span2 = document.createElement('span');
        const nestedSpan = nativeSpan.querySelector('span');
        span2.className = nestedSpan ? nestedSpan.className : nativeSpan.className;
        span2.textContent = buttonText;

        span1.appendChild(span2);
        wrapperSpan1.appendChild(span1);
        innerDiv.appendChild(wrapperSpan1);
      } else {
        innerDiv.textContent = buttonText;
      }
      link.appendChild(innerDiv);
    } else {
      link.textContent = buttonText;
    }
  } else {
    link.textContent = buttonText;
  }

  return link;
}

// Remove View Posts button from UI
function removeViewPostsButton() {
  const buttons = document.querySelectorAll('.y-view-posts-btn');
  buttons.forEach(b => b.remove());
}

// Dynamically inject View Posts button on profile pages (inside the action bar)
function injectViewPostsButton() {
  if (!settings.viewPostsBtn) {
    removeViewPostsButton();
    return;
  }

  // Parse username from URL pathname
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    removeViewPostsButton();
    return;
  }

  const username = segments[0];
  if (reservedPaths.has(username.toLowerCase())) {
    removeViewPostsButton();
    return;
  }

  // Find native profile actions container (contains Edit Profile, DM, Follow, More)
  const actionBtn = document.querySelector('[data-testid="editProfileButton"]') ||
                    document.querySelector('[data-testid="follow"]') ||
                    document.querySelector('[data-testid="unfollow"]') ||
                    document.querySelector('[data-testid="userActions"]') ||
                    document.querySelector('[data-testid="sendDM"]');

  if (!actionBtn) return;

  const actionBar = actionBtn.parentElement;
  if (!actionBar) return;

  const expectedHref = `${window.location.origin}/search?q=from%3A${username}`;
  let btn = actionBar.querySelector('.y-view-posts-btn');

  if (btn) {
    // If we transitioned profiles in SPA mode, update target and href
    if (btn.getAttribute('href') !== expectedHref) {
      btn.remove();
      const newBtn = createViewPostsButton(username, actionBtn);
      actionBar.insertBefore(newBtn, actionBar.firstChild);
    } else {
      // Sync target configuration
      if (settings.viewPostsOpenType === 'newTab') {
        btn.target = '_blank';
      } else {
        btn.removeAttribute('target');
      }
    }
  } else {
    // Construct and prepend cloned native button directly to the action bar
    const newBtn = createViewPostsButton(username, actionBtn);
    actionBar.insertBefore(newBtn, actionBar.firstChild);
  }
}

// Update View Posts button state
function updateViewPostsButton() {
  if (settings.viewPostsBtn) {
    injectViewPostsButton();
  } else {
    removeViewPostsButton();
  }
}

// --- Main Scanner Logic ---

// Throttle DOM scanning using requestAnimationFrame
let scanTimeout = null;
function debouncedScan() {
  if (scanTimeout) return;
  scanTimeout = requestAnimationFrame(() => {
    scanAndInject();
    updateViewPostsButton();
    scanTimeout = null;
  });
}

// Mutation Observer setup
let observer = null;

function startObserver() {
  if (observer) return;

  observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }

    if (shouldScan) {
      debouncedScan();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Periodic check fallback (every 1.5 seconds)
setInterval(() => {
  debouncedScan();
}, 1500);
