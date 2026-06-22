/** Strip HTML tags for LaTeX preview of rich-text answers. */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent ?? div.innerText ?? '').trim();
}

export function containsLatex(text: string): boolean {
  return /\$[^$]+\$/.test(text) || /\$\$[\s\S]+?\$\$/.test(text);
}
