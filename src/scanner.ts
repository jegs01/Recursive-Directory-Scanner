import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Class representing a directory scanner.
 * It scans directories recursively and lists their contents.
 */
class DirectoryScanner {
    private directoryList: string[] = [];

    /**
     * Recursively scans a directory and lists its contents.
     * @param dirPath - The path of the directory to scan.
     */
    async scanDirectory(dirPath: string): Promise<void> {
        try {
            console.log(`Attempting to read directory: ${dirPath}`);
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    this.directoryList.push(fullPath);
                    console.log(`Scanning directory: ${fullPath}`);
                    await this.scanDirectory(fullPath);
                } else {
                    this.directoryList.push(fullPath);
                    console.log(`Found file: ${fullPath}`);
                }
            }
        } catch (error) {
            this.handleError(error, `Error accessing ${dirPath}`);
        }
    }

    /**
     * Gets the list of scanned directories and files.
     * @returns The list of scanned directories and files.
     */
    getScannedList(): string[] {
        return this.directoryList;
    }

    /**
     * Saves the scanned directory list to a file.
     * @param filePath - The path of the file to save the list.
     */
    async saveToFile(filePath: string): Promise<void> {
        try {
            if (!this.directoryList.length) {
                throw new Error("No directories or files found to save.");
            }
            const correctedFilePath = filePath.endsWith('/') ? `${filePath}directory_list_output.txt` : filePath;
            await fs.writeFile(correctedFilePath, this.directoryList.join('\n'));
            console.log(`Directory list successfully saved to ${correctedFilePath}`);
        } catch (error) {
            this.handleError(error, "Error saving to file");
        }
    }

    /**
     * Prints the scanned list to the console in a formatted manner.
     */
    printScannedList(): void {
        console.log("Scanned Directory List:");
        console.log("========================");
        this.directoryList.forEach((item, index) => {
            console.log(`${index + 1}. ${item}`);
        });
        console.log("========================");
    }

    /**
     * Clears the scanned list.
     */
    clearList(): void {
        this.directoryList = [];
        console.log("Directory list cleared.");
    }

    /**
     * Handles errors by logging them in a standardized way.
     * @param error - The error object.
     * @param context - The context in which the error occurred.
     */
    private handleError(error: unknown, context: string): void {
        if (error instanceof Error) {
            console.error(`${context}: ${error.message}`);
        } else {
            console.error(`${context}: Unknown error occurred.`);
        }
    }
}

/**
 * Main function to execute the directory scanning.
 */
async function main() {
    const scanner = new DirectoryScanner();
    const rootDirectory = path.resolve('.');
    console.log(`Starting scan in: ${rootDirectory}`);
    
    await scanner.scanDirectory(rootDirectory);
    
    console.log("Scan Complete.");
    scanner.printScannedList();
    
    await scanner.saveToFile('directory_list.txt');
    console.log("Execution finished successfully.");
}

// Execute the script and handle any fatal errors
main().catch(error => {
    console.error("Fatal Error:", error instanceof Error ? error.message : "Unknown Fatal Error");
});

export default DirectoryScanner;
