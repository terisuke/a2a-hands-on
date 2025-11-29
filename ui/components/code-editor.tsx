"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/app-context";
import {
  executePlaygroundCode,
  defaultCode,
  sampleTemplates,
  ExecutionResult,
} from "@/lib/playground-executor";
import { Play, Loader2, AlertCircle } from "lucide-react";

export function CodeEditor() {
  const { llmProvider, apiKey, isApiKeySet, agents } = useApp();
  const [code, setCode] = useState(defaultCode);
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExecute = async () => {
    if (!isApiKeySet) return;

    setIsExecuting(true);
    setResults([]);

    try {
      const executionResults = await executePlaygroundCode(
        code,
        { provider: llmProvider, apiKey },
        agents
      );
      setResults(executionResults);
    } catch (err) {
      setResults([
        {
          type: "error",
          content: err instanceof Error ? err.message : "Execution failed",
        },
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTemplateChange = (templateName: string) => {
    const template = sampleTemplates.find((t) => t.name === templateName);
    if (template) {
      setCode(template.code);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isApiKeySet) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <p>Please set your API key in the settings to use the playground.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Code Editor</CardTitle>
          <Select onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Sample Templates" />
            </SelectTrigger>
            <SelectContent>
              {sampleTemplates.map((template) => (
                <SelectItem key={template.name} value={template.name}>
                  <div className="flex flex-col items-start">
                    <span>{template.name}</span>
                    {"description" in template && (
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 border rounded-md overflow-hidden min-h-[400px]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
          <Button
            className="mt-4"
            onClick={handleExecute}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Execution Results</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <ScrollArea className="h-[500px] rounded-md border p-4">
            {results.length === 0 ? (
              <p className="text-muted-foreground">
                Run your code to see results here.
              </p>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md ${
                      result.type === "error"
                        ? "bg-red-50 border border-red-200"
                        : result.type === "agent"
                        ? result.language === "Python"
                          ? "bg-yellow-50 border border-yellow-300"
                          : "bg-blue-50 border border-blue-300"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {result.type === "agent" && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                result.language === "Python"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                result.language === "Python"
                                  ? "bg-yellow-600"
                                  : "bg-blue-600"
                              }
                            >
                              {result.language}
                            </Badge>
                            <span className="font-medium">
                              {result.agent}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {result.duration}ms
                          </span>
                        </div>
                        <div className="text-sm mb-2">
                          <span className="font-medium">Input:</span>{" "}
                          <span className="text-muted-foreground">
                            {result.input && result.input.length > 100
                              ? result.input.slice(0, 100) + "..."
                              : result.input}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Output:</span>
                          <pre className="whitespace-pre-wrap mt-1 bg-white/50 p-2 rounded">
                            {result.output}
                          </pre>
                        </div>
                      </>
                    )}
                    {result.type === "log" && (
                      <pre className="whitespace-pre-wrap text-sm">
                        {result.content}
                      </pre>
                    )}
                    {result.type === "error" && (
                      <p className="text-red-600 text-sm">{result.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
