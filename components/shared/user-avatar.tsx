"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  alt: string;
  className?: string;
  fallbackClassName?: string;
  imageClassName?: string;
  initials: string | null | undefined;
  src: string | null | undefined;
};

export function UserAvatar({
  alt,
  className,
  fallbackClassName,
  imageClassName,
  initials,
  src,
}: UserAvatarProps) {
  const imageSrc = typeof src === "string" && src.trim() ? src.trim() : null;

  return (
    <Avatar className={className}>
      {imageSrc ? (
        <AvatarImage alt={alt} className={imageClassName} src={imageSrc} />
      ) : null}
      <AvatarFallback className={fallbackClassName}>
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
