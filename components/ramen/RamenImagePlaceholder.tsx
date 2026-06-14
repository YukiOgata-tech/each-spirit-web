import { Soup } from "lucide-react";

type Props = {
  className?: string;
};

export function RamenImagePlaceholder({ className = "" }: Props) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#fee2c5_100%)] ${className}`}>
      <div className="flex flex-col items-center gap-2 text-orange-900/55">
        <Soup className="h-8 w-8" />
        <span className="text-[11px] font-bold">公式画像確認中</span>
      </div>
    </div>
  );
}
