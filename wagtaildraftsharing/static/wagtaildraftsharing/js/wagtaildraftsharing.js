window.wagtailDraftSharing = {
  createDraftShare: function (event) {
    const button = event.currentTarget;
    const revisionId = button.dataset.wagtaildraftsharingCreate;
    const originalButtonText = button.textContent;
    const getJSONConfig = (name) => {
      const config = document.querySelector(`script#${name}`);
      if (!config) {
        throw new Error("wagtail-config script not found");
      }
      return JSON.parse(config.textContent);
    };
    const wagtailConfig = getJSONConfig("wagtail-config");
    const wagtaildraftsharingConfig = getJSONConfig(
      "wagtaildraftsharing-config"
    );
    fetch(wagtaildraftsharingConfig.urls.create, {
      method: "POST",
      body: `revision=${revisionId}`,
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": wagtailConfig.CSRF_TOKEN,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          const url = window.location.origin + data.url;
          navigator.clipboard.writeText(url).then(() => {
            button.textContent = "Copied!";
            setTimeout(() => {
              button.textContent = originalButtonText;
              button.disabled = false;
            }, 3000);
          });
        } else {
          button.textContent = originalButtonText;
          button.disabled = false;
        }
      })
      .finally(() => {});
  },
  copyLinksToClipboard: function (event) {
    event.preventDefault();
    const link = event.target;
    const url = link.href;

    navigator.clipboard.writeText(url).then(() => {
      // show success message
      link.textContent = "Copied!";
      // hide message after 3 seconds
      setTimeout(() => {
        link.textContent = "Copy";
      }, 3000);
    });
  },
};
