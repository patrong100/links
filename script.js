document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM fully loaded");

  const decode = (encoded, isHex = false) => {
    if (isHex) {
      let str = '';
      for (let i = 0; i < encoded.length; i += 2) {
        str += String.fromCharCode(parseInt(encoded.substr(i, 2), 16));
      }
      return str;
    }
    return atob(encoded);
  };

  const resources = {
    signal: decode('aHR0cHM6Ly9zaWduYWwubWUvI2V1L3RDa2xuSjZ2c0RsWUtjRThGYXVrZVpXTFI3NlJNLW81eFJycW90bzZvWkpmVFFTMzdpdEJQN0VzRUhzZ2FjUWc='),
    deposit: decode('aHR0cHM6Ly9zYWxsYXBheS5wcm8vMzgyL3B1cmNoYXNl'),
    games: [
      decode('aHR0cDovL2Rvd25sb2FkLmdhbWV2YXVsdDk5OS5jb20='),
      // ... other game URLs ...
    ],
    telegram: decode('aHR0cHM6Ly90Lm1lL3BhdHJvbmdhbWluZzc3Nw=='),
    memberForm: decode('aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2FqYXgvcGF0cm9uZ21lbWJlcnNAZ21haWwuY29t'),
    contactForm: decode('aHR0cHM6Ly9ob29rLnVzMi5tYWtlLmNvbS92OTRyc2I2c25taWU0aGdzNDA1anhuOXo0YzJjZHQwNA=='),
    agentForm: decode('aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2FqYXgvcGF0cm9uZ2FtaW5nNzc3QGdtYWlsLmNvbQ=='),
    facebookAlert: decode('aHR0cHM6Ly9mYWNlYm9vay5jb20v', true)
  };

  // Set resource URLs
  document.getElementById('signal-link').href = resources.signal;
  document.getElementById('deposit-form').action = resources.deposit;
  document.getElementById('telegram-link').href = resources.telegram;
  document.getElementById('member-form').action = resources.memberForm;
  document.getElementById('contact-form').action = resources.contactForm;
  document.getElementById('agent-form').action = resources.agentForm;
  document.getElementById('report-form').action = resources.agentForm;
  
  // Set game URLs
  for (let i = 0; i < 14; i++) {
    document.getElementById(`game${i + 1}`).action = resources.games[i];
  }

  // Modal functionality
  const toggleModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const isVisible = modal.style.display === "block";
    modal.style.display = isVisible ? "none" : "block";
    document.body.style.overflow = isVisible ? "auto" : "hidden";
    console.log("Toggled modal:", modalId);
  };

  const attachToggle = (buttonId, modalId) => {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleModal(modalId);
    });
  };

  attachToggle('contact-manager', 'contactModal');
  attachToggle('contact-agent', 'agentModal');
  attachToggle('member-toggle', 'memberModal');
  attachToggle('report-button', 'reportModal');

  // Close buttons
  document.querySelectorAll('.close-btn').forEach(btn => {
    const modalId = btn.getAttribute('data-modal');
    btn.addEventListener('click', () => toggleModal(modalId));
  });

  // Form handling
  const attachFormHandler = (formId, msgId, successMsg) => {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const message = document.getElementById(msgId);
      message.style.display = "none";
      
      const formData = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        message.textContent = response.ok ? successMsg : "❌ Failed to send request.";
        message.style.display = "block";
        form.reset();
        
        setTimeout(() => {
          message.style.display = "none";
          if (formId !== 'report-form') {
            const modal = form.closest('.contact-modal');
            if (modal) modal.style.display = "none";
            document.body.style.overflow = "auto";
          }
        }, 2000);
      })
      .catch(() => {
        message.textContent = "❌ Network error. Please try again.";
        message.style.display = "block";
      });
    });
  };

  attachFormHandler("contact-form", "thank-you", "✅ Message sent to Manager successfully.");
  attachFormHandler("agent-form", "agent-thank-you", "✅ Message sent to Agent successfully.");
  attachFormHandler("report-form", "report-thank-you", "Report Sent.");
  attachFormHandler("member-form", "member-thank-you", "✅ Request Submitted. Please Contact Agent for Update.");
});
