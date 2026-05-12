"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UpdateClientProfileImagesState } from "@/lib/client-profile/types";
import {
  USER_PROFILE_IMAGE_ACCEPTED_TYPES,
  USER_PROFILE_IMAGE_MAX_BYTES,
} from "@/lib/supabase/storage";
import { DEFAULT_COVER_BACKGROUND } from "@/lib/client-profile/mappers";
import { updateClientProfileImagesAction } from "@/server/client-profile/update-client-profile-images";

import {
  buildCoverBackgroundStyle,
  ProfileBackgroundPanel,
  ProfilePicturePanel,
} from "./client-profile-image-panels";

type ClientProfileImageEditorProps = {
  initials: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  displayName: string;
  onClose: () => void;
};

const INITIAL_STATE: UpdateClientProfileImagesState = {
  message: "",
  ok: false,
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProfileImageForm({
  initials,
  avatarUrl,
  backgroundImageUrl,
  displayName,
  onClose,
}: ClientProfileImageEditorProps) {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarSelection, setAvatarSelection] = useState<File | null>(null);
  const [avatarSelectionPreviewUrl, setAvatarSelectionPreviewUrl] = useState<
    string | null
  >(null);
  const [backgroundSelection, setBackgroundSelection] = useState<File | null>(
    null,
  );
  const [backgroundSelectionPreviewUrl, setBackgroundSelectionPreviewUrl] =
    useState<string | null>(null);
  const [removeAvatarImage, setRemoveAvatarImage] = useState(false);
  const [removeBackgroundImage, setRemoveBackgroundImage] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateClientProfileImagesAction,
    INITIAL_STATE,
  );
  const avatarHasCustomImage = Boolean(avatarUrl);
  const avatarPreviewUrl = avatarSelectionPreviewUrl
    ? avatarSelectionPreviewUrl
    : removeAvatarImage
      ? null
      : avatarUrl ?? null;
  const backgroundHasCustomImage =
    Boolean(backgroundImageUrl) && !/gradient\(/i.test(backgroundImageUrl);
  const backgroundPreviewStyle =
    backgroundSelectionPreviewUrl
      ? buildCoverBackgroundStyle(backgroundSelectionPreviewUrl)
      : !removeBackgroundImage && backgroundHasCustomImage
        ? buildCoverBackgroundStyle(backgroundImageUrl)
        : buildCoverBackgroundStyle(DEFAULT_COVER_BACKGROUND);
  const showAvatarRemove =
    !removeAvatarImage && (avatarHasCustomImage || Boolean(avatarSelection));
  const showBackgroundRemove =
    !removeBackgroundImage &&
    (backgroundHasCustomImage || Boolean(backgroundSelection));

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    router.refresh();
    onClose();
  }, [onClose, router, state.ok]);

  useEffect(() => {
    return () => {
      if (avatarSelectionPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarSelectionPreviewUrl);
      }

      if (backgroundSelectionPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(backgroundSelectionPreviewUrl);
      }
    };
  }, [avatarSelectionPreviewUrl, backgroundSelectionPreviewUrl]);

  function resetSelection() {
    if (avatarSelectionPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarSelectionPreviewUrl);
    }

    if (backgroundSelectionPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(backgroundSelectionPreviewUrl);
    }

    setAvatarSelection(null);
    setAvatarSelectionPreviewUrl(null);
    setBackgroundSelection(null);
    setBackgroundSelectionPreviewUrl(null);
    setRemoveAvatarImage(false);
    setRemoveBackgroundImage(false);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }

    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    kind: "avatar" | "background",
  ) {
    const file = event.target.files?.[0] ?? null;

    if (kind === "avatar") {
      if (avatarSelectionPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarSelectionPreviewUrl);
      }

      setAvatarSelection(file);
      setAvatarSelectionPreviewUrl(file ? URL.createObjectURL(file) : null);
      setRemoveAvatarImage(false);
    } else {
      if (backgroundSelectionPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(backgroundSelectionPreviewUrl);
      }

      setBackgroundSelection(file);
      setBackgroundSelectionPreviewUrl(
        file ? URL.createObjectURL(file) : null,
      );
      setRemoveBackgroundImage(false);
    }
  }

  return (
    <form
      action={formAction}
      className="flex max-h-[calc(100vh-1.5rem)] flex-col overflow-y-auto"
    >
      <DialogHeader className="border-b border-[color:var(--line-strong)] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DialogTitle className="text-xl font-bold tracking-[-0.04em]">
              Update profile images
            </DialogTitle>
            <DialogDescription className="mt-1 max-w-2xl text-sm text-[color:var(--ink-muted)]">
              Upload a new profile picture and background photo. JPG, PNG, and
              WebP images up to {formatFileSize(USER_PROFILE_IMAGE_MAX_BYTES)}
              each are supported.
            </DialogDescription>
          </div>

          <DialogClose
            render={
              <Button
                aria-label="Close modal"
                className="shrink-0"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <X className="size-4" />
          </DialogClose>
        </div>
      </DialogHeader>

      <div className="space-y-4 px-5 py-5">
        <div className="grid gap-4 md:grid-cols-2">
          <ProfilePicturePanel
            displayName={displayName}
            initials={initials}
            onChoose={() => avatarInputRef.current?.click()}
            onRemove={() => {
              if (avatarSelectionPreviewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(avatarSelectionPreviewUrl);
              }

              setAvatarSelection(null);
              setAvatarSelectionPreviewUrl(null);
              setRemoveAvatarImage(true);
              if (avatarInputRef.current) {
                avatarInputRef.current.value = "";
              }
            }}
            showRemove={showAvatarRemove}
            previewUrl={avatarPreviewUrl}
          />

          <ProfileBackgroundPanel
            onChoose={() => backgroundInputRef.current?.click()}
            onRemove={() => {
              if (backgroundSelectionPreviewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(backgroundSelectionPreviewUrl);
              }

              setBackgroundSelection(null);
              setBackgroundSelectionPreviewUrl(null);
              setRemoveBackgroundImage(true);
              if (backgroundInputRef.current) {
                backgroundInputRef.current.value = "";
              }
            }}
            showRemove={showBackgroundRemove}
            previewStyle={backgroundPreviewStyle}
          />
        </div>

        <input
          ref={avatarInputRef}
          accept={USER_PROFILE_IMAGE_ACCEPTED_TYPES.join(",")}
          className="sr-only"
          id="profile-avatar-image"
          name="avatarImage"
          onChange={(event) => handleFileChange(event, "avatar")}
          type="file"
        />
        <input
          ref={backgroundInputRef}
          accept={USER_PROFILE_IMAGE_ACCEPTED_TYPES.join(",")}
          className="sr-only"
          id="profile-background-image"
          name="backgroundImage"
          onChange={(event) => handleFileChange(event, "background")}
          type="file"
        />
        <input
          name="removeAvatarImage"
          type="hidden"
          value={removeAvatarImage ? "true" : "false"}
        />
        <input
          name="removeBackgroundImage"
          type="hidden"
          value={removeBackgroundImage ? "true" : "false"}
        />

        {state.message ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              state.ok
                ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
            }`}
            role={state.ok ? "status" : "alert"}
          >
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-5 py-4">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            className="rounded-xl"
            onClick={() => {
              resetSelection();
              onClose();
            }}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl"
            disabled={
              isPending ||
              (!avatarSelection &&
                !backgroundSelection &&
                !removeAvatarImage &&
                !removeBackgroundImage)
            }
            type="submit"
          >
            {isPending ? "Uploading..." : "Save images"}
          </Button>
        </div>
      </div>
    </form>
  );
}
