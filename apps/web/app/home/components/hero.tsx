'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const images = [
    '/pet-nft/pet-nft-1.jpeg',
    '/alien-nft/alien-nft-1.jpg',
    '/car-nft/car-nft-1.jpg',
    '/pet-nft/pet-nft-2.jpeg',
  ];

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isMounted) {
    return null; // または簡単なローディング表示
  }

  return (
    <div className="py-5 lg:py-14">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 lg:pr-12 mb-0 mt-10 lg:mt-0 order-last lg:order-first">
            <motion.h1
              className="text-4xl lg:text-6xl font-bold mb-5 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Various NFT Collection
            </motion.h1>
            <motion.p
              className="text-muted-foreground mb-4 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Free Various NFT Collection
              <br />
              Only Testnet
            </motion.p>
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild>
                <Link href="/mint">Go to Mint Page</Link>
              </Button>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 order-first lg:order-last">
            <div className="grid grid-cols-2 gap-4">
              {images.map((src, index) => (
                <motion.div
                  key={src}
                  className="relative overflow-hidden rounded-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Image
                    src={src}
                    alt={`NFT Image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
