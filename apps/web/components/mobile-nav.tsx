'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { gaslessERC721AbiMap, soulboundERC721AbiMap, standardERC721AbiMap } from '@/config/abi-map';
import { type NetworkConfig, networkConfig } from '@/config/network-config';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubSheetOpen, setIsSubSheetOpen] = useState(false);
  const [activeSubSheet, setActiveSubSheet] = useState<'mint' | 'gasless-mint' | 'sbt-mint' | null>(
    null
  );
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsSubSheetOpen(false);
        setActiveSubSheet(null);
        setIsClosing(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleLinkClick = () => {
    setIsClosing(true);
    setIsOpen(false);
  };

  const handleMintClick = (type: 'mint' | 'gasless-mint' | 'sbt-mint') => {
    setIsSubSheetOpen(true);
    setActiveSubSheet(type);
  };

  const getNetworkFilter = (type: 'mint' | 'gasless-mint' | 'sbt-mint') => {
    switch (type) {
      case 'mint':
        return (network: NetworkConfig) =>
          network.mintCollectionAddress && standardERC721AbiMap[network.networkId];
      case 'gasless-mint':
        return (network: NetworkConfig) =>
          network.gaslessMintCollectionAddress && gaslessERC721AbiMap[network.networkId];
      case 'sbt-mint':
        return (network: NetworkConfig) =>
          network.soulboundCollectionAddress && soulboundERC721AbiMap[network.networkId];
      default:
        return () => false;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" onClick={() => setIsOpen(true)}>
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <div className="pb-4 text-left">
              <Link href="/" className="inline-block" onClick={handleLinkClick}>
                <Image src="/image/logo.svg" alt="logo" width={40} height={40} />
              </Link>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          <Button variant="ghost" className="justify-start" onClick={() => handleMintClick('mint')}>
            Mint
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleMintClick('gasless-mint')}
          >
            Gasless Mint
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleMintClick('sbt-mint')}
          >
            SBT Mint
          </Button>
        </div>
        <Sheet open={isSubSheetOpen} onOpenChange={setIsSubSheetOpen}>
          <SheetContent side="left">
            <SheetHeader className="pb-4 text-left">
              <SheetTitle>
                <Link
                  href={`/${activeSubSheet}`}
                  className="inline-block"
                  onClick={handleLinkClick}
                >
                  {activeSubSheet === 'mint'
                    ? 'Mint Networks'
                    : activeSubSheet === 'gasless-mint'
                    ? 'Gasless Mint Networks'
                    : 'SBT Mint Networks'}
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              {networkConfig.filter(getNetworkFilter(activeSubSheet || 'mint')).map((network) => (
                <Button variant="ghost" className="justify-start" key={network.networkId} asChild>
                  <Link href={`/${activeSubSheet}/${network.networkUrl}`} onClick={handleLinkClick}>
                    {network.networkName}
                  </Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </SheetContent>
    </Sheet>
  );
}
