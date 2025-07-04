import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyAccountAttachments } from "@/app/lib/@backend/action/commercial/account-attachment.find.action";
import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { AttachmentsDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/attachments.data";
import { Filter } from "mongodb";

interface Props {
  searchParams: {
    id: string;
    name?: string;
    page?: string;
  };
}

export default async function Page({
  searchParams: { id, name, page }
}: Props) {
  const _page = page?.length && Number(page);
  const accountAttachmentsData = await findManyAccountAttachments(
    query({ id, name }),
    _page
  );

  const hasPermissionContacts = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:attachments:delete"
  );

  return (
    <AttachmentsDataPage
      attachments={accountAttachmentsData}
      accountId={id}
      hasPermission={hasPermissionContacts}
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
