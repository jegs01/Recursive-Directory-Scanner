import { describe, it, expect, vi } from 'vitest';
import DirectoryScanner from '../scanner';
import * as fs from 'fs/promises';

describe('DirectoryScanner', () => {
    it('should scan a directory and return a list', async () => {
        const scanner = new DirectoryScanner();
        await scanner.scanDirectory('.');
        expect(scanner.getScannedList().length).toBeGreaterThan(0);
    });

    it('should handle errors when scanning an invalid directory', async () => {
        const scanner = new DirectoryScanner();
        console.error = vi.fn(); // Mock console.error
        await scanner.scanDirectory('/invalid-path');
        expect(console.error).toHaveBeenCalled();
    });

    it('should save the directory list to a file', async () => {
        const scanner = new DirectoryScanner();
        await scanner.scanDirectory('.');
        await scanner.saveToFile('test_output.txt');
        const content = await fs.readFile('test_output.txt', 'utf-8');
        expect(content.length).toBeGreaterThan(0);
    });
});
