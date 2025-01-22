// Mock must be defined before imports
jest.mock('../src/server/config/supabase');

// Set up test environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-key';

import { PDFService } from '../src/server/services/pdfService';
import { PDFData } from '../src/server/types/pdfData';
import { readFile } from 'fs/promises';
import path from 'path';

describe('PDFService', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('extractFromPDF', () => {
    it('should successfully extract data from a valid PDF file', async () => {
      // Given: A valid PDF file from our fixtures
      const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', '2307.16832v1.pdf');
      const pdfBuffer = await readFile(pdfPath);

      // When: We try to extract data from it
      const pdfData = await PDFService.extractFromPDF(pdfBuffer);

      // Then: We should get valid PDF data
      expect(pdfData).toBeDefined();
      expect(typeof pdfData).toBe('object');
      expect(pdfData).toHaveProperty('text');
      expect(pdfData).toHaveProperty('numpages');
      expect(pdfData).toHaveProperty('metadata');
      expect(pdfData).toHaveProperty('version');
      expect(typeof pdfData.text).toBe('string');
      expect(pdfData.text.length).toBeGreaterThan(0);
      expect(pdfData.numpages).toBeGreaterThan(0);
    });

    it('should handle invalid PDF data by throwing an error', async () => {
      // Given: Some invalid data that's not a PDF
      const invalidBuffer = Buffer.from('not a valid PDF');

      // When/Then: Trying to extract text should throw an error
      await expect(PDFService.extractFromPDF(invalidBuffer))
        .rejects
        .toThrow('Failed to extract text from PDF');
    });
  });
}); 