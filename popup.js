document.addEventListener('DOMContentLoaded', () => {
  // Quotes button DOM selectors
  const showQuotesBtnCheckbox = document.getElementById('showQuotesBtn');
  const quotesConfigBtn = document.getElementById('quotesConfigBtn');
  const quotesConfigPanel = document.getElementById('quotesConfigPanel');
  const quotesOpenNewTabRadio = document.getElementById('quotesOpenNewTab');
  const quotesOpenSameTabRadio = document.getElementById('quotesOpenSameTab');

  // View User's Posts DOM selectors
  const viewPostsBtnCheckbox = document.getElementById('viewPostsBtn');
  const viewPostsConfigBtn = document.getElementById('viewPostsConfigBtn');
  const viewPostsConfigPanel = document.getElementById('viewPostsConfigPanel');
  const viewPostsOpenNewTabRadio = document.getElementById('viewPostsOpenNewTab');
  const viewPostsOpenSameTabRadio = document.getElementById('viewPostsOpenSameTab');

  // 1. Load saved settings from Chrome storage
  chrome.storage.local.get({
    showQuotesBtn: true,
    quotesOpenType: 'newTab',
    viewPostsBtn: true,
    viewPostsOpenType: 'newTab'
  }, (items) => {
    // Sync Quotes settings
    showQuotesBtnCheckbox.checked = items.showQuotesBtn;
    if (items.quotesOpenType === 'newTab') {
      quotesOpenNewTabRadio.checked = true;
    } else {
      quotesOpenSameTabRadio.checked = true;
    }

    // Sync View Posts settings
    viewPostsBtnCheckbox.checked = items.viewPostsBtn;
    if (items.viewPostsOpenType === 'newTab') {
      viewPostsOpenNewTabRadio.checked = true;
    } else {
      viewPostsOpenSameTabRadio.checked = true;
    }
  });

  // 2. Wire up config panel expand buttons (Chevrons)
  quotesConfigBtn.addEventListener('click', () => {
    // Only allow configuring if the feature is enabled
    if (!showQuotesBtnCheckbox.checked) return;
    
    const isExpanded = quotesConfigPanel.classList.toggle('expanded');
    quotesConfigBtn.classList.toggle('expanded', isExpanded);
  });

  viewPostsConfigBtn.addEventListener('click', () => {
    // Only allow configuring if the feature is enabled
    if (!viewPostsBtnCheckbox.checked) return;

    const isExpanded = viewPostsConfigPanel.classList.toggle('expanded');
    viewPostsConfigBtn.classList.toggle('expanded', isExpanded);
  });

  // 3. Wire up primary feature toggle checkbox listeners
  showQuotesBtnCheckbox.addEventListener('change', () => {
    const isEnabled = showQuotesBtnCheckbox.checked;
    chrome.storage.local.set({ showQuotesBtn: isEnabled }, () => {
      // If disabled, automatically close the configuration panel
      if (!isEnabled) {
        quotesConfigPanel.classList.remove('expanded');
        quotesConfigBtn.classList.remove('expanded');
      }
    });
  });

  viewPostsBtnCheckbox.addEventListener('change', () => {
    const isEnabled = viewPostsBtnCheckbox.checked;
    chrome.storage.local.set({ viewPostsBtn: isEnabled }, () => {
      // If disabled, automatically close the configuration panel
      if (!isEnabled) {
        viewPostsConfigPanel.classList.remove('expanded');
        viewPostsConfigBtn.classList.remove('expanded');
      }
    });
  });

  // 4. Wire up link open behavior radio button listeners
  const saveQuotesOpenType = (e) => {
    if (e.target.checked) {
      chrome.storage.local.set({ quotesOpenType: e.target.value });
    }
  };
  quotesOpenNewTabRadio.addEventListener('change', saveQuotesOpenType);
  quotesOpenSameTabRadio.addEventListener('change', saveQuotesOpenType);

  const saveViewPostsOpenType = (e) => {
    if (e.target.checked) {
      chrome.storage.local.set({ viewPostsOpenType: e.target.value });
    }
  };
  viewPostsOpenNewTabRadio.addEventListener('change', saveViewPostsOpenType);
  viewPostsOpenSameTabRadio.addEventListener('change', saveViewPostsOpenType);
});
