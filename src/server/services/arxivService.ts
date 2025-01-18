import axios from 'axios';
import { parseString } from 'xml2js';

interface ArxivResponse {
  feed: {
    entry: Array<{
      title: string[];
      summary: string[];
    }>;
  };
}

const parseXMLPromise = (xml: string): Promise<ArxivResponse> => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result: ArxivResponse) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export class ArxivService {
  static async fetchPaperData(arxivId: string) {
    const apiUrl = `http://export.arxiv.org/api/query?id_list=${arxivId}`;
    
    const response = await axios.get(apiUrl);
    const result = await parseXMLPromise(response.data);
    
    const entry = result.feed.entry[0];
    
    if (!entry) {
      throw new Error('Paper not found');
    }

    return {
      arxivId,
      title: entry.title[0].replace(/\n/g, ' ').trim(),
      abstract: entry.summary[0].replace(/\n/g, ' ').trim(),
      fullText: ''  // TODO: Implement full text extraction from pdf or HTML
    };
  }
} 