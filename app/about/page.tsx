import Image from "next/image";
import { Binoculars, CheckCircle2, ClipboardList, MapPinned, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "運営者情報・編集方針｜比較と取材のポリシー",
  description: "Each Spirit 編集部の運営方針、情報収集方針、掲載基準、更新方針をまとめています。",
  path: routes.about,
});

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef7ff_52%,#fff7ed_100%)]">
        <div className="mx-auto grid w-[min(1360px,calc(100%-32px))] gap-6 py-9 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Badge className="bg-white">Each Spirit 編集部</Badge>
            <h1 className="mt-4 max-w-3xl text-[2rem] font-bold leading-[1.14] tracking-normal text-slate-950 sm:text-5xl">
              運営者情報
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Each Spiritは、読者が選択前に比較しやすい情報を届ける編集部運営の情報メディアです。
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight text-slate-950 sm:text-2xl">調査・取材・記事化を3人で回しています</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              公式情報だけでなく、アンケート、実際の訪問、人脈を通じた聞き取りや取材を組み合わせ、比較しやすい形に整理しています！
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {teamStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/80 bg-white/86 p-4 shadow-sm">
                  <stat.icon className="h-5 w-5 text-(--primary)" />
                  <p className="mt-2 text-sm font-bold text-slate-950">{stat.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1360px,calc(100%-32px))] py-8 sm:py-12">
        <div className="mb-4 sm:mb-6">
          <p className="section-kicker">Team</p>
          <h2 className="section-heading mt-2">編集メンバー</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {members.map((member) => (
            <section key={member.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="h-2" style={{ background: member.color }} />
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-24 sm:w-24">
                    <Image src={member.imageUrl} alt={member.name + "の仮アイコン"} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="min-w-0">
                    <Badge className="bg-slate-50">{member.mood}</Badge>
                    <h3 className="mt-2 text-[1.35rem] font-bold leading-tight text-slate-950 sm:text-2xl">{member.name}</h3>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{member.catchphrase}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  {member.status.map((item) => (
                    <div key={item.label} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-[5.5rem_1fr]">
                      <span className="font-bold text-slate-500">{item.label}</span>
                      <span className="font-semibold leading-6 text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.tags.map((tag) => <Badge key={tag} className="bg-slate-50">{tag}</Badge>)}
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm leading-7 text-slate-700">
                  <MessageCircle className="mr-1 inline h-4 w-4 text-(--primary)" />
                  {member.message}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-[min(1360px,calc(100%-32px))] gap-6 pb-10 sm:pb-14 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="section-kicker">Policy</p>
          <h2 className="section-heading mt-2">サイトの目的</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            ランキング、比較、地域情報、実体験に基づく要点整理を通じて、読者の意思決定を助けることを目的とします。
          </p>
          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
            掲載前には、確認できる一次情報を優先し、現地での利用感や周辺状況は編集部の調査記録として扱います。口コミや聞き取りは参考情報にとどめ、営業時間、料金、所在地などの事実情報は公式・自治体・店舗情報で確認します。
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">情報収集方針</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {policies.map((policy) => (
              <div key={policy.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <policy.icon className="h-5 w-5 text-(--primary)" />
                <h3 className="mt-2 font-bold text-slate-950">{policy.title}</h3>
                <p className="mt-1 text-sm leading-7 text-slate-600">{policy.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-950 p-4 text-sm leading-7 text-white">
            読者の比較に役立つこと、基本情報の追跡が可能なこと、PR掲載時に明示できることを掲載基準とします。営業時間や料金など変更されやすい情報は、更新時に再確認します。
          </div>
        </div>
      </section>
    </div>
  );
}
const members = [
  {
    name: "ミヤヤ",
    mood: "外に出がち",
    imageUrl: "/brand/team/miyaya.svg",
    color: "#176b87",
    catchphrase: "",
    status: [
      { label: "好き", value: "料理、ドライブ、旅行" },
      { label: "性別/年齢", value: "女/Himitsu" },
      { label: "性格", value: "悪いことはしないですが、ひねったことはしちゃう" },
    ],
    tags: ["ISFP", "FAPO(デビル天使)", "職種不明(多種の経営をしています多分)"],
    message: "ミヤヤと申します。ここの他のメンバーと飲み会で出会い、誘いました。",
  },
  {
    name: "Gagaヤ",
    mood: "馬鹿を演じている天才のつもり",
    imageUrl: "/brand/team/gagaya.svg",
    color: "#f97316",
    catchphrase: "おすすめを聞くと、なぜか人生相談まで聞くタイプ",
    status: [
      { label: "好き", value: "英語、みんながしないことをする" },
      { label: "休日", value: "映画を英語で見て、勉強したふりしてます" },
      { label: "性格", value: "なにもかも直接見ないと気が済まない" },
    ],
    tags: ["ENTP", "LARO(憧れの先輩)", "大学生"],
    message: "Gagaヤです。ランニングを縛りにしてます。深夜帯に",
  },
  {
    name: "milk",
    mood: "目立ちたがり",
    imageUrl: "/brand/team/milk.svg",
    color: "#d4819e",
    catchphrase: "落ち着く時間はあまりいらないかも",
    status: [
      { label: "好き", value: "Youtube、ヒカル、温泉･サウナ" },
      { label: "休日", value: "予定は午後から入れるタイプです" },
      { label: "性格", value: "細かいことは気にしない！" },
    ],
    tags: ["ESTP", "LAPO(パーフェクトカメレオン)", "教師(高校社会)"],
    message: "milkです。牛乳が好きだったのでこの名前です。他に深い意味はないです笑",
  },
];

const teamStats = [
  { label: "3人体制", text: "調査(AI多用してます！)、聞き取り、編集確認を分担します。", icon: Users },
  { label: "現地と人脈", text: "訪問、アンケート、紹介経由の声を集めます。", icon: MapPinned },
  { label: "事実確認", text: "営業時間や料金は公式・自治体情報を優先します。", icon: ShieldCheck },
];

const policies = [
  { title: "一次情報を優先", text: "公式サイト、自治体、店舗・施設情報、地図情報を確認します。", icon: CheckCircle2 },
  { title: "現地感・現物も見る", text: "駐車場、入口、混雑感、初めて行く人が迷いやすい点を確認します。", icon: Binoculars },
  { title: "声を集める", text: "アンケートや聞き取りで、公開情報だけでは分かりにくい使い勝手を拾います。", icon: MessageCircle },
  { title: "比較軸に変換", text: "集めた情報は、独自の分類、比較、評価軸として再構成します。", icon: ClipboardList },
];
