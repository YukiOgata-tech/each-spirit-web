/**
 * 残りのSQL（rankings + articles）をSupabase Management APIで実行するスクリプト
 *
 * 事前準備:
 *   .env.local に SUPABASE_ACCESS_TOKEN=sbp_xxx を追加
 *   取得先: https://supabase.com/dashboard/account/tokens
 *
 * 実行方法:
 *   npx tsx scripts/exec-remaining-sql.ts
 */

import { config } from "dotenv"
config({ path: ".env.local" })
import { readFileSync } from "fs"

const PROJECT_REF = "ctwpnaizwsrffrkkbuig"
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!ACCESS_TOKEN) {
  console.error("❌ SUPABASE_ACCESS_TOKEN が .env.local にありません")
  console.error("   https://supabase.com/dashboard/account/tokens でトークンを生成し")
  console.error("   .env.local に SUPABASE_ACCESS_TOKEN=sbp_xxx を追加してください")
  process.exit(1)
}

async function executeSql(sql: string, label: string): Promise<void> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${label} failed (${res.status}): ${body}`)
  }
}

function splitByDoBlocks(sql: string): string[] {
  // rankings.id is uuid, not bigint — fix the type declaration
  const fixed = sql.replace(/DECLARE _rid bigint/g, "DECLARE _rid uuid")
  return fixed
    .split(/(?=\nDO \$\$)/)
    .map(s => s.trim())
    .filter(s => s.startsWith("DO $$"))
}

function splitByInsert(sql: string, table: string): string[] {
  return sql
    .split(new RegExp(`(?=INSERT INTO ${table.replace(".", "\\.")})`))
    .map(s => s.trim())
    .filter(s => s.startsWith(`INSERT INTO ${table}`))
}

async function runFile(
  path: string,
  splitFn: (sql: string) => string[],
  label: string
) {
  const sql = readFileSync(path, "utf8")
  const blocks = splitFn(sql)
  console.log(`\n📂 ${label}: ${blocks.length} 件`)

  for (let i = 0; i < blocks.length; i++) {
    const progress = `[${i + 1}/${blocks.length}]`
    try {
      await executeSql(blocks[i], `${label} ${progress}`)
      process.stdout.write(`\r  ✅ ${progress} 完了`)
    } catch (e) {
      console.error(`\n  ❌ ${label} ${progress} エラー:`, e)
      throw e
    }
  }
  console.log(`\n  → ${blocks.length} 件完了`)
}

async function main() {
  console.log("🚀 残りSQL実行開始\n")
  console.log(`   プロジェクト: ${PROJECT_REF}`)
  console.log(`   トークン: ${ACCESS_TOKEN!.slice(0, 12)}...`)

  await runFile(
    "scripts/batch3-rankings.sql",
    splitByDoBlocks,
    "rankings"
  )

  await runFile(
    "scripts/batch1-articles.sql",
    sql => splitByInsert(sql, "es.articles"),
    "articles"
  )

  console.log("\n🎉 全て完了!")
}

main().catch(err => {
  console.error("\n💥 中断:", err)
  process.exit(1)
})
