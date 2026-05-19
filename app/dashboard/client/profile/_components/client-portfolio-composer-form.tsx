"use client";

import { useActionState, useEffect, useState } from "react";

import { PortfolioPostFormBody } from "@/components/shared/portfolio/portfolio-post-form-body";
import type {
  ClientProfilePortfolioItem,
  CreateClientPortfolioPostState,
} from "@/lib/client-profile/types";
import { createClientPortfolioPostAction } from "@/server/client-profile/create-client-portfolio-post";
import { updateClientPortfolioPostAction } from "@/server/client-profile/update-client-portfolio-post";

const INITIAL_STATE: CreateClientPortfolioPostState = {
  message: "",
  ok: false,
};

function buildInitialMediaUrls(item?: ClientProfilePortfolioItem) {
  return item ? item.media.map((media) => media.url) : [];
}

export function ClientPortfolioComposerForm({
  item,
  onCancel,
  onSuccess,
  mode = "create",
}: {
  item?: ClientProfilePortfolioItem;
  mode?: "create" | "edit";
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [existingMediaUrls, setExistingMediaUrls] = useState(
    buildInitialMediaUrls(item),
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const action =
    mode === "edit" ? updateClientPortfolioPostAction : createClientPortfolioPostAction;
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.ok) {
      onSuccess();
    }
  }, [onSuccess, state.ok]);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <PortfolioPostFormBody
        cancelLabel="Cancel"
        description={description}
        descriptionPlaceholder="Describe the project, your role, tools used, and result."
        emptyDescription="Add at least 1 image to continue."
        existingMediaUrls={existingMediaUrls}
        files={selectedFiles}
        inputId="portfolio-media"
        inputName="media"
        isRequired
        isSubmitting={isPending}
        mediaTitle="Portfolio Media"
        notice={notice}
        onCancel={onCancel}
        onDescriptionChange={setDescription}
        onExistingMediaUrlsChange={setExistingMediaUrls}
        onFilesChange={setSelectedFiles}
        onNoticeChange={setNotice}
        onTitleChange={setTitle}
        portfolioId={item?.id}
        removableExistingMedia={mode === "edit"}
        statusMessage={state.message}
        statusTone={state.ok ? "success" : "error"}
        submitLabel={mode === "edit" ? "Save changes" : "Create post"}
        submitPendingLabel={mode === "edit" ? "Saving..." : "Publishing..."}
        title={title}
        titlePlaceholder="e.g. Campus event branding kit"
      />
    </form>
  );
}
