"use client"
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyAccountAttachments } from "@/app/lib/@backend/action/commercial/account-attachment.find.action";
import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { AttachmentsDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/attachments.data";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "mongodb";

interface Props {
  searchParams: {
    id: string;
    name?: string;
    page?: string;
  };
}

export default function Page({
  searchParams: { id, name, page }
}: Props) {
  const _page = page?.length && Number(page);
  const accountAttachmentsData = useQuery({
    queryKey: ["attachments", id, name, _page],
    queryFn: () => findManyAccountAttachments(query({ id, name }), _page),
  });

  const hasPermissionContacts = useQuery({
    queryKey: [
        "restrictFeatureByProfile",
        "commercial:accounts:access:tab:attachments:delete",
      ],
    queryFn: () => restrictFeatureByProfile(
      "commercial:accounts:access:tab:attachments:delete"
    ),
    refetchOnMount: true,
  });

  return (
    <AttachmentsDataPage
      attachments={accountAttachmentsData.data ?? { docs: [] }}
      accountId={id}
      hasPermission={hasPermissionContacts.data ?? false}
    />
  );
}

function query(props: { id: string; name?: string }): Filter<IAccountAttachment> {
  const filter: Filter<IAccountAttachment> = {
    accountId: props.id,
  };

  if (props.name) {
    filter.name = {
      $regex: props.name,
      $options: "i",
    };
  }

  return filter;
}
