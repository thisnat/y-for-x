# Y for X

**Y for X** is a lightweight, highly optimized Chrome extension designed to elevate your X (formerly Twitter) browsing experience with native-feeling enhancements.

---

## 🌟 Key Features

- **Quotes Shortcut Link**: Instantly view quotes for any post directly from the timeline. The "Quotes" button is injected next to the Repost/Retweet action, styled to perfectly mimic X's native design system.
- **View User's Posts**: Quickly find and search posts authored by any user. A custom "View @username's posts" button is added directly to their profile action bar, triggerable with a single click.
- **Configuration Popup**: A settings dashboard featuring toggle switches and navigation controls.
- **Custom Navigation Preferences**: Configure links independently to open either in a **New Tab** or the **Same Tab** for a focused workflow.
- **Engineered for Performance**: 
  - **Zero Frame Drops**: Uses `requestAnimationFrame` to batch DOM reads and writes, avoiding layout thrashing.
  - **Smart Observation**: A highly targeted `MutationObserver` that triggers updates only when new tweets or profiles load.
  - **Zero External Dependencies**: Built entirely with vanilla JavaScript, HTML, and CSS.

---

## 🛠️ Architecture & Files

The project has a clean, modular structure:

- **`manifest.json`**: Configured with Manifest V3. Requests minimum permissions (`storage`) and restricts host access to `x.com` and `twitter.com`.
- **`content.js`**: The core logic engine. Handles DOM observation, tweet selection, target resolution, and UI element injection.
- **`content.css`**: Styles the injected Quotes button and search button, matching X's light and dark color schemes dynamically.
- **`popup.html` & `popup.js`**: The user settings dashboard logic. Saves preferences via `chrome.storage.local`.
- **`popup.css`**: Styles the configuration panel controls and transition animations.

---

## 🚀 How to Install

1. Download or clone this repository to your local machine.
2. Open **Google Chrome** and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the folder containing the extension's files (`y-for-x`).
6. (Optional) Pin **Y for X** to your browser toolbar for quick preferences access.

---

## 🔄 How to Apply Updates

If you make local modifications to the code:
1. Navigate to `chrome://extensions/`.
2. Locate the **Y for X** card and click the circular **Reload** icon.
3. Refresh any open `x.com` or `twitter.com` tabs to load the updated scripts.
