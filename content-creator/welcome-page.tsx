"use client";

import { useCompletion } from "ai/react";
import {
  BarChart2,
  Clock,
  CreditCard,
  Edit3,
  FileText,
  HelpCircle,
  Lightbulb,
  PenSquare,
  User,
  Wand2,
} from "lucide-react";
import { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { useAppState } from "~/content-creator/store";

export function WelcomePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold mr-2">
            C
          </div>
          <span className="font-semibold text-lg">CLARITY</span>
          <span className="ml-2 px-2 py-1 bg-gray-200 text-xs rounded-full">
            TRIAL
          </span>
        </div>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r flex flex-col py-4 space-y-4 overflow-y-auto">
          <SidebarItem
            icon={<PenSquare className="h-5 w-5" />}
            label="Magic Write"
          />
          <SidebarItem icon={<FileText className="h-5 w-5" />} label="Post" />
          <SidebarItem
            icon={<BarChart2 className="h-5 w-5" />}
            label="Analysis"
          />
          <SidebarItem icon={<Lightbulb className="h-5 w-5" />} label="Ideas" />
          <SidebarItem
            icon={<FileText className="h-5 w-5" />}
            label="Templates"
          />
          <SidebarItem icon={<Edit3 className="h-5 w-5" />} label="Scratch" />
          <SidebarItem
            icon={<CreditCard className="h-5 w-5" />}
            label="Billing"
          />
          <SidebarItem icon={<HelpCircle className="h-5 w-5" />} label="Help" />
          <SidebarItem icon={<Clock className="h-5 w-5" />} label="3d left" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-4">
            Hi Keith, welcome to CClarity
          </h1>
          <h2 className="text-4xl font-bold mb-8">
            What do you want to write today?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <PromtSuggestionButton content="🖋 My personal story" />
            <PromtSuggestionButton content="💡 My contrarian view" />
            <PromtSuggestionButton content="🎯 My challenge and solution" />
            <PromtSuggestionButton content="💡 A valuable insight" />
            <PromtSuggestionButton content="✅ What I did and learnt" />
            <PromtSuggestionButton content="📢 Promote an offer" />
          </div>
          <div className="space-y-2">
            <PromtEditor />
            <MagicOutput />
          </div>
        </div>
      </div>
    </div>
  );
}

function PromtSuggestionButton({ content }: { content: string }) {
  const setPromt = useAppState((store) => store.setPromt);

  return (
    <Button variant="outline" onClick={() => setPromt(content)}>
      {content}
    </Button>
  );
}

function SidebarItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
      <div className="w-10 h-10 flex items-center justify-center">{icon}</div>
      <span className="text-xs text-center mt-1 leading-tight">{label}</span>
    </div>
  );
}

function PromtEditor() {
  const promt = useAppState((state) => state.promt);
  const setPromt = useAppState((state) => state.setPromt);

  return (
    <Textarea
      placeholder="e.g. I saved a customer $10,000 with this advice..."
      className="flex-grow"
      rows={4}
      value={promt}
      onChange={(e) => setPromt(e.target.value)}
    />
  );
}

function MagicOutput() {
  const promt = useAppState((state) => state.promt);

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/completion",
  });

  function onComplete() {
    complete(promt);
  }

  if (promt === "") {
    return <MagicWriteButton />;
  }

  if (isLoading) {
    return (
      <>
        <div className="w-full text-right">
          <MagicWriteButton />
        </div>
        <div className="flex flex-col space-y-3 rounded-lg shadow bg-white p-4">
          <Skeleton className="h-4 w-1/3 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Error:</h3>
      <p>{error.message}</p>
    </div>;
  }

  return (
    <>
      <div className="w-full text-right">
        <MagicWriteButton onClick={onComplete} />
      </div>
      {completion && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Magic Write Output:</h3>
          <p>{completion}</p>
        </div>
      )}
    </>
  );
}

function MagicWriteButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button onClick={onClick} disabled={!onClick}>
      <Wand2 className="mr-2 h-4 w-4" />
      Magic Write
    </Button>
  );
}
