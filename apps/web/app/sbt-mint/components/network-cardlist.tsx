'use client';

import type { NetworkConfig } from '@/config/network-config';
import Image from 'next/image';
import Link from 'next/link';

export default function NetworkCardlist({ network }: { network: NetworkConfig }) {
  const networkUrl = network.networkUrl;

  return (
    <div className="border relative rounded-md p-6 shadow space-y-3">
      <div className="aspect-video flex items-center justify-center">
        <Image
          src={`/network-banners/${networkUrl}-banner.png`}
          alt={network.networkName}
          width={640}
          height={360}
          className="dark:hidden p-6"
        />
        <Image
          src={`/network-dark-banners/${networkUrl}-banner.png`}
          alt={network.networkName}
          width={640}
          height={360}
          className="hidden dark:block p-6"
        />
      </div>
      <h2 className="font-bold">
        {network.networkName}
        <Link href={`/sbt-mint/${networkUrl}`} className="absolute inset-0" />
      </h2>
      <p>{network.networkName}のNFTをミントできます</p>
    </div>
  );
}
