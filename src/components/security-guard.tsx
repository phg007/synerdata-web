"use client";

import { useEffect } from "react";

const ALLOWED_DOMAINS = ["viacep.com.br", "uploadthing.com", "utfs.io"];

const SUSPICIOUS_KEYWORDS = [
  "bet",
  "casino",
  "slot",
  "aposta",
  "poker",
  "gambling",
  "777",
  "jackpot",
  "spin",
  "bonus-claim",
];

export function SecurityGuard() {
  useEffect(() => {
    // 1. Monitor for suspicious script injections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            const currentHostname = window.location.hostname;
            const allowedDomains = [currentHostname, ...ALLOWED_DOMAINS];

            // Check for injected scripts
            if (element.tagName === "SCRIPT") {
              const src = element.getAttribute("src") || "";
              const isAllowed = allowedDomains.some(
                (domain) => src === "" || src.includes(domain)
              );

              if (!isAllowed && src) {
                console.warn("[SecurityGuard] Blocked suspicious script:", src);
                element.remove();
                reportSecurityViolation("script_injection", src);
              }
            }

            // Check for injected iframes
            if (element.tagName === "IFRAME") {
              const src = element.getAttribute("src") || "";
              const isAllowed = allowedDomains.some((domain) =>
                src.includes(domain)
              );

              if (!isAllowed) {
                console.warn("[SecurityGuard] Blocked suspicious iframe:", src);
                element.remove();
                reportSecurityViolation("iframe_injection", src);
              }
            }

            // Check for suspicious overlays (common ad injection technique)
            if (
              element.tagName === "DIV" &&
              element.getAttribute("style")?.includes("z-index")
            ) {
              const zIndex = parseInt(
                window.getComputedStyle(element).zIndex || "0"
              );
              if (zIndex > 9999) {
                const innerHTML = element.innerHTML.toLowerCase();
                const isSuspicious = SUSPICIOUS_KEYWORDS.some((keyword) =>
                  innerHTML.includes(keyword)
                );

                if (isSuspicious) {
                  console.warn(
                    "[SecurityGuard] Blocked suspicious overlay:",
                    element
                  );
                  element.remove();
                  reportSecurityViolation(
                    "overlay_injection",
                    innerHTML.slice(0, 200)
                  );
                }
              }
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // 2. Block suspicious window.open calls
    const originalWindowOpen = window.open;
    window.open = function (url, ...args) {
      const urlString = url?.toString() || "";
      const isSuspicious = SUSPICIOUS_KEYWORDS.some((keyword) =>
        urlString.toLowerCase().includes(keyword)
      );

      if (isSuspicious) {
        console.warn("[SecurityGuard] Blocked suspicious popup:", urlString);
        reportSecurityViolation("popup_blocked", urlString);
        return null;
      }

      return originalWindowOpen.call(window, url, ...args);
    };

    // 3. Check for suspicious elements on load
    const checkExistingElements = () => {
      const currentHostname = window.location.hostname;
      const allowedDomains = [currentHostname, ...ALLOWED_DOMAINS];

      // Remove any suspicious iframes that loaded before this script
      document.querySelectorAll("iframe").forEach((iframe) => {
        const src = iframe.getAttribute("src") || "";
        const isAllowed = allowedDomains.some((domain) => src.includes(domain));

        if (!isAllowed && src) {
          console.warn("[SecurityGuard] Removed suspicious iframe:", src);
          iframe.remove();
          reportSecurityViolation("iframe_removed", src);
        }
      });
    };

    checkExistingElements();

    return () => {
      observer.disconnect();
      window.open = originalWindowOpen;
    };
  }, []);

  return null;
}

function reportSecurityViolation(type: string, details: string) {
  // You can send this to your backend for monitoring
  if (process.env.NODE_ENV === "production") {
    console.error(`[SECURITY VIOLATION] Type: ${type}, Details: ${details}`);

    // Optional: send to your API for logging
    // fetch('/api/security-report', {
    //   method: 'POST',
    //   body: JSON.stringify({ type, details, timestamp: new Date().toISOString() }),
    // }).catch(() => {});
  }
}
