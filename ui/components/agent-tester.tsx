"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/contexts/app-context";
import { sendMessage } from "@/lib/a2a-client";
import { Loader2, Send, AlertCircle } from "lucide-react";

interface AgentTesterProps {
  agentId: string;
  agentUrl: string;
  examples: string[];
}

export function AgentTester({ agentId, agentUrl, examples }: AgentTesterProps) {
  const { llmProvider, apiKey, isApiKeySet } = useApp();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !isApiKeySet) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await sendMessage(
        { provider: llmProvider, apiKey },
        { agentUrl, text: input }
      );

      if (result.success) {
        setResponse(result.result || "No response");
      } else {
        setError(
          result.error?.data?.details ||
            result.error?.message ||
            "Unknown error"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  if (!isApiKeySet) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <p>Please set your API key in the settings to use this agent.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Input Message
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your message..."
              rows={3}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Quick Examples</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                >
                  {example.slice(0, 30)}...
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(response || error) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {error ? "Error" : "Response"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{response}</pre>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
