export function extractArxivId(input: string | null): string | null {
  if (!input || typeof input !== 'string') return null;
  
  try {
    // Clean the input
    let cleanInput = input.trim();
    
    // Handle URL-encoded strings
    try {
      if (cleanInput.includes('%2F')) {
        cleanInput = decodeURIComponent(cleanInput);
      }
    } catch (e) {
      console.error('Error decoding URL:', e);
      // Continue with original input if decoding fails
    }
    
    // Direct arXiv ID pattern (with optional version)
    const directIdPattern = /^(\d{4}\.\d{4,5})(v\d+)?$/;
    if (directIdPattern.test(cleanInput)) {
      return cleanInput.split('v')[0]; // Remove version number if present
    }
    
    // URL patterns
    const urlPatterns = [
      // Standard arxiv.org URLs
      /arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})(v\d+)?/,
      // arxiv.org/abs/arXiv: format
      /arxiv\.org\/abs\/arXiv:(\d{4}\.\d{4,5})(v\d+)?/,
      // Direct PDF links
      /arxiv\.org\/pdf\/(\d{4}\.\d{4,5})(v\d+)?\.pdf/,
      // URL parameter format
      /url=.*arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})(v\d+)?/
    ];

    for (const pattern of urlPatterns) {
      const match = cleanInput.match(pattern);
      if (match && match[1]) {
        return match[1]; // Return just the ID without version number
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting arXiv ID:', error);
    return null;
  }
} 