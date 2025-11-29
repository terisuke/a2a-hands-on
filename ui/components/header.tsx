"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ApiKeyDialog } from "./api-key-dialog";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Agents", href: "/agents" },
  { name: "Playground", href: "/playground" },
  { name: "Learn", href: "/learn" },
];

export function Header() {
  const pathname = usePathname();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">A2A Handson</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyDialog(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            API Settings
          </Button>
        </div>
      </div>
      <ApiKeyDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog} />
    </header>
  );
}
