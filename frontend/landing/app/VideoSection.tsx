"use client";

import { useEffect, useRef } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">Conheça a Lumiar</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
              Veja como é um dia aqui dentro
            </h2>
            <p className="text-gray-500 font-body text-lg leading-relaxed">
              Um espaço pensado para crianças, com cor, cuidado e profissionais que amam o que fazem. Veja a experiência de estar na Lumiar.
            </p>
          </div>
          <div className="flex justify-center">
            <div
              className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl"
              style={{ width: "260px", aspectRatio: "9/16" }}
            >
              <video
                ref={videoRef}
                src="/images/videolumiar1.mp4"
                muted
                playsInline
                loop
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
