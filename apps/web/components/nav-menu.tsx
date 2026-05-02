'use client';

import * as React from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { gaslessERC721AbiMap, soulboundERC721AbiMap, standardERC721AbiMap } from '@/config/abi-map';
import { networkConfig } from '@/config/network-config';
import { cn } from '@/lib/utils';

export default function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Mint</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 lg:w-[400px]">
              {networkConfig
                .filter(
                  (network) =>
                    network.mintCollectionAddress && standardERC721AbiMap[network.networkId]
                )
                .map((network) => (
                  <ListItem
                    key={network.networkId}
                    title={network.networkName}
                    href={`/mint/${network.networkUrl}`}
                  />
                ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gasless Mint</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 lg:w-[400px]">
              {networkConfig
                .filter(
                  (network) =>
                    network.gaslessMintCollectionAddress && gaslessERC721AbiMap[network.networkId]
                )
                .map((network) => (
                  <ListItem
                    key={network.networkId}
                    title={network.networkName}
                    href={`/gasless-mint/${network.networkUrl}`}
                  />
                ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>SBT Mint</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 lg:w-[400px]">
              {networkConfig
                .filter(
                  (network) =>
                    network.soulboundCollectionAddress && soulboundERC721AbiMap[network.networkId]
                )
                .map((network) => (
                  <ListItem
                    key={network.networkId}
                    title={network.networkName}
                    href={`/sbt-mint/${network.networkUrl}`}
                  />
                ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
