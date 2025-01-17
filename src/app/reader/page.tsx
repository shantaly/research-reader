"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DynamicPDFViewer from "@/components/DynamicPDFViewer";

export default function ReaderPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const url = searchParams.get("url");

  // If ID is provided, use local API endpoint
  const pdfUrl = id
    ? `/api/pdf?id=${encodeURIComponent(id)}`
    : url || "/pdfs/2307.16832v1.pdf"; // Fallback to default if no URL

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-bold">PDF Reader</h1> */}
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
        <DynamicPDFViewer url={pdfUrl} />
      </div>
    </div>
  );
}
