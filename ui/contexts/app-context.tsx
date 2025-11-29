"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LLMProvider = "openai" | "gemini";

interface AgentUrls {
  // Python Agents
  encourager: string;
  rephraser: string;
  translator: string;
  summarizer: string;
  // TypeScript Agents
  namer: string;
  commit: string;
  reviewer: string;
  documenter: string;
}

interface AppState {
  llmProvider: LLMProvider;
  apiKey: string;
  isApiKeySet: boolean;
  agents: AgentUrls;
  setLLMProvider: (provider: LLMProvider) => void;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const DEFAULT_AGENTS: AgentUrls = {
  // Python Agents
  encourager: process.env.NEXT_PUBLIC_AGENT_ENCOURAGER_URL || "http://localhost:8080",
  rephraser: process.env.NEXT_PUBLIC_AGENT_REPHRASER_URL || "http://localhost:8081",
  translator: process.env.NEXT_PUBLIC_AGENT_TRANSLATOR_URL || "http://localhost:8084",
  summarizer: process.env.NEXT_PUBLIC_AGENT_SUMMARIZER_URL || "http://localhost:8085",
  // TypeScript Agents
  namer: process.env.NEXT_PUBLIC_AGENT_NAMER_URL || "http://localhost:8082",
  commit: process.env.NEXT_PUBLIC_AGENT_COMMIT_URL || "http://localhost:8083",
  reviewer: process.env.NEXT_PUBLIC_AGENT_REVIEWER_URL || "http://localhost:8086",
  documenter: process.env.NEXT_PUBLIC_AGENT_DOCUMENTER_URL || "http://localhost:8087",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [llmProvider, setLLMProviderState] = useState<LLMProvider>("openai");
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);

  useEffect(() => {
    const savedProvider = localStorage.getItem("llmProvider") as LLMProvider | null;
    const savedApiKey = localStorage.getItem("apiKey");

    if (savedProvider) {
      setLLMProviderState(savedProvider);
    }
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  const setLLMProvider = (provider: LLMProvider) => {
    setLLMProviderState(provider);
    localStorage.setItem("llmProvider", provider);
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem("apiKey", key);
    setIsApiKeySet(!!key);
  };

  const clearApiKey = () => {
    setApiKeyState("");
    localStorage.removeItem("apiKey");
    setIsApiKeySet(false);
  };

  return (
    <AppContext.Provider
      value={{
        llmProvider,
        apiKey,
        isApiKeySet,
        agents: DEFAULT_AGENTS,
        setLLMProvider,
        setApiKey,
        clearApiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
