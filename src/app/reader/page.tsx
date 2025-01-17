"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DynamicPDFViewer from "@/components/DynamicPDFViewer";
import { Suspense } from "react";

function ReaderContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const url = searchParams.get("url");

  // If ID is provided, use local API endpoint
  const pdfUrl = id
    ? `/api/pdf?id=${encodeURIComponent(id)}`
    : url || "/pdfs/2307.16832v1.pdf"; // Fallback to default if no URL

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      <DynamicPDFViewer url={pdfUrl} />
    </div>
  );
}

export default function ReaderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ReaderContent />
      </Suspense>
    </div>
  );
}
