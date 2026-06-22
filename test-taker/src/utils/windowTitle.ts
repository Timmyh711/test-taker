const DEFAULT_TITLE = 'Test Taker';

export async function setWindowTitle(testName?: string): Promise<void> {
  const title = testName ? `${DEFAULT_TITLE} - ${testName}` : DEFAULT_TITLE;
  document.title = title;

  try {
    const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
    await getCurrentWebviewWindow().setTitle(title);
  } catch {
    // Not running in Tauri or API unavailable
  }
}
