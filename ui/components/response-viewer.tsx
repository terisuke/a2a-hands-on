"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResponseViewerProps {
  title: string;
  response: unknown;
  raw?: string;
}

export function ResponseViewer({ title, response, raw }: ResponseViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formatted">
          <TabsList>
            <TabsTrigger value="formatted">Formatted</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="formatted">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {typeof response === "string"
                  ? response
                  : JSON.stringify(response, null, 2)}
              </pre>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="raw">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {raw || JSON.stringify(response, null, 2)}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
