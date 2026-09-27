interface IconProps {
  src: string;
  className?: string;
}

// Rendered as a mask so the icon takes the surrounding text color (the SVGs use currentColor).
export const Icon = ({ src, className = "size-4" }: IconProps) => (
  <span
    aria-hidden="true"
    className={`inline-block shrink-0 bg-current ${className}`}
    style={{
      maskImage: `url("${src}")`,
      maskRepeat: "no-repeat",
      maskPosition: "center",
      maskSize: "contain",
      WebkitMaskImage: `url("${src}")`,
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      WebkitMaskSize: "contain",
    }}
  />
);
