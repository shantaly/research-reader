"use client";

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import TextSelectionSidebar from './TextSelectionSidebar';
import { useChat } from '@/contexts/ChatContext';

// Configure worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

function PDFViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Extract arxivId from URL
  const arxivId = url.includes('id=') 
    ? new URLSearchParams(url.split('?')[1]).get('id') || ''
    : url.split('/').pop()?.replace('.pdf', '') || '';

  // Get chat messages for current paper
  const { messages } = useChat();
  const hasChatHistory = messages.some(msg => msg.arxivId === arxivId);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
        setShowSidebar(true);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // If clicking inside sidebar, do nothing
      if (sidebarRef.current?.contains(e.target as Node)) {
        return;
      }

      const selection = window.getSelection();
      const hasSelection = selection && selection.toString().trim();

      // Only hide sidebar if there's no selection AND no chat history
      if (!hasSelection && !hasChatHistory) {
        setShowSidebar(false);
      }
      
      // Clear selection if clicking outside
      if (!hasSelection) {
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasChatHistory]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-center max-w-fit mx-auto">
        <div className="w-full mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-medium">
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <button
              onClick={() => setShowSidebar(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-150 ease-in-out shadow-sm hover:shadow flex items-center gap-2"
            >
              <span>💬</span>
              Chat
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="border rounded-lg shadow-lg overflow-hidden">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-96">
                  <div className="text-red-600 text-center">Failed to load PDF.</div>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="mx-auto"
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                }
              />
            </Document>
          </div>
        </div>
      </div>
      {(showSidebar || selectedText || hasChatHistory) && (
        <div ref={sidebarRef}>
          <TextSelectionSidebar 
            selectedText={selectedText} 
            currentPage={pageNumber}
            arxivId={arxivId}
            onClose={() => setShowSidebar(false)}
          />
        </div>
      )}
    </div>
  );
}

export default PDFViewer;
