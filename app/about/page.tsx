import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  MapPinned,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "運営者情報・編集方針 | Each Spirit編集部について",
  description:
    "Each Spirit（イーチスピリット）を運営するマソオ、milk、鬼奇希のプロフィールと、情報収集・比較・編集に関する方針を紹介します。",
  path: routes.about,
});

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-6 sm:py-16 lg:py-20">
          <Badge className="border-white/15 bg-white/10 text-white">ABOUT EACH SPIRIT</Badge>
          <div className="mt-3 sm:mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.12] tracking-normal sm:text-5xl lg:text-6xl">
                どう届けるのか。
              </h1>
              <p className="mt-2 sm:mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Each Spirit（イーチスピリット）は、比較する前に知っておきたい情報を整理し、
                読者が自分で選ぶための材料を届けるメディアです。運営しているのは、経歴も関心も異なる3人です。
              </p>
            </div>
            <div className="border-l border-white/15 pl-5 sm:pl-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Our stance</p>
              <p className="mt-3 text-xl font-bold leading-8">
                正解を決めるのではなく、
                <br />
                選びやすい状態をつくる。
              </p>
              <p className="mt-3 text-sm leading-5 sm:leading-7 text-slate-200">
                公式情報、現地で得た情報、利用者の声を区別しながら、比較できる形へ編集します。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] py-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="section-kicker">The Team</p>
            <h2 className="section-heading mt-2">運営メンバー</h2>
            <p className="mt-4 text-sm leading-5 sm:leading-7 text-slate-800">
              3人とも本名や勤務先などの詳細は公開していません(ペンネームで活動しています)。肩書きよりも、どのような視点でサイトに関わっているかを紹介します。
            </p>
          </div>
          <div className="space-y-2 sm:space-y-5">
            {members.map((member, index) => (
              <MemberProfile key={member.name} member={member} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 py-6 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">How We Work</p>
            <h2 className="section-heading mt-2">3人で情報を形にする</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              企画、調査、現地確認、文章化、技術面を完全に分業しているわけではありません。それぞれの得意分野を持ち寄り、公開前に別のメンバーが確認します。
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-3">
            {workflow.map((item) => (
              <div key={item.title} className="bg-slate-50 p-5">
                <item.icon className="h-6 w-6 text-[var(--primary)]" />
                <h3 className="mt-4 font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] py-6 sm:py-16">
        <div className="mb-6 max-w-2xl">
          <p className="section-kicker">Editorial Policy</p>
          <h2 className="section-heading mt-2">編集と掲載の方針</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            情報の種類を混同せず、読者が確認できる手がかりを残すことを重視しています。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {policies.map((policy) => (
            <section key={policy.title} className="border-t-2 border-slate-950 bg-white px-1 py-5 sm:px-5">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-100 text-[var(--primary)]">
                  <policy.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-950">{policy.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{policy.text}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] pb-12 sm:pb-16">
        <div className="grid gap-6 rounded-lg bg-[var(--primary)] p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Contact the editorial team</p>
            <h2 className="mt-2 text-2xl font-bold">情報提供・掲載内容の修正について</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
              掲載情報の誤り、更新情報、取材や掲載に関する連絡はお問い合わせページから受け付けています。
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="border-white bg-white text-slate-950 hover:bg-slate-100">
            <Link href={routes.contact}>
              お問い合わせ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

type Member = (typeof members)[number];

function MemberProfile({ member, index }: { member: Member; index: number }) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-[220px_1fr]">
      <div
        className="relative min-h-55 overflow-hidden p-3 sm:min-h-full"
        style={{ background: member.portraitBackground }}
      >
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative h-full min-h-55 overflow-hidden rounded-md bg-[#fffaf4] shadow-lg sm:min-h-50">
          <Image
            src={member.imageUrl}
            alt={`${member.name}${member.reading ? `（${member.reading}）` : ""}のプロフィールイラスト`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) calc(100vw - 56px), 220px"
            unoptimized
          />
        </div>
        <span className="absolute left-3 top-3 text-xs font-black text-white/55">0{index}</span>
      </div>
      <div className="px-5 py-3 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-bold text-slate-950">{member.name}</h3>
          {member.reading ? <span className="text-sm font-semibold text-slate-500">（{member.reading}）</span> : null}
          <Badge className="bg-slate-50">{member.role}</Badge>
        </div>
        <p className="sm:mt-2 text-sm font-bold" style={{ color: member.color }}>{member.tagline}</p>
        <p className="mt-2 sm:mt-4 text-sm leading-5 sm:leading-7 text-slate-700">{member.profile}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {member.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

const members = [
  {
    name: "マソオ",
    reading: "",
    imageUrl: "/brand/team/masoo.webp",
    role: "運営代表",
    tagline: "営業、SES、自営。遠回りした経験をサイト運営へ。",
    profile:
      "新卒では外資系企業の営業職。その後、事情があってSES事業の部署に所属し、本格的な転職を経てエンジニアになりました。現在は自営のビジネスをしながらEach Spiritを運営しています。名前とキャラクターには、どこかで見たゲームの主人公らしさがあります。",
    tags: ["外資系営業", "SES", "自営業"],
    color: "#dc2626",
    portraitBackground: "linear-gradient(145deg, #b91c1c 0%, #dc2626 52%, #2563eb 52%, #1d4ed8 100%)",
  },
  {
    name: "milk",
    reading: "",
    imageUrl: "/brand/team/milk.webp",
    role: "編集･リサーチ",
    tagline: "乳製品が好き。名前の響きも可愛い。それ以上は秘密です。",
    profile:
      "乳製品が好きなことと、聞こえが可愛いことから「milk」と名乗っています。教員免許を持つ社会人ですが、現在は教員ではありません。仕事や詳しい経歴など、素性については公開しない方針です。サイトでは読者目線での確認や、伝わり方の調整に関わっています。",
    tags: ["乳製品好き", "教員免許", "社会人", "年齢非公開"],
    color: "#be185d",
    portraitBackground: "linear-gradient(145deg, #fdf2f8 0%, #f9a8d4 48%, #be185d 100%)",
  },
  {
    name: "鬼奇希",
    reading: "ききき",
    imageUrl: "/brand/team/kikiki.webp",
    role: "体験･企画",
    tagline: "47都道府県の次は世界へ。ただし、圧倒的に時間が足りない。",
    profile:
      "マソオさんに誘われて参加した24歳です！中二病。名前はTekitouです。世界の高級料理と高級旅館を制覇したいという野望を持っています。大学在学中に47都道府県を巡ったため、次は世界に挑みたいところですが、今はとにかく時間がないです。",
    tags: ["厨二病", "47都道府県制覇", "高級料理", "高級旅館"],
    color: "#6d28d9",
    portraitBackground: "linear-gradient(145deg, #111827 0%, #312e81 52%, #7c3aed 100%)",
  },
] as const;

const workflow = [
  {
    title: "見つける",
    text: "検索データ、公開情報、現地で気になったこと、読者からの情報を企画の入口にします。",
    icon: SearchCheck,
  },
  {
    title: "確かめる",
    text: "公式情報を基準に、必要に応じて現地確認や聞き取りを行い、事実と感想を分けます。",
    icon: MapPinned,
  },
  {
    title: "編集する",
    text: "比較軸や探し方へ変換し、別のメンバーが内容と見せ方を確認して公開します。",
    icon: BookOpenCheck,
  },
];

const policies = [
  {
    title: "一次情報を優先する",
    text: "営業時間、料金、所在地などは、公式サイト、自治体、店舗・施設が公開する情報を優先します。",
    icon: ShieldCheck,
  },
  {
    title: "体験と事実を分ける",
    text: "訪問時の印象や利用感は編集部の体験として扱い、確認可能な事実と混同しないように記載します。",
    icon: Compass,
  },
  {
    title: "比較できる形にする",
    text: "情報を並べるだけでなく、目的、地域、価格、特徴など、読者が選ぶための軸へ整理します。",
    icon: CheckCircle2,
  },
  {
    title: "修正できる状態を保つ",
    text: "情報は変化する前提で、参照元や確認日を残し、指摘や更新情報を受け取れる導線を用意します。",
    icon: MessageCircle,
  },
];
