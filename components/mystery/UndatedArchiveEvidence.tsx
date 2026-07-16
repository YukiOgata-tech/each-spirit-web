import { MysteryImage } from "@/components/mystery/MysteryImage";

type EvidenceItem = {
  archiveId: string;
  documentLabel: string;
  documentStyle: string;
  title: string;
  clue: string;
  blankLabel: string;
  seal: string;
  image: string;
  imageAlt: string;
  textSide: "left" | "right";
};

const evidenceItems: EvidenceItem[] = [
  {
    archiveId: "ES-A01",
    documentLabel: "印刷所校正刷り",
    documentStyle: "proof",
    title: "十三の印章",
    clue: "十三の植民地の代表は、統治される側の同意と人の権利を掲げ、宗主国から離れる意思を一枚の文書で宣言した。",
    blankLabel: "文書名",
    seal: "S",
    image: "/mystery/undated-archive/14-declaration.webp",
    imageAlt: "印刷機、十三の印章、切れた鎖を描いた活版印刷風の資料",
    textSide: "right",
  },
  {
    archiveId: "ES-A02",
    documentLabel: "発掘鑑定票",
    documentStyle: "conservation",
    title: "灰の下の食卓",
    clue: "炭化した八分割のパンと選挙の壁書き。昼を夜に変えた灰が、古代都市の時間を止めた。",
    blankLabel: "災害名",
    seal: "C",
    image: "/mystery/undated-archive/04-vesuvius.webp",
    imageAlt: "火山灰に埋もれた炭化パンと古代のオイルランプ",
    textSide: "right",
  },
  {
    archiveId: "ES-A03",
    documentLabel: "深夜放送書き起こし",
    documentStyle: "broadcast",
    title: "日付が変わるとき",
    clue: "長い植民地支配の終わりが深夜の放送で告げられた。新しい旗の中央には、糸車に由来する輪が置かれている。",
    blankLabel: "独立した国",
    seal: "R",
    image: "/mystery/undated-archive/17-india.webp",
    imageAlt: "マイク、糸車、深夜の時計を描いた版画風ポスター",
    textSide: "right",
  },
  {
    archiveId: "ES-A04",
    documentLabel: "軍記絵巻断簡",
    documentStyle: "emakimono",
    title: "赤旗と白旗",
    clue: "河畔の橋板を外して迎え撃った戦いから、二つの武家の争いが始まった。やがて戦場は西へ移っていく。",
    blankLabel: "争乱名",
    seal: "T",
    image: "/mystery/undated-archive/08-genpei.webp",
    imageAlt: "壊された橋を挟んで赤旗と白旗の軍勢が対峙する絵巻",
    textSide: "right",
  },
  {
    archiveId: "ES-A05",
    documentLabel: "戦況伝令",
    documentStyle: "field-report",
    title: "海辺の平原から",
    clue: "西方から来た大軍を退けた。伝令は勝利を知らせるため、戦場から都市まで走ったと伝えられる。",
    blankLabel: "戦いの名",
    seal: "E",
    image: "/mystery/undated-archive/02-marathon.webp",
    imageAlt: "古代ギリシャの兜、走者の革靴、海岸線の経路図",
    textSide: "left",
  },
  {
    archiveId: "ES-A06",
    documentLabel: "国境検問所通達",
    documentStyle: "checkpoint",
    title: "直ちに、遅滞なく",
    clue: "旅行規制についての説明が生中継され、その場で『直ちに有効』と受け取られた。市民は検問所へ押し寄せた。",
    blankLabel: "起きた出来事",
    seal: "T",
    image: "/mystery/undated-archive/19-berlin.webp",
    imageAlt: "分断された都市図、検問所、会見用マイクのコラージュ",
    textSide: "right",
  },
  {
    archiveId: "ES-A07",
    documentLabel: "暦法調査票",
    documentStyle: "calendar",
    title: "元年は誕生ではない",
    clue: "この暦は、迫害を離れ共同体を築くために行われた、二つの都市間の移住を元年とする。",
    blankLabel: "移住の呼称",
    seal: "M",
    image: "/mystery/undated-archive/06-hijra.webp",
    imageAlt: "二つのオアシスを結ぶ砂漠の経路と月相を記した調査図",
    textSide: "right",
  },
  {
    archiveId: "ES-A08",
    documentLabel: "陣立て図",
    documentStyle: "deployment",
    title: "霧の盆地",
    clue: "東西に分かれた諸将が対峙した。山上に布陣した一軍が動いたことで、わずか一日の戦況が大きく傾く。",
    blankLabel: "戦いの名",
    seal: "C",
    image: "/mystery/undated-archive/12-sekigahara.webp",
    imageAlt: "赤と青の軍勢の移動を示す木版画風の布陣図",
    textSide: "left",
  },
  {
    archiveId: "ES-A09",
    documentLabel: "クリルタイ議事録",
    documentStyle: "council",
    title: "草原の大会議",
    clue: "諸部族はテムジンに新しい称号を贈った。統一された国は、のちにユーラシア大陸を横断する規模へ広がる。",
    blankLabel: "成立した帝国",
    seal: "O",
    image: "/mystery/undated-archive/09-mongol.webp",
    imageAlt: "草原の座席と一本に束ねられた部族の縄を描く彩色画",
    textSide: "right",
  },
  {
    archiveId: "ES-A10",
    documentLabel: "建都祭告知画",
    documentStyle: "foundation-poster",
    title: "七つの丘の都市",
    clue: "牝狼に育てられた双子。兄弟の争いののち、生き残った者の名が新しい都市に与えられたという。",
    blankLabel: "都市の建国",
    seal: "W",
    image: "/mystery/undated-archive/01-rome.webp",
    imageAlt: "牝狼と双子の像、七つの丘を刻んだ陶板",
    textSide: "right",
  },
  {
    archiveId: "ES-A11",
    documentLabel: "電信受信紙",
    documentStyle: "telegraph",
    title: "三つの十一",
    clue: "第十一の月、第十一の日、第十一の時刻。西部戦線の砲声が止まり、四年以上続いた戦争の休戦が発効した。",
    blankLabel: "休戦した戦争",
    seal: "I",
    image: "/mystery/undated-archive/16-armistice.webp",
    imageAlt: "停止する波形、三つの時計、砲列を描く電信記録図",
    textSide: "left",
  },
  {
    archiveId: "ES-A12",
    documentLabel: "勅令抄録",
    documentStyle: "edict",
    title: "返還された鍵",
    clue: "信仰を理由に奪われた財産を返し、帝国内で宗教を選ぶ自由を認めた。二人の皇帝が会談した都市の名を冠する。",
    blankLabel: "勅令の名",
    seal: "O",
    image: "/mystery/undated-archive/05-milan.webp",
    imageAlt: "二つの皇帝印、返還された鍵、握手の青銅像",
    textSide: "left",
  },
  {
    archiveId: "ES-A13",
    documentLabel: "月面任務確認票",
    documentStyle: "checklist",
    title: "着陸船『鷲』",
    clue: "静かの海に降り立ち、人類は別の天体に初めて足跡を残した。地上では世界中が通信を見守った。",
    blankLabel: "計画の名",
    seal: "I",
    image: "/mystery/undated-archive/18-apollo.webp",
    imageAlt: "月着陸船、着陸経路、足跡を描く技術チェックリスト",
    textSide: "left",
  },
  {
    archiveId: "ES-A14",
    documentLabel: "攻城兵器設計図",
    documentStyle: "blueprint",
    title: "二重の城壁と海の鎖",
    clue: "巨大砲が城壁を撃ち、陸上を越えた艦隊が金角湾へ入った。千年以上続いた帝国の都は陥落した。",
    blankLabel: "陥落した都市",
    seal: "E",
    image: "/mystery/undated-archive/10-constantinople.webp",
    imageAlt: "ビザンツ様式の城壁、巨大砲、鎖で閉ざされた港の設計図",
    textSide: "left",
  },
  {
    archiveId: "ES-A15",
    documentLabel: "規格統一令",
    documentStyle: "standards",
    title: "異なる尺度を一つに",
    clue: "文字、貨幣、車軌、度量衡。六つの国で異なっていた基準は、一人の王のもとで統一された。",
    blankLabel: "統一した王朝",
    seal: "L",
    image: "/mystery/undated-archive/03-qin.webp",
    imageAlt: "青銅の分銅、貨幣、竹簡、統合される地図片",
    textSide: "right",
  },
  {
    archiveId: "ES-A16",
    documentLabel: "新政府布告",
    documentStyle: "proclamation",
    title: "五箇条の方針",
    clue: "将軍の政治が終わり、天皇を中心とする政府へ。誓文は、新しい国が進む方針を五つの条文で示した。",
    blankLabel: "変革の呼称",
    seal: "P",
    image: "/mystery/undated-archive/15-meiji.webp",
    imageAlt: "刀、鉄道、電信柱、西洋時計を描いた明治期風ポスター",
    textSide: "left",
  },
  {
    archiveId: "ES-A17",
    documentLabel: "戴冠式招待状",
    documentStyle: "invitation",
    title: "冬の祝祭日の帝冠",
    clue: "ローマの大聖堂で、教皇がフランク王の頭上に帝冠を置いた。西ヨーロッパに新たな皇帝が生まれる。",
    blankLabel: "戴冠された人物",
    seal: "E",
    image: "/mystery/undated-archive/07-charlemagne.webp",
    imageAlt: "中世の帝冠、教皇印、冬の枝を配した招待状",
    textSide: "left",
  },
  {
    archiveId: "ES-A18",
    documentLabel: "王位継承号外",
    documentStyle: "broadsheet",
    title: "海を渡った招待状",
    clue: "国王が国外へ逃れると、議会は海の向こうから夫妻を招いた。流血が少なかったことを示す名で呼ばれる。",
    blankLabel: "革命の呼称",
    seal: "H",
    image: "/mystery/undated-archive/13-glorious-revolution.webp",
    imageAlt: "空の王座、海を渡る船、招かれた夫妻を描く木版号外",
    textSide: "left",
  },
  {
    archiveId: "ES-A19",
    documentLabel: "航海日誌",
    documentStyle: "logbook",
    title: "西へ向かった三隻",
    clue: "目指したのはアジアだった。航海者は到達した土地を別の大陸だとは考えないまま、三度の航海を終えた。",
    blankLabel: "航海者の名",
    seal: "A",
    image: "/mystery/undated-archive/11-columbus.webp",
    imageAlt: "西へ進む三隻の船と未知の海岸線を描いた航海図",
    textSide: "right",
  },
];

export function UndatedArchiveEvidence() {
  return (
    <section className="mystery-archive" aria-labelledby="undated-archive-heading">
      <header className="mystery-archive-header">
        <div>
          <p className="mystery-label text-red-800">RECOVERED MATERIAL / 19 ITEMS</p>
          <h2 id="undated-archive-heading">年代札を失った資料</h2>
        </div>
        <p>資料番号は回収順であり、年代順ではありません。</p>
      </header>

      <div className="mystery-evidence-list">
        {evidenceItems.map((item) => (
          <article
            key={item.archiveId}
            className="mystery-evidence"
            data-document={item.documentStyle}
            data-text-side={item.textSide}
          >
            <div className="mystery-evidence-media">
              <MysteryImage
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 860px"
                className="object-cover"
              />
            </div>
            <div className="mystery-evidence-shade" aria-hidden="true" />

            <div className="mystery-evidence-copy">
              <div className="mystery-evidence-meta">
                <span>{item.archiveId}</span>
                <span>{item.documentLabel}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.clue}</p>
              <div className="mystery-evidence-blank">
                <span>{item.blankLabel}</span>
                <span className="mystery-evidence-line" aria-hidden="true" />
              </div>
            </div>

            <div className="mystery-evidence-seal" aria-label={`収蔵印 ${item.seal}`}>
              <span>ARCHIVE</span>
              <strong>{item.seal}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
