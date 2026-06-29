import "dotenv/config";

import path from "node:path";
import process from "node:process";

type Args = Record<string, string | boolean>;

const fortuneEvents = [
  "fortune_generate_start",
  "fortune_generate",
  "fortune_generate_error",
  "fortune_result_view",
  "fortune_start",
  "fortune_share_click",
  "fortune_share_copy",
  "fortune_image_download",
];

function loadLocalAdc() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return;
  const localAdc = path.resolve(".google", "gcloud", "application_default_credentials.json");
  process.env.GOOGLE_APPLICATION_CREDENTIALS = localAdc;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function argString(args: Args, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" ? value : undefined;
}

function propertyId(args: Args) {
  const id = argString(args, "property") ?? process.env.GA4_PROPERTY_ID;
  if (!id) throw new Error("GA4_PROPERTY_ID or --property is required");
  return id.replace(/^properties\//, "");
}

function daysRange(args: Args) {
  const days = Number(argString(args, "days") ?? "7");
  if (!Number.isFinite(days) || days < 1) throw new Error("--days must be a positive number");
  return { startDate: `${Math.floor(days)}daysAgo`, endDate: "today" };
}

function printRows(headers: string[], rows: string[][]) {
  console.log(headers.join("\t"));
  for (const row of rows) console.log(row.join("\t"));
}

async function googleAuth(scopes: string[]) {
  loadLocalAdc();
  const { google } = await import("googleapis");
  return new google.auth.GoogleAuth({ scopes });
}

async function listGaProperties() {
  const { google } = await import("googleapis");
  const auth = await googleAuth(["https://www.googleapis.com/auth/analytics.readonly"]);
  const analyticsAdmin = google.analyticsadmin({ version: "v1alpha", auth });
  const res = await analyticsAdmin.accountSummaries.list();
  const rows = (res.data.accountSummaries ?? []).flatMap((account) =>
    (account.propertySummaries ?? []).map((property) => [
      account.displayName ?? "",
      property.displayName ?? "",
      (property.property ?? "").replace(/^properties\//, ""),
    ]),
  );
  printRows(["account", "property", "property_id"], rows);
}

async function gaClient() {
  loadLocalAdc();
  const { BetaAnalyticsDataClient } = await import("@google-analytics/data");
  return new BetaAnalyticsDataClient();
}

async function gaRealtime(args: Args) {
  const client = await gaClient();
  const [res] = await client.runRealtimeReport({
    property: `properties/${propertyId(args)}`,
    dimensions: [{ name: "unifiedScreenName" }],
    metrics: [{ name: "activeUsers" }],
    limit: 20,
  });
  const rows = (res.rows ?? []).map((row) => [
    row.dimensionValues?.[0]?.value ?? "",
    row.metricValues?.[0]?.value ?? "0",
  ]);
  printRows(["screen", "active_users"], rows);
}

async function gaPages(args: Args) {
  const client = await gaClient();
  const range = daysRange(args);
  const [res] = await client.runReport({
    property: `properties/${propertyId(args)}`,
    dateRanges: [range],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: Number(argString(args, "limit") ?? "25"),
  });
  const rows = (res.rows ?? []).map((row) => [
    row.dimensionValues?.[0]?.value ?? "",
    row.dimensionValues?.[1]?.value ?? "",
    row.metricValues?.[0]?.value ?? "0",
    row.metricValues?.[1]?.value ?? "0",
  ]);
  printRows(["page_path", "page_title", "views", "active_users"], rows);
}

async function gaEvents(args: Args) {
  const client = await gaClient();
  const range = daysRange(args);
  const event = argString(args, "event");
  const expressions = event
    ? [{ filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT" as const, value: event } } }]
    : fortuneEvents.map((name) => ({ filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT" as const, value: name } } }));
  const [res] = await client.runReport({
    property: `properties/${propertyId(args)}`,
    dateRanges: [range],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
    dimensionFilter: { orGroup: { expressions } },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 50,
  });
  const rows = (res.rows ?? []).map((row) => [
    row.dimensionValues?.[0]?.value ?? "",
    row.metricValues?.[0]?.value ?? "0",
    row.metricValues?.[1]?.value ?? "0",
  ]);
  printRows(["event", "count", "active_users"], rows);
}

async function gaFortune(args: Args) {
  const client = await gaClient();
  const range = daysRange(args);
  const [res] = await client.runReport({
    property: `properties/${propertyId(args)}`,
    dateRanges: [range],
    dimensions: [{ name: "eventName" }, { name: "customEvent:user_status" }, { name: "customEvent:overall_band" }],
    metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
    dimensionFilter: {
      orGroup: {
        expressions: fortuneEvents.map((name) => ({
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT" as const, value: name } },
        })),
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 100,
  });
  const rows = (res.rows ?? []).map((row) => [
    row.dimensionValues?.[0]?.value ?? "",
    row.dimensionValues?.[1]?.value ?? "",
    row.dimensionValues?.[2]?.value ?? "",
    row.metricValues?.[0]?.value ?? "0",
    row.metricValues?.[1]?.value ?? "0",
  ]);
  printRows(["event", "user_status", "overall_band", "count", "active_users"], rows);
}

async function adsenseAccounts() {
  const { google } = await import("googleapis");
  const auth = await googleAuth(["https://www.googleapis.com/auth/adsense.readonly"]);
  const adsense = google.adsense({ version: "v2", auth });
  const res = await adsense.accounts.list();
  const rows = (res.data.accounts ?? []).map((account) => [
    account.name ?? "",
    account.displayName ?? "",
    account.state ?? "",
  ]);
  printRows(["name", "display_name", "state"], rows);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  switch (command) {
    case "ga:properties":
      return listGaProperties();
    case "ga:realtime":
      return gaRealtime(args);
    case "ga:pages":
      return gaPages(args);
    case "ga:events":
      return gaEvents(args);
    case "ga:fortune":
      return gaFortune(args);
    case "adsense:accounts":
      return adsenseAccounts();
    default:
      console.log("Usage:");
      console.log("  npm run google:ops -- ga:properties");
      console.log("  npm run google:ops -- ga:realtime -- --property <GA4_PROPERTY_ID>");
      console.log("  npm run google:ops -- ga:pages -- --property <GA4_PROPERTY_ID> --days 7");
      console.log("  npm run google:ops -- ga:events -- --property <GA4_PROPERTY_ID> --days 7");
      console.log("  npm run google:ops -- ga:fortune -- --property <GA4_PROPERTY_ID> --days 30");
      console.log("  npm run google:ops -- adsense:accounts");
      process.exit(command ? 1 : 0);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
