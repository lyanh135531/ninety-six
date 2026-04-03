"use client";

interface CustomerAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CustomerAvatar({ name, size = "md", className = "" }: CustomerAvatarProps) {
  // Lấy các chữ cái đầu của tên (ví dụ: "Nguyễn Văn A" -> "NA")
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Tạo màu sắc dựa trên tên để đảm bảo mỗi khách hàng có một màu riêng nhưng ổn định
  const getGradient = (name: string) => {
    const gradients = [
      "from-teal-600 to-emerald-400",
      "from-blue-600 to-sky-400",
      "from-indigo-600 to-violet-400",
      "from-rose-600 to-pink-400",
      "from-orange-600 to-amber-400",
      "from-slate-700 to-slate-500",
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % gradients.length);
    return gradients[index];
  };

  const sizeClasses = {
    sm: "w-9 h-9 text-[10px]",
    md: "w-14 h-14 text-sm",
    lg: "w-20 h-20 text-xl",
  }[size];

  return (
    <div className={`relative group/avatar shrink-0 ${sizeClasses} ${className}`}>
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${getGradient(name)} rounded-2xl blur-lg opacity-20 group-hover/avatar:opacity-40 transition-opacity duration-500`} />
      
      {/* Main Container */}
      <div className={`relative h-full w-full bg-gradient-to-tr ${getGradient(name)} rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-teal-900/5 group-hover/avatar:scale-105 group-hover/avatar:-rotate-3 transition-all duration-500`}>
        <span className="tracking-tighter drop-shadow-sm">{getInitials(name)}</span>
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 rounded-2xl border border-white/20 pointer-events-none" />
      </div>
    </div>
  );
}
