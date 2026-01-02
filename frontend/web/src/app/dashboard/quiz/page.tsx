"use client";
import { Component } from "@/component/ui/quiz";
import { withAuth } from "@/lib/api/withAuth.client";
function DemoOne() {
  return (
    <main className="flex-1 p-8 bg-gray-50">
      <Component />
    </main>
  );
}
export default withAuth(DemoOne);
