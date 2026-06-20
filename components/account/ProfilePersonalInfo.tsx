"use client";

import { useState } from "react";
import { Cake, CircleUser, Mars, Venus, Check, Pencil, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FORTUNE_GENDERS, FORTUNE_GENDER_LABEL, type FortuneGender } from "@/lib/fortune";

const GENDER_ICON: Record<FortuneGender, typeof Venus> = {
  male: Mars,
  female: Venus,
  other: CircleUser,
};

function formatBirthday(value: string): string {
  // yyyy-mm-dd → yyyy年m月d日
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  return `${Number(m[1])}年${Number(m[2])}月${Number(m[3])}日`;
}

/**
 * プロフィールヒーロー内の個人情報（誕生日・性別）の表示／編集UI。
 * 共有プロフィール public.profiles を本人の行のみ読み書きする（RLS で保護）。
 * 設定済みなら /fortune での入力を省略できる。
 */
export function ProfilePersonalInfo({
  userId,
  initialBirthday,
  initialGender,
}: {
  userId: string;
  initialBirthday: string | null;
  initialGender: FortuneGender | null;
}) {
  const [birthday, setBirthday] = useState<string>(initialBirthday ?? "");
  const [gender, setGender] = useState<FortuneGender | null>(initialGender);

  const [editing, setEditing] = useState(false);
  const [draftBirthday, setDraftBirthday] = useState("");
  const [draftGender, setDraftGender] = useState<FortuneGender | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  function startEdit() {
    setDraftBirthday(birthday);
    setDraftGender(gender);
    setError(null);
    setSaved(false);
    setEditing(true);
  }

  async function save() {
    if (!draftBirthday || !draftGender || saving) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("profiles")
      .update({ birthday: draftBirthday, gender: draftGender })
      .eq("id", userId);
    if (err) {
      setError("保存に失敗しました。時間をおいて再度お試しください。");
      setSaving(false);
      return;
    }
    setBirthday(draftBirthday);
    setGender(draftGender);
    setEditing(false);
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-slate-600">個人情報</p>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] transition hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" />
            編集
          </button>
        )}
      </div>

      {!editing ? (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <InfoItem icon={Cake} label="誕生日">
            {birthday ? formatBirthday(birthday) : <span className="text-slate-400">未設定</span>}
          </InfoItem>
          <InfoItem icon={CircleUser} label="性別">
            {gender ? FORTUNE_GENDER_LABEL[gender] : <span className="text-slate-400">未設定</span>}
          </InfoItem>
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
              <Check className="h-3.5 w-3.5" /> 保存しました
            </span>
          )}
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:w-48">
            <label htmlFor="profile-birthday" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Cake className="h-4 w-4 text-violet-500" /> 誕生日
            </label>
            <input
              id="profile-birthday"
              type="date"
              value={draftBirthday}
              max={today}
              min="1900-01-01"
              onChange={(e) => setDraftBirthday(e.target.value)}
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400"
            />
          </div>

          <div className="flex-1">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <CircleUser className="h-4 w-4 text-violet-500" /> 性別
            </span>
            <div className="grid grid-cols-3 gap-2">
              {FORTUNE_GENDERS.map((g) => {
                const Icon = GENDER_ICON[g];
                const active = draftGender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setDraftGender(g)}
                    className={`flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-bold transition ${
                      active
                        ? "border-violet-400 bg-violet-50 text-violet-700"
                        : "border-[var(--border)] bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {FORTUNE_GENDER_LABEL[g]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!draftBirthday || !draftGender || saving}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-violet-500 px-5 text-sm font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "保存中…" : "保存"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              aria-label="キャンセル"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs font-semibold text-rose-500">{error}</p>}
      {!editing && (!birthday || !gender) && (
        <p className="mt-2 text-xs leading-5 text-slate-400">
          誕生日と性別を設定すると、今日の運勢の入力を省略できます。
        </p>
      )}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Cake;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{children}</span>
    </div>
  );
}
