import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const summariesDir = join(process.cwd(), 'public', 'summaries');

    try {
      const files = await readdir(summariesDir);
      const jsonFiles = files.filter((file) => file.endsWith('.json'));

      const summaries = await Promise.all(
        jsonFiles.map(async (filename) => {
          try {
            const filePath = join(summariesDir, filename);
            const content = await readFile(filePath, 'utf8');
            const data = JSON.parse(content);

            return {
              filename,
              timestamp: data.timestamp,
              conversationLength: data.conversationLength,
              userMessages: data.userMessages,
              agentMessages: data.agentMessages,
              summary: data.analysis?.conversation_summary || 'No summary available',
              path: `/summaries/${filename}`,
              createdAt: data.metadata?.createdAt || data.timestamp,
            };
          } catch (error) {
            console.error(`Failed to read summary file ${filename}:`, error);
            return {
              filename,
              error: 'Failed to read file',
              path: `/summaries/${filename}`,
            };
          }
        })
      );

      // Sort by creation date, newest first
      summaries.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.timestamp || 0);
        const dateB = new Date(b.createdAt || b.timestamp || 0);
        return dateB.getTime() - dateA.getTime();
      });

      return NextResponse.json({
        success: true,
        summaries,
        totalCount: summaries.length,
      });
    } catch (dirError) {
      // Directory doesn't exist or is empty
      return NextResponse.json({
        success: true,
        summaries: [],
        totalCount: 0,
        message: 'No summaries directory found or no summaries saved yet',
      });
    }
  } catch (error) {
    console.error('Error listing summaries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list summaries',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
