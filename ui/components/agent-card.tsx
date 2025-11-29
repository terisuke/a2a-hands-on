"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  language: "Python" | "TypeScript";
  skillId: string;
  tags: string[];
  examples: string[];
}

interface AgentCardProps {
  agent: AgentInfo;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{agent.name}</CardTitle>
          <Badge variant={agent.language === "Python" ? "default" : "secondary"}>
            {agent.language}
          </Badge>
        </div>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Tags</p>
            <div className="flex flex-wrap gap-1">
              {agent.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Example Inputs</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {agent.examples.slice(0, 2).map((example, i) => (
                <li key={i} className="truncate">
                  &ldquo;{example}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0">
        <Link href={`/agents/${agent.id}`}>
          <Button className="w-full">
            Try Agent
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
