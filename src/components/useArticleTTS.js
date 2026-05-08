import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

// Strip HTML safely (article content may contain <br>, <p>, etc.)
export const stripHtml = (html) => {
  if (typeof window === "undefined") return html || "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
};

// Known names by browser:
//   macOS:    "Kanya"
//   Google:   "Premwadee" / "ภาษาไทย"
//   Windows:  "Pattara" / "Achara"
//   Android:  "Noppawan" / "Sarinrat"
const FEMALE_HINTS = [
  "kanya",
  "premwadee",
  "pattara",
  "achara",
  "noppawan",
  "sarinrat",
  "female",
];

export const pickThaiFemaleVoice = (voices) => {
  if (!voices || voices.length === 0) return null;
  const thai = voices.filter((v) =>
    (v.lang || "").toLowerCase().startsWith("th")
  );
  const named = thai.find((v) =>
    FEMALE_HINTS.some((h) => (v.name || "").toLowerCase().includes(h))
  );
  if (named) return named;
  if (thai.length) return thai[0];
  return null;
};

/**
 * Split text into utterance-sized chunks. Web Speech engines silently drop
 * the start of utterances longer than ~250 chars (Chrome especially).
 *
 * Strategy:
 *  1. Honour real sentence boundaries first ('.', '!', '?', '\n') — each
 *     ends a chunk.
 *  2. If a sentence is still longer than maxLen, slice it at the last
 *     space inside the limit (Thai text uses spaces between phrases).
 *  3. If even that fails (one impossibly long token), hard-cut at maxLen.
 *
 * Always returns at least one chunk for non-empty input.
 */
export const chunkTextForSpeech = (text, maxLen = 200) => {
  if (!text) return [];
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return [];

  // 1) split on real sentence boundaries
  const sentences = trimmed
    .split(/(?<=[.!?\n])\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  // 2) slice each long sentence on word boundaries
  const out = [];
  for (const sentence of sentences) {
    let rest = sentence;
    while (rest.length > maxLen) {
      let cut = rest.lastIndexOf(" ", maxLen);
      if (cut <= 0) cut = maxLen; // no space found → hard-cut
      out.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) out.push(rest);
  }
  return out.length ? out : [trimmed];
};

/**
 * Article-aware Thai TTS hook built on top of react-speech-kit.
 *
 * Adds on top of the library:
 *  - 220-char chunking (Web Speech engines cut off long utterances).
 *  - state machine: idle | loading | playing | paused.
 *  - Thai female voice priority (Kanya / Premwadee / Pattara / Achara / Noppawan / Sarinrat).
 *  - Pause/Resume via raw speechSynthesis (the library does not expose them).
 *  - Auto-cancel on unmount or when the source text changes.
 */
export const useArticleTTS = (text) => {
  const [state, setState] = useState("idle"); // idle | loading | playing | paused
  const chunksRef = useRef([]);
  const idxRef = useRef(0);
  const speakNextRef = useRef(() => {});

  const handleEnd = useCallback(() => {
    idxRef.current += 1;
    if (idxRef.current >= chunksRef.current.length) {
      setState("idle");
      return;
    }
    speakNextRef.current();
  }, []);

  const { supported, speak, cancel, voices } = useSpeechSynthesis({
    onEnd: handleEnd,
  });

  const speakNext = useCallback(() => {
    const i = idxRef.current;
    const chunks = chunksRef.current;
    if (i >= chunks.length) {
      setState("idle");
      return;
    }
    const voice = pickThaiFemaleVoice(voices);
    speak({
      text: chunks[i],
      voice,
      rate: 0.95,
      pitch: 1.05,
      volume: 1,
    });
  }, [speak, voices]);

  // Keep ref to latest speakNext so handleEnd never uses a stale closure
  speakNextRef.current = speakNext;

  const play = useCallback(() => {
    if (!supported || !text) return;
    if (state === "paused") {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
      setState("playing");
      return;
    }
    cancel();
    chunksRef.current = chunkTextForSpeech(text);
    idxRef.current = 0;
    setState("loading");
    speakNext();
    // No `onstart` is exposed by react-speech-kit; flip loading→playing on the
    // next tick once the engine has actually picked up the utterance.
    setTimeout(() => {
      setState((s) => (s === "loading" ? "playing" : s));
    }, 60);
  }, [supported, text, state, cancel, speakNext]);

  const pause = useCallback(() => {
    if (!supported) return;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    setState("paused");
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    cancel();
    idxRef.current = 0;
    chunksRef.current = [];
    setState("idle");
  }, [supported, cancel]);

  // Cancel on unmount or when the article text changes
  useEffect(() => {
    return () => {
      if (supported) cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return {
    supported,
    state,
    play,
    pause,
    stop,
    hasThaiVoice: !!pickThaiFemaleVoice(voices),
    voices,
  };
};
