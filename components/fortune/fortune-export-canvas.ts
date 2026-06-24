import type { FortuneResult, FortuneScore } from "@/lib/fortune";

const WIDTH = 1080;
const HEIGHT = 1350;
const FONT = '"Yu Gothic", "Hiragino Sans", Meiryo, sans-serif';

const LEVEL: Record<number, { label: string; color: string }> = {
  1: { label: "絶不調", color: "#fb7185" },
  2: { label: "低調", color: "#fbbf24" },
  3: { label: "平穏", color: "#94a3b8" },
  4: { label: "好調", color: "#60a5fa" },
  5: { label: "絶好調", color: "#4ade80" },
};

const CATEGORY_ACCENT: Record<string, string> = {
  love: "#fb7185",
  money: "#fbbf24",
  work: "#38bdf8",
  health: "#4ade80",
  social: "#c084fc",
  outing: "#fb923c",
};

export async function createFortuneExportPng(
  result: FortuneResult,
  strongest?: FortuneScore,
  focus?: FortuneScore,
): Promise<string> {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_context_unavailable");

  drawBackground(ctx);
  drawHeader(ctx, result);
  drawOverall(ctx, result, strongest, focus);
  drawCategories(ctx, result.categories);
  drawLucky(ctx, result);
  drawFooter(ctx);

  return canvas.toDataURL("image/png");
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const base = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  base.addColorStop(0, "#1b113b");
  base.addColorStop(0.5, "#0d1634");
  base.addColorStop(1, "#080c1d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const violet = ctx.createRadialGradient(120, 60, 0, 120, 60, 430);
  violet.addColorStop(0, "rgba(168,85,247,0.42)");
  violet.addColorStop(1, "rgba(168,85,247,0)");
  ctx.fillStyle = violet;
  ctx.fillRect(0, 0, WIDTH, 550);

  const blue = ctx.createRadialGradient(980, 230, 0, 980, 230, 380);
  blue.addColorStop(0, "rgba(37,99,235,0.32)");
  blue.addColorStop(1, "rgba(37,99,235,0)");
  ctx.fillStyle = blue;
  ctx.fillRect(580, 0, 500, 650);

  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
}

function drawHeader(ctx: CanvasRenderingContext2D, result: FortuneResult) {
  ctx.fillStyle = "#c4b5fd";
  ctx.font = `900 20px ${FONT}`;
  ctx.fillText("EACH SPIRIT  /  DAILY FORTUNE", 58, 70);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 50px ${FONT}`;
  ctx.fillText("今日の運勢", 58, 132);

  roundRect(ctx, 815, 54, 205, 52, 26, "rgba(255,255,255,0.09)", "rgba(255,255,255,0.16)");
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = `700 21px ${FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(result.date, 917, 87);
  ctx.textAlign = "left";
}

function drawOverall(
  ctx: CanvasRenderingContext2D,
  result: FortuneResult,
  strongest?: FortuneScore,
  focus?: FortuneScore,
) {
  const level = LEVEL[result.overall.band];
  roundRect(ctx, 50, 170, 980, 420, 36, "rgba(255,255,255,0.065)", "rgba(255,255,255,0.14)");
  drawScoreDial(ctx, 250, 380, 155, result.overall.score, level.color, level.label);

  ctx.fillStyle = "#c4b5fd";
  ctx.font = `900 17px ${FONT}`;
  ctx.fillText("OVERALL READING", 455, 230);
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 38px ${FONT}`;
  ctx.fillText(`${level.label}な一日`, 455, 282);

  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = `500 21px ${FONT}`;
  drawWrappedText(ctx, result.overall.text, 455, 328, 515, 36, 5);

  if (strongest) {
    drawInsight(ctx, 455, 500, 240, 62, "今日の強み", strongest.label, LEVEL[strongest.band].color);
  }
  if (focus) {
    drawInsight(ctx, 710, 500, 260, 62, "整えるポイント", focus.label, LEVEL[focus.band].color);
  }
}

function drawScoreDial(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  score: number,
  color: string,
  label: string,
) {
  ctx.lineCap = "round";
  ctx.lineWidth = 24;
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (score / 5));
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 31, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let index = 0; index < 12; index += 1) {
    const angle = (Math.PI * 2 * index) / 12 - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius - 16);
    const y = cy + Math.sin(angle) * (radius - 16);
    ctx.fillStyle = index % 3 === 0 ? color : "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.font = `900 13px ${FONT}`;
  ctx.fillText("OVERALL", cx, cy - 55);
  ctx.fillStyle = color;
  ctx.font = `900 72px ${FONT}`;
  ctx.fillText(score.toFixed(1), cx, cy + 22);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = `700 17px ${FONT}`;
  ctx.fillText("/ 5.0", cx, cy + 55);
  ctx.fillStyle = color;
  ctx.font = `900 19px ${FONT}`;
  ctx.fillText(label, cx, cy + 88);

  const stars = Math.round(score);
  ctx.font = `700 24px ${FONT}`;
  for (let index = 0; index < 5; index += 1) {
    ctx.fillStyle = index < stars ? color : "rgba(255,255,255,0.18)";
    ctx.fillText("★", cx - 56 + index * 28, cy + 120);
  }
  ctx.textAlign = "left";
}

function drawInsight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
  color: string,
) {
  roundRect(ctx, x, y, width, height, 16, "rgba(255,255,255,0.055)", "rgba(255,255,255,0.1)");
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = `700 12px ${FONT}`;
  ctx.fillText(label, x + 16, y + 22);
  ctx.fillStyle = color;
  ctx.font = `900 18px ${FONT}`;
  ctx.fillText(fitText(ctx, value, width - 32), x + 16, y + 47);
}

function drawCategories(ctx: CanvasRenderingContext2D, categories: FortuneScore[]) {
  ctx.fillStyle = "#c4b5fd";
  ctx.font = `900 16px ${FONT}`;
  ctx.fillText("SIX FORTUNES", 58, 640);
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 30px ${FONT}`;
  ctx.fillText("6つの運勢", 58, 680);

  categories.forEach((category, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    drawCategoryCard(ctx, category, 50 + column * 330, 712 + row * 174, 310, 150);
  });
}

function drawCategoryCard(
  ctx: CanvasRenderingContext2D,
  category: FortuneScore,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const accent = CATEGORY_ACCENT[category.key] ?? "#a78bfa";
  const level = LEVEL[category.band];
  roundRect(ctx, x, y, width, height, 24, "rgba(255,255,255,0.06)", `${accent}55`);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 19px ${FONT}`;
  ctx.fillText(fitText(ctx, category.label, 185), x + 20, y + 38);
  ctx.fillStyle = level.color;
  ctx.font = `800 13px ${FONT}`;
  ctx.fillText(level.label, x + 20, y + 64);

  ctx.textAlign = "right";
  ctx.fillStyle = accent;
  ctx.font = `900 42px ${FONT}`;
  ctx.fillText(category.score.toFixed(1), x + width - 20, y + 53);
  ctx.textAlign = "left";

  roundRect(ctx, x + 20, y + 96, width - 40, 12, 6, "rgba(255,255,255,0.1)");
  const progress = (width - 40) * (category.score / 5);
  const gradient = ctx.createLinearGradient(x + 20, 0, x + width - 20, 0);
  gradient.addColorStop(0, accent);
  gradient.addColorStop(1, "#ffffff");
  roundRect(ctx, x + 20, y + 96, progress, 12, 6, gradient);

  ctx.fillStyle = "rgba(255,255,255,0.44)";
  ctx.font = `700 12px ${FONT}`;
  ctx.fillText("SCORE / 5.0", x + 20, y + 132);
}

function drawLucky(ctx: CanvasRenderingContext2D, result: FortuneResult) {
  const y = 1085;
  drawLuckyPanel(ctx, 50, y, 270, "LUCKY COLOR", () => {
    ctx.fillStyle = result.lucky.color.hex;
    ctx.beginPath();
    ctx.arc(115, y + 88, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 16px ${FONT}`;
    ctx.fillText(fitText(ctx, result.lucky.color.name, 150), 155, y + 94);
  });

  drawLuckyPanel(ctx, 335, y, 225, "LUCKY NUMBER", () => {
    ctx.fillStyle = "#ddd6fe";
    ctx.font = `900 58px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(String(result.lucky.number), 447, y + 108);
    ctx.textAlign = "left";
  });

  drawLuckyPanel(ctx, 575, y, 455, "LUCKY SPOT", () => {
    ctx.fillStyle = "#bae6fd";
    ctx.font = `900 20px ${FONT}`;
    drawWrappedText(ctx, result.lucky.item?.name ?? "新しい場所", 600, y + 78, 405, 30, 2);
  });
}

function drawLuckyPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  label: string,
  content: () => void,
) {
  roundRect(ctx, x, y, width, 145, 24, "rgba(255,255,255,0.06)", "rgba(255,255,255,0.11)");
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = `900 13px ${FONT}`;
  ctx.fillText(label, x + 20, y + 30);
  content();
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.moveTo(50, 1260);
  ctx.lineTo(1030, 1260);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.38)";
  ctx.font = `600 15px ${FONT}`;
  ctx.fillText("占いはエンターテインメントとしてお楽しみください", 50, 1302);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = `900 18px ${FONT}`;
  ctx.fillText("each-spirit.com/fortune", 1030, 1302);
  ctx.textAlign = "left";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string | CanvasGradient,
  stroke?: string,
) {
  if (width <= 0 || height <= 0) return;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, Math.min(radius, width / 2, height / 2));
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const characters = [...text];
  const lines: string[] = [];
  let line = "";

  for (const character of characters) {
    const candidate = line + character;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = character;
      if (lines.length === maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.join("").length < text.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, -1)}…`;
  }

  lines.forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight));
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let fitted = text;
  while (fitted.length > 1 && ctx.measureText(`${fitted}…`).width > maxWidth) {
    fitted = fitted.slice(0, -1);
  }
  return `${fitted}…`;
}
