"use client";

import React, { useState } from "react";
import { Share2, Copy, Download, Check, X, ImageIcon, Mail } from "lucide-react";
import { createPortal } from "react-dom";

type ShareChallengeButtonProps = {
  token: string;
  path: string;
  day: number;
  userName: string;
};

// Social Icon Components
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  );
}

export default function ShareChallengeButton({
  token,
  path,
  day,
  userName,
}: ShareChallengeButtonProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isImageCopied, setIsImageCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://finlevels.app";
  const shareText = `I just completed Day ${day} of the Finlevels ${path} challenge! 🚀 Join me and discover your archetype:`;
  const inviteUrl = `${originUrl}/profile/${encodeURIComponent(token)}`;

  const encodedShareText = encodeURIComponent(`${shareText} ${inviteUrl}`);
  const encodedMailSubject = encodeURIComponent("Join me on Finlevels ⚡");
  const encodedMailBody = encodeURIComponent(`${shareText}\n\n${inviteUrl}`);

  const handleShare = async () => {
    setErrorMsg("");
    const ogUrl = `/api/og/challenge/${encodeURIComponent(token)}`;
    setImageUrl(ogUrl);

    // If native share is available, use it (link only, with SEO image automatically resolved by social apps)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName} — Finlevels`,
          text: shareText,
          url: inviteUrl,
        });
        return; // Success! No fallback modal needed
      } catch (e) {
        console.warn("Native sharing failed or cancelled:", e);
        // If the user cancelled manually, do not show the fallback modal
        if (e instanceof Error && e.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback: Open bottom sheet modal for desktop or unsupported browsers
    setIsOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setErrorMsg("Failed to copy link.");
    }
  };

  const handleCopyImage = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setIsImageCopied(true);
      setTimeout(() => setIsImageCopied(false), 2000);
    } catch {
      setErrorMsg("Could not copy image to clipboard. Try downloading instead.");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finlevels-day-${day}-${path}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setErrorMsg("Failed to download image.");
    }
  };

  const modalMarkup = isOpen ? (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#1b1b23]/70 backdrop-blur-sm sm:items-center p-0 sm:p-4"
      onMouseDown={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#16162a] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-all max-h-[95vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-black text-white">Invite Friends & Share Result</h3>
            <p className="text-xs text-white/50">Send your Day {day} card and invite your friends.</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant CSS Preview of the Challenge Card */}
        <div className="relative aspect-[9/16] w-40 mx-auto bg-[#0d0d1a] rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-4 border border-white/10 select-none mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1040]/30 to-[#0d0d1a] pointer-events-none" />
          
          {/* Header */}
          <div className="relative flex items-center justify-center gap-1">
            <span className="text-[7px] font-black text-[#4648d4] uppercase tracking-wider">Finlevels</span>
          </div>

          {/* Card */}
          <div className="relative flex flex-col items-center bg-[#1b1b23] border border-[#20c9b8]/50 rounded-xl p-3 shadow-md w-full">
            <span className="text-[5px] font-black text-[#20c9b8] tracking-widest block mb-1">DAILY QUEST COMPLETE</span>
            <span className="text-[10px] font-black text-white text-center leading-tight">Day {day} Unlocked!</span>
            
            {/* Mock coin area */}
            <div className="w-12 h-12 rounded-full bg-[#20c9b8]/15 border border-[#20c9b8]/30 flex items-center justify-center my-2">
              <span className="text-[16px]">🪙</span>
            </div>
            
            <span className="text-[6px] font-black text-white">{path.toUpperCase()} PATH</span>
            <span className="text-[4px] text-slate-400">Level 3 · {userName}</span>
          </div>

          {/* Stats */}
          <div className="relative flex justify-around items-center bg-white/[0.02] border border-white/5 rounded-xl p-2 w-full text-center">
            <div>
              <p className="text-[8px] font-black text-white">4</p>
              <p className="text-[3px] text-slate-500 uppercase tracking-widest font-black">Quests Done</p>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div>
              <p className="text-[8px] font-black text-[#20c9b8]">{path}</p>
              <p className="text-[3px] text-slate-500 uppercase tracking-widest font-black">Active Path</p>
            </div>
          </div>

          {/* Footer */}
          <div className="relative text-center flex flex-col items-center">
            <span className="text-[6px] font-black text-[#E4FF30]">Money skills. Built for real life.</span>
            <span className="text-[4px] text-white/30">finlevels.app</span>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-red-400 text-center mb-4">{errorMsg}</p>
        )}

        {/* Action List */}
        <div className="space-y-2">
          <button
            onClick={handleCopyImage}
            className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold px-4 py-3 rounded-xl transition"
          >
            <span className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-[#20c9b8]" />
              Copy Card Image
            </span>
            {isImageCopied ? (
              <Check className="w-5 h-5 text-[#E4FF30]" />
            ) : (
              <span className="text-[10px] uppercase font-bold text-[#E4FF30]">Paste ready</span>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold px-4 py-3 rounded-xl transition"
          >
            <span className="flex items-center gap-3">
              <Copy className="w-5 h-5 text-[#7c7eff]" />
              Copy Invite Link
            </span>
            {isCopied ? (
              <Check className="w-5 h-5 text-[#E4FF30]" />
            ) : (
              <span className="text-[10px] uppercase font-bold text-white/40">Copy</span>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold px-4 py-3 rounded-xl transition"
          >
            <span className="flex items-center gap-3">
              <Download className="w-5 h-5 text-[#f5a623]" />
              Download Card PNG
            </span>
            <span className="text-[10px] uppercase font-bold text-white/40">PNG</span>
          </button>
        </div>

        {/* Unified Quick Share Channels */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider text-center mb-4">Quick Invite Channels</p>
          <div className="flex items-center justify-center gap-4">
            {/* Share on X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition hover:scale-105"
              aria-label="Invite on X"
            >
              <TwitterIcon className="w-5 h-5" />
            </a>

            {/* Share on Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition hover:scale-105"
              aria-label="Invite on Facebook"
            >
              <FacebookIcon className="w-5 h-5 text-[#1877f2]" />
            </a>

            {/* Share by Mail */}
            <a
              href={`mailto:?subject=${encodedMailSubject}&body=${encodedMailBody}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition hover:scale-105"
              aria-label="Invite by email"
            >
              <Mail className="w-5 h-5 text-[#4648d4]" />
            </a>
          </div>
        </div>

        <p className="mt-5 text-[10px] text-center text-white/50 font-bold uppercase tracking-wider">
          💡 Tip: paste link in Instagram Link Sticker or TikTok Bio! 🔗
        </p>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 rounded-full border border-[#4648d4]/15 bg-[#4648d4] px-5 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-[#3d3fbe] shadow-[0_12px_30px_rgba(70,72,212,0.25)]"
      >
        <Share2 className="w-5 h-5 text-[#E4FF30]" />
        <span>Invite & Share My Result 🌟</span>
      </button>

      {typeof document !== "undefined" && modalMarkup
        ? createPortal(modalMarkup, document.body)
        : null}
    </>
  );
}
