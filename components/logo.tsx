import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  variant?: "full" | "icon-only" | "text-only"
}

export function Logo({ size = "md", showText = true, className = "", variant = "full" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  if (variant === "text-only") {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className={`font-bold ${textSizeClasses[size]} leading-tight`}>Krishna Connect</span>
        <span className={`text-xs opacity-75 leading-tight ${size === "sm" ? "text-[10px]" : ""}`}>
          Devotee Community
        </span>
      </div>
    )
  }

  if (variant === "icon-only") {
    return (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <Image src="/krishna-logo.png" alt="Krishna Connect" fill className="object-contain filter drop-shadow-sm" />
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <Image src="/krishna-logo.png" alt="Krishna Connect" fill className="object-contain filter drop-shadow-sm" />
      </div>
      {showText && (
        <div className="flex flex-col min-w-0">
          <span className={`font-bold ${textSizeClasses[size]} leading-tight text-white`}>Krishna Connect</span>
          <span className={`text-xs opacity-75 leading-tight text-blue-100 ${size === "sm" ? "text-[10px]" : ""}`}>
            Devotee Community
          </span>
        </div>
      )}
    </div>
  )
}
