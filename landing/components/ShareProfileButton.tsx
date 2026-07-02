"use client";

import React, { useState } from "react";
import { Share2, Copy, Download, Check, X, ImageIcon } from "lucide-react";
import { createPortal } from "react-dom";

type ShareProfileButtonProps = {
  token: string;
  profileName: string;
  playerLevel: number;
  userName: string;
};

export default function ShareProfileButton({
  token,
  profileName,
  playerLevel,
  userName,
}: ShareProfileButtonProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isImageCopied, setIsImageCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/profile/${encodeURIComponent(token)}`
    : "";

  const handleShare = async () => {
    setErrorMsg("");
    const ogUrl = `/api/og/profile/${encodeURIComponent(token)}`;
    setImageUrl(ogUrl);

    // If native share is available, use it (link only, with SEO image automatically resolved by social apps)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName} — Finlevels`,
          text: `Check out my Finlevels character card! I'm a Level ${playerLevel} ${profileName}.`,
          url: profileUrl,
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
      await navigator.clipboard.writeText(profileUrl);
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
      a.download = `${profileName.toLowerCase().replace(/\s+/g, "-")}-card.png`;
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
        className="w-full max-w-md bg-[#16162a] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-black text-white">Share Character Card</h3>
            <p className="text-xs text-white/50">Copy, copy image, or download your story card.</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant CSS Preview of the Story Card */}
        <div className="relative aspect-[9/16] w-40 mx-auto bg-[#0d0d1a] rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-4 border border-white/10 select-none mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1040]/30 to-[#0d0d1a] pointer-events-none" />
          
          {/* Header */}
          <div className="relative flex items-center justify-center gap-1">
            <span className="text-[7px] font-black text-[#4648d4] uppercase tracking-wider">Finlevels</span>
          </div>

          {/* Card */}
          <div className="relative flex flex-col items-center bg-[#1b1b23] border border-[#E4FF30]/50 rounded-xl p-3 shadow-md w-full">
            <div className="flex justify-between items-center w-full border-b border-white/10 pb-1 mb-2">
              <div className="flex flex-col">
                <span className="text-[5px] font-black text-[#E4FF30] tracking-widest">CHARACTER</span>
                <span className="text-[8px] font-black text-white">{profileName}</span>
              </div>
              <span className="bg-[#E4FF30] text-[#1b1b23] font-black text-[6px] px-1 py-0.5 rounded-full">Lv.{playerLevel}</span>
            </div>
            
            {/* Mock image area */}
            <div className="w-16 h-20 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center p-1">
              <span className="text-[14px]">👤</span>
            </div>
            
            <span className="text-[4px] font-medium text-slate-500 mt-2 uppercase tracking-wide">Finlevels Quiz Archetype</span>
          </div>

          {/* DNA Stats */}
          <div className="relative bg-white/[0.02] border border-white/5 rounded-xl p-2 w-full space-y-1">
            <span className="text-[5px] font-black text-[#E4FF30] tracking-wider block mb-1">SKILL DNA</span>
            <div className="flex items-center justify-between text-[4px] font-bold text-[#7c7eff]">
              <span>Stability</span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#7c7eff]" style={{ width: '60%' }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-[4px] font-bold text-[#20c9b8]">
              <span>Saving</span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#20c9b8]" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-[4px] font-bold text-[#f5a623]">
              <span>Investing</span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#f5a623]" style={{ width: '40%' }} />
              </div>
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
              Copy Profile Link
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
              Download Image File
            </span>
            <span className="text-[10px] uppercase font-bold text-white/40">PNG</span>
          </button>
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
        className="w-full mt-4 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
      >
        <Share2 className="w-4 h-4 text-[#E4FF30]" />
        <span>Share Character Card 🌟</span>
      </button>

      {typeof document !== "undefined" && modalMarkup
        ? createPortal(modalMarkup, document.body)
        : null}
    </>
  );
}
