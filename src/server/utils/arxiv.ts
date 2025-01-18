export function extractArxivId(input: string | null): string | null {
  if (!input) return null;
  
  // Handle full URLs
  const urlMatch = input.match(/arxiv\.org\/(?:abs|pdf)\/(\d+\.\d+)/);
  if (urlMatch) return urlMatch[1];

  // Handle raw arXiv IDs
  const idMatch = input.match(/(\d+\.\d+)/);
  if (idMatch) return idMatch[1];

  return null;
} 