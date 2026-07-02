"use client";

import Image from "next/image";
import { useState } from "react";

type ProfileCardFanProfile = {
  name: string;
  metric: string;
  color: string;
  imageSrc: string;
  challengeGoal: string;
  path: readonly string[];
};

const fanTransforms = [
  "-translate-x-22 translate-y-7 -rotate-[16deg] sm:-translate-x-44 sm:translate-y-14",
  "-translate-x-17 translate-y-4 -rotate-[12deg] sm:-translate-x-34 sm:translate-y-6",
  "-translate-x-12 translate-y-2 -rotate-[8deg] sm:-translate-x-24 sm:translate-y-1",
  "-translate-x-6 translate-y-0 -rotate-[4deg] sm:-translate-x-14 sm:-translate-y-1",
  "translate-x-0 -translate-y-2 rotate-0 sm:-translate-y-3",
  "translate-x-6 translate-y-0 rotate-[4deg] sm:translate-x-14 sm:-translate-y-1",
  "translate-x-12 translate-y-2 rotate-[8deg] sm:translate-x-24 sm:translate-y-1",
  "translate-x-17 translate-y-4 rotate-[12deg] sm:translate-x-34 sm:translate-y-6",
  "translate-x-22 translate-y-7 rotate-[16deg] sm:translate-x-44 sm:translate-y-14",
] as const;

export default function ProfileCardFan({
  profiles,
}: {
  profiles: readonly ProfileCardFanProfile[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(4);

  if (profiles.length === 0) {
    return null;
  }

  const selectedProfile = profiles[selectedIndex];

  return (
    <div className="flex flex-col w-full">
      {/* Fan Container */}
      <div className="relative mx-auto h-60 max-w-full overflow-visible sm:h-120 sm:max-w-4xl lg:h-132 w-full">
        <div className="absolute inset-x-0 bottom-10 top-0 flex items-center justify-center sm:bottom-20">
          {profiles.map((profile, index) => {
            const isSelected = index === selectedIndex;
            const fanTransform =
              fanTransforms[index] ?? fanTransforms[fanTransforms.length - 1];

            return (
              <button
                key={profile.name}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-pressed={isSelected}
                aria-label={`Select ${profile.name}`}
                className={`absolute bottom-0 w-18 overflow-hidden rounded-2xl border bg-white text-left text-[#1b1b23] shadow-[0_16px_35px_rgba(10,10,30,0.26)] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E4FF30]/70 sm:w-52 sm:rounded-[1.65rem] sm:shadow-[0_24px_55px_rgba(10,10,30,0.28)] lg:w-58 ${fanTransform} ${
                  isSelected
                    ? "z-40 scale-110 border-[#E4FF30]"
                    : "z-10 border-white/40 hover:scale-105"
                }`}
                style={{
                  zIndex: isSelected ? 50 : 10 + index,
                }}
              >
                <div className="relative flex h-30 items-end justify-center overflow-hidden bg-[#f5f2fe] sm:h-84 lg:h-96">
                  <Image
                    src={profile.imageSrc}
                    alt={`${profile.name} profile illustration`}
                    width={300}
                    height={496}
                    className="h-full w-full object-cover object-bottom"
                    sizes="(min-width: 1024px) 232px, (min-width: 640px) 208px, 72px"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Profile Detail Panel */}
      <div 
        key={selectedIndex}
        className="mt-6 mx-auto w-full max-w-md bg-white/10 border border-white/10 rounded-3xl p-5 shadow-lg flex flex-col items-center text-center animate-[fade-in_0.4s_ease-out_forwards] backdrop-blur-md sm:max-w-xl sm:p-6"
      >
        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${selectedProfile.color}`}>
          {selectedProfile.metric}
        </span>
        <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">
          {selectedProfile.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-white/80 max-w-md">
          {selectedProfile.challengeGoal}
        </p>

        {/* Path growth steps */}
        <div className="mt-4 w-full text-left bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-[9px] font-black uppercase text-[#E4FF30] tracking-wider mb-2">Evolution Path</p>
          <ul className="space-y-2">
            {selectedProfile.path.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-bold text-white/90">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-white text-[9px] font-black mt-0.5 border border-white/15">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
