document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById("contact-status");
  const serviceId = form.dataset.serviceId || "service_3h7ty7t";
  const templateId = form.dataset.templateId || "template_2xc852t";
  const publicKey = form.dataset.publicKey || "V1CzIU7XIPLjwgWPT";
  const emailInput = form.querySelector('input[name="email"]');
  const turnstileEl = form.querySelector(".cf-turnstile");
  const needsCaptcha = Boolean(turnstileEl);

  if (emailInput) {
    emailInput.pattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
  }

  if (!window.emailjs) {
    if (statusEl) {
      statusEl.textContent = "Email service unavailable right now. Please email me directly.";
      statusEl.className = "form-status error";
    }
    return;
  }

  try {
    window.emailjs.init({ publicKey });
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = "Could not initialize contact form. Please try again later.";
      statusEl.className = "form-status error";
    }
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const turnstileToken = String(formData.get("cf-turnstile-response") || "").trim();
    const templateParams = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim()
    };

    if (!templateParams.name || !templateParams.email || !templateParams.message) {
      if (statusEl) {
        statusEl.textContent = "Please complete all fields before sending.";
        statusEl.className = "form-status error";
      }
      return;
    }

    if (needsCaptcha) {
      const siteKey = turnstileEl.getAttribute("data-sitekey") || "";
      if (!siteKey || siteKey === "YOUR_TURNSTILE_SITE_KEY") {
        if (statusEl) {
          statusEl.textContent = "Turnstile site key is not configured yet.";
          statusEl.className = "form-status error";
        }
        return;
      }

      if (!turnstileToken) {
        if (statusEl) {
          statusEl.textContent = "Please complete the CAPTCHA before sending.";
          statusEl.className = "form-status error";
        }
        return;
      }
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    if (statusEl) {
      statusEl.textContent = "Sending message...";
      statusEl.className = "form-status pending";
    }

    try {
      await window.emailjs.send(serviceId, templateId, templateParams);
      form.reset();
      if (statusEl) {
        statusEl.textContent = "Message sent successfully. I will get back to you soon.";
        statusEl.className = "form-status success";
      }
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = "Message failed to send. Please try again or email me directly.";
        statusEl.className = "form-status error";
      }
      console.error("EmailJS error:", error);
    } finally {
      if (needsCaptcha && window.turnstile && typeof window.turnstile.reset === "function") {
        window.turnstile.reset();
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send";
      }
    }
  });
});
