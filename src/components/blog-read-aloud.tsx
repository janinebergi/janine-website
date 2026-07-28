"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";

export type ReadAloudLabels = {
  play: string;
  pause: string;
  resume: string;
  stop: string;
};

// Zerlegt den Text in satzweise Häppchen. Das umgeht den bekannten Chrome-Bug,
// bei dem lange Utterances nach ~15 Sekunden abbrechen, und lässt das Vorlesen
// flüssiger klingen. Sehr lange Sätze werden zusätzlich an Kommas/Leerzeichen
// unterteilt.
function chunkText(input: string): string[] {
  const MAX = 220;
  const sentences = input.match(/[^.!?…]+[.!?…]+|\S[^.!?…]*$/g) ?? [input];
  const chunks: string[] = [];

  for (const raw of sentences) {
    let rest = raw.trim();
    if (!rest) continue;
    while (rest.length > MAX) {
      let cut = rest.lastIndexOf(",", MAX);
      if (cut < 60) cut = rest.lastIndexOf(" ", MAX);
      if (cut < 60) cut = MAX;
      chunks.push(rest.slice(0, cut + 1).trim());
      rest = rest.slice(cut + 1).trim();
    }
    if (rest) chunks.push(rest);
  }

  return chunks;
}

// Namen, die typischerweise weiblichen Stimmen gehören. Die Web Speech API
// verrät das Geschlecht nicht zuverlässig, deshalb gehen wir über bekannte
// Stimmennamen der gängigen Plattformen (macOS/iOS, Windows, Android/Chrome).
const FEMALE_HINTS = [
  "female",
  "anna",
  "petra",
  "katja",
  "marlene",
  "vicki",
  "amelie",
  "helena",
  "steffi",
  "google deutsch",
  "google us english",
  "google uk english female",
  "samantha",
  "victoria",
  "serena",
  "kate",
  "sonia",
  "libby",
];

// Wörter, die auf besonders natürlich klingende (neuronale/„premium")
// Stimmen hindeuten – die bevorzugen wir stark.
const QUALITY_HINTS = [
  "natural",
  "neural",
  "enhanced",
  "premium",
  "online",
  "google",
];

// Wählt aus den installierten Stimmen die schönste weibliche für die Sprache.
// Fehlt eine passende, fällt die Auswahl auf die beste Stimme der Sprache und
// zuletzt auf die Systemvorgabe (null) zurück.
function pickVoice(
  voices: SpeechSynthesisVoice[],
  target: "de" | "en",
): SpeechSynthesisVoice | null {
  const matching = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(target),
  );
  const pool = matching.length > 0 ? matching : voices;
  if (pool.length === 0) return null;

  const score = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase();
    let points = 0;
    if (FEMALE_HINTS.some((h) => name.includes(h))) points += 10;
    if (QUALITY_HINTS.some((h) => name.includes(h))) points += 5;
    // Lokale Stimmen starten sofort, Netzstimmen klingen dafür oft besser –
    // ein kleiner Bonus für lokale Verfügbarkeit als Tie-Breaker.
    if (v.localService) points += 1;
    if (v.default) points += 1;
    return points;
  };

  return pool
    .map((v) => ({ v, s: score(v) }))
    .sort((a, b) => b.s - a.s)[0].v;
}

type Status = "idle" | "playing" | "paused";

export function BlogReadAloud({
  text,
  lang,
  labels,
}: {
  text: string;
  lang: string;
  labels: ReadAloudLabels;
}) {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  // Jeder Start bekommt eine eigene Nummer, damit verspätete onend-Events aus
  // einem abgebrochenen Durchlauf den neuen Status nicht überschreiben.
  const genRef = useRef(0);
  // Die schönste passende Stimme. Wird asynchron geladen, deshalb im Ref.
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    const synth = window.speechSynthesis;
    const target = lang === "en" ? "en" : "de";

    // getVoices() ist auf manchen Browsern beim ersten Aufruf noch leer und
    // füllt sich erst mit dem "voiceschanged"-Event.
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return;
      voiceRef.current = pickVoice(voices, target);
    };
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    // Beim Verlassen der Seite laufendes Vorlesen stoppen.
    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      synth.cancel();
    };
  }, [lang]);

  const play = () => {
    const synth = window.speechSynthesis;
    const gen = ++genRef.current;
    synth.cancel();

    const utterLang = lang === "en" ? "en-GB" : "de-DE";
    // Der komplette Text – inklusive englischer Begriffe – wird von derselben
    // Stimme gesprochen. Nur satzweise Häppchen gegen den Chrome-Bug.
    const chunks = chunkText(text);

    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.voice = voiceRef.current;
      utterance.lang = utterLang;
      // Flottes Erzähltempo und eine leicht höhere Tonlage lassen die Stimme
      // lebendiger und weniger monoton klingen. Die Satzzeichen bleiben
      // erhalten, sodass Fragen und Ausrufe von der Stimme betont werden.
      utterance.rate = 1.08;
      utterance.pitch = 1.12;
      if (index === chunks.length - 1) {
        utterance.onend = () => {
          if (genRef.current === gen) setStatus("idle");
        };
      }
      synth.speak(utterance);
    });

    setStatus("playing");
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus("paused");
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setStatus("playing");
  };

  const stop = () => {
    genRef.current++;
    window.speechSynthesis.cancel();
    setStatus("idle");
  };

  if (!supported) return null;

  const pillBase =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
  const primary = `${pillBase} bg-accent-soft text-accent-hover hover:bg-accent hover:text-accent-foreground`;
  const secondary = `${pillBase} border border-border text-muted hover:text-foreground`;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {status === "idle" && (
        <button type="button" onClick={play} className={primary}>
          <Volume2 size={16} />
          {labels.play}
        </button>
      )}

      {status === "playing" && (
        <button type="button" onClick={pause} className={primary}>
          <Pause size={16} />
          {labels.pause}
        </button>
      )}

      {status === "paused" && (
        <button type="button" onClick={resume} className={primary}>
          <Play size={16} />
          {labels.resume}
        </button>
      )}

      {status !== "idle" && (
        <button type="button" onClick={stop} className={secondary}>
          <Square size={16} />
          {labels.stop}
        </button>
      )}
    </div>
  );
}
