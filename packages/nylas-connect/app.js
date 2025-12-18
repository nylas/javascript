import { auth } from "./auth-instance.js";

const connectButton = document.getElementById("connectButton");
const resultContainer = document.getElementById("resultContainer");
const resultContent = document.getElementById("resultContent");

connectButton.addEventListener("click", async () => {
  // Disable button and show loading state
  connectButton.disabled = true;
  connectButton.textContent = "Connecting...";
  resultContainer.classList.remove("show");
  resultContent.innerHTML =
    '<p class="loading">Opening authentication window...</p>';

  try {
    const result = await auth.connect({ method: "popup" });

    // Display the result
    displayResult(result);
  } catch (error) {
    // Display error
    displayError(error);
  } finally {
    // Re-enable button
    connectButton.disabled = false;
    connectButton.textContent = "Connect your inbox";
  }
});

function displayResult(result) {
  const expiresAt = new Date(result.expiresAt);
  const expiresIn = Math.floor((result.expiresAt - Date.now()) / 1000 / 60);

  let html = '<span class="success-badge">✓ Authentication Successful</span>';
  html += "<h2>Connection Details</h2>";

  // Access Token
  html += '<div class="result-section">';
  html += '<div class="result-label">Access Token</div>';
  html += `<div class="result-value token-value">${escapeHtml(result.accessToken)}</div>`;
  html += "</div>";

  // Grant ID
  html += '<div class="result-section">';
  html += '<div class="result-label">Grant ID</div>';
  html += `<div class="result-value">${escapeHtml(result.grantId)}</div>`;
  html += "</div>";

  // Grant Info (if available)
  if (result.grantInfo) {
    if (result.grantInfo.email) {
      html += '<div class="result-section">';
      html += '<div class="result-label">Email</div>';
      html += `<div class="result-value">${escapeHtml(result.grantInfo.email)}</div>`;
      html += "</div>";
    }

    if (result.grantInfo.provider) {
      html += '<div class="result-section">';
      html += '<div class="result-label">Provider</div>';
      html += `<div class="result-value">${escapeHtml(result.grantInfo.provider)}</div>`;
      html += "</div>";
    }

    if (result.grantInfo.name) {
      html += '<div class="result-section">';
      html += '<div class="result-label">Name</div>';
      html += `<div class="result-value">${escapeHtml(result.grantInfo.name)}</div>`;
      html += "</div>";
    }
  }

  // Scopes
  html += '<div class="result-section">';
  html += '<div class="result-label">Granted Scopes</div>';
  html += `<div class="result-value">${escapeHtml(result.scope)}</div>`;
  html += "</div>";

  // Expiration
  html += '<div class="result-section">';
  html += '<div class="result-label">Expires</div>';
  html += `<div class="result-value">${expiresAt.toLocaleString()} (in ${expiresIn} minutes)</div>`;
  html += "</div>";

  resultContent.innerHTML = html;
  resultContainer.classList.add("show");
}

function displayError(error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  resultContent.innerHTML = `
    <div class="error-message">
      <strong>Authentication Error:</strong><br>
      ${escapeHtml(errorMessage)}
    </div>
  `;
  resultContainer.classList.add("show");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
