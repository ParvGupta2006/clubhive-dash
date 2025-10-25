import { Users } from "lucide-react";

export const Logo = ({ size = "default" }: { size?: "default" | "large" }) => {
  const iconSize = size === "large" ? "h-10 w-10" : "h-6 w-6";
  const textSize = size === "large" ? "text-4xl" : "text-2xl";
  const logoSize = size === "large" ? "h-20 w-20" : "h-12 w-12";

  return (
    <div className="flex items-center gap-3">
      <div className={`${logoSize} rounded-2xl bg-gradient-clubhive flex items-center justify-center shadow-lg`}>
        <Users className={`${iconSize} text-white`} />
      </div>
      <div>
        <h1 className={`${textSize} font-bold`}>
          Club<span className="text-primary">Hive</span>
        </h1>
        {size === "large" && (
          <p className="text-muted-foreground text-sm">Student Club Management System</p>
        )}
      </div>
    </div>
  );
};
