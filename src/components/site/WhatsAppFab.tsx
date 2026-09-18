"use client";

import { useEffect, useRef, useState } from "react";
import { cx, whatsappUrl } from "@/lib/utils";

export function WhatsAppFab({ phone }: { phone: string }) {
  const href = whatsappUrl(phone);
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120) {
        setHidden(true);
      } else if (y < lastY.current - 6) {
        setHidden(true);
      } else if (y > lastY.current + 6) {
        setHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={cx(
        "wa-fab fixed bottom-6 right-5 z-40 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-ink text-ivory shadow-[0_8px_24px_rgba(27,24,20,0.28)] ring-1 ring-bronze/40 transition-[opacity,transform] duration-300 hover:scale-105 hover:bg-bronze md:bottom-8 md:right-8",
        hidden && "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.08 6.45 2.08 11.92c0 1.75.46 3.45 1.34 4.95L2 22l5.27-1.38a10 10 0 0 0 4.77 1.21h.01c5.49 0 9.96-4.45 9.96-9.92 0-2.65-1.04-5.14-2.96-7zM12.05 20.13h-.01a8.3 8.3 0 0 1-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31a8.2 8.2 0 0 1-1.26-4.33c0-4.54 3.72-8.24 8.29-8.24 2.21 0 4.29.86 5.85 2.41a8.18 8.18 0 0 1 2.43 5.83c0 4.55-3.73 8.21-8.29 8.21zm4.55-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.76.76 2.2.82 2.99.69.48-.08 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.10-.23-.17-.48-.29z" />
      </svg>
    </a>
  );
}
