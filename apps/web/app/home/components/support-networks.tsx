'use client';
import { networkConfig } from '@/config/network-config';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function SupportNetworks() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredNetworks = networkConfig.filter((network) => network.mintCollectionAddress);
  const loopedNetworks = [...filteredNetworks, ...filteredNetworks, ...filteredNetworks];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const totalWidth = scrollContainer.scrollWidth / 3;
    const scrollDuration = 30000; // 30 seconds for one complete loop
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;

      const scrollPosition = ((elapsedTime % scrollDuration) / scrollDuration) * totalWidth;
      scrollContainer.scrollLeft = scrollPosition;

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <motion.div
      className="w-full lg:py-4 pt-10 bg-background overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div ref={scrollRef} className="flex overflow-x-hidden">
          {loopedNetworks.map((network, index) => (
            <motion.div
              key={`${network.networkId}-${index}`}
              className="flex-shrink-0 w-16 sm:w-24 mx-2 sm:mx-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto">
                <Image
                  src={`/network-logos/${network.networkUrl}-logo.png`}
                  alt={network.networkName}
                  fill
                  sizes="(max-width: 640px) 48px, 64px"
                  className="dark:hidden object-contain"
                />
                <Image
                  src={`/network-dark-logos/${network.networkUrl}-logo.png`}
                  alt={network.networkName}
                  fill
                  sizes="(max-width: 640px) 48px, 64px"
                  className="hidden dark:block object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
