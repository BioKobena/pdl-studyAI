"use client";
import { Component } from "@/component/ui/quiz";
import { withAuth } from "@/lib/api/withAuth.client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
function DemoOne() {
  const router = useRouter();
  return (
    <main className="flex-1 p-2 bg-gray-50">
      <div className="flex items-center justify-center gap-8 mb-5">
        <button
          onClick={() => router.back()}
          className="text-[#3FA9D9] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={25} strokeWidth={3} />
          </button>
            <h1 className="text-[#3FA9D9] text-2xl uppercase tracking-wide">
              Votre Quiz
            </h1>
      </div>
      <Component />
    </main>
  );
}
export default withAuth(DemoOne);
