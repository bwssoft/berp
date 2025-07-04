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
  const accountAttachmentsData = await findManyAccountAttachments(query({name}), _page);

  const hasPermissionContacts = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:attachments:delete"
  );

  return (
    <AttachmentsDataPage
      attachments={accountAttachmentsData.docs}
      accountId={id}
      hasPermission={hasPermissionContacts}
    />
  );
}

function query(props: { name?: string }): Filter<IAccountAttachment> {
  if (props.name) {
    return {
      name: {
        $regex: props.name,
        $options: "i",
      },
    };
  }

  return {};
}
