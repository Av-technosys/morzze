"use client";

import { useEffect, useRef } from "react";

export function RequestCallbackFrom() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    try {
      const zfFrame = iframeRef.current;
      if (!zfFrame) return;

      let ifrmSrc = zfFrame.src;

      if (!new RegExp("[?&]referrername=").test(ifrmSrc)) {
        let rfr = window.location.href;

        try {
          rfr =
            window.self !== window.top
              ? (window.top?.location.href ?? "")
              : /^https?:\/\/[\w.-]+\.[a-zA-Z]{2,}/i.test(rfr)
                ? rfr
                : "";
        } catch (e) {
          /* cross-origin — ignore */
        }

        if (rfr && rfr !== "") {
          if (rfr.length > 1800) {
            const queryIndex = rfr.indexOf("?");
            if (queryIndex > -1) {
              rfr = rfr.substring(0, queryIndex);
            }
            if (rfr.length > 1800) {
              rfr = rfr.substring(0, 1800);
            }
          }
          ifrmSrc +=
            (ifrmSrc.indexOf("?") > 0 ? "&" : "?") +
            "referrername=" +
            encodeURIComponent(rfr);
        }
      }

      if (zfFrame.src !== ifrmSrc) {
        zfFrame.src = ifrmSrc;
      }
    } catch (e) {
      /* silently ignore */
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      id="ziframe_548622"
      aria-label="Call Back Request"
      frameBorder="0"
      style={{ height: 700, width: "99%", border: "none" }}
      src="https://forms.zohopublic.in/Morzze/form/CallBackRequest/formperma/ByCNX0v_rW3Z2B8vXz2Cr_0YcgXJC7TtWZDoUAM7sSE"
    />
  );
}
