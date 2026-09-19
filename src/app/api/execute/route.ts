import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const id = `dsa_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const srcFile = join(tmpdir(), `${id}.cpp`);
  const binFile = join(tmpdir(), id);

  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'code is required' }, { status: 400 });
    }

    writeFileSync(srcFile, code, 'utf8');

    // Compile
    try {
      execSync(`g++ -std=c++17 -O2 -o "${binFile}" "${srcFile}" 2>&1`, {
        timeout: 10000,
        stdio: 'pipe',
      });
    } catch (compileErr: unknown) {
      const msg = compileErr instanceof Error ? (compileErr as NodeJS.ErrnoException & { stdout?: Buffer }).stdout?.toString() ?? compileErr.message : String(compileErr);
      return NextResponse.json({ stdout: '', stderr: '', compileError: msg, exitCode: 1 });
    }

    // Run
    let stdout = '';
    let stderr = '';
    let exitCode = 0;
    try {
      stdout = execSync(`"${binFile}"`, { timeout: 5000, stdio: 'pipe' }).toString();
    } catch (runErr: unknown) {
      const err = runErr as NodeJS.ErrnoException & { stdout?: Buffer; stderr?: Buffer; status?: number };
      stdout = err.stdout?.toString() ?? '';
      stderr = err.stderr?.toString() ?? err.message ?? 'Runtime error';
      exitCode = err.status ?? 1;
    }

    return NextResponse.json({ stdout, stderr, compileError: '', exitCode });
  } catch {
    return NextResponse.json(
      { error: 'Failed to execute code.' },
      { status: 500 }
    );
  } finally {
    try { if (existsSync(srcFile)) unlinkSync(srcFile); } catch {}
    try { if (existsSync(binFile)) unlinkSync(binFile); } catch {}
  }
}
