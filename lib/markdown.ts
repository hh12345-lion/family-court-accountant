/**
 * Lightweight Markdown → HTML for blog bodies (headings, lists, links, emphasis).
 * No leading H1 expected — page title is rendered separately.
 */
export function markdownToHtml(md: string): string {
  let text = md.replace(/\r\n/g, "\n").trim();
  text = text
    .replace(/\\#/g, "#")
    .replace(/\\-/g, "-")
    .replace(/\\\./g, ".")
    .replace(/\\\*/g, "*")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\>/g, ">");

  const lines = text.split("\n");
  const html: string[] = [];
  let i = 0;
  let inOl = false;
  let inUl = false;

  function closeLists() {
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
  }

  function inline(s: string): string {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) {
      closeLists();
      i++;
      continue;
    }

    if (/^#\s+/.test(t) && !/^##/.test(t)) {
      i++;
      continue;
    }
    if (/^###\s+/.test(t)) {
      closeLists();
      html.push(`<h3>${inline(t.replace(/^###\s+/, ""))}</h3>`);
      i++;
      continue;
    }
    if (/^##\s+/.test(t)) {
      closeLists();
      html.push(`<h2>${inline(t.replace(/^##\s+/, ""))}</h2>`);
      i++;
      continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      if (!inOl) {
        closeLists();
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${inline(t.replace(/^\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    }
    if (/^-\s+/.test(t)) {
      if (!inUl) {
        closeLists();
        html.push("<ul>");
        inUl = true;
      }
      html.push(`<li>${inline(t.replace(/^-\s+/, ""))}</li>`);
      i++;
      continue;
    }

    closeLists();
    const parts = [t];
    i++;
    while (i < lines.length) {
      const n = lines[i].trim();
      if (!n) break;
      if (/^#{1,3}\s+/.test(n) || /^-\s+/.test(n) || /^\d+\.\s+/.test(n)) break;
      parts.push(n);
      i++;
    }
    html.push(`<p>${inline(parts.join(" "))}</p>`);
  }

  closeLists();
  return html.join("\n");
}
