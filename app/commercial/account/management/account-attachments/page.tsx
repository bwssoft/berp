import { findManyAccountAttachments } from "@/app/lib/@backend/action/commercial/account-attachment.find.action";
import { AttachmentsDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/attachments.data";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({
  searchParams: {
    id
  }
}:Props) {
  const accountAttachmentsData = await findManyAccountAttachments(id)

  return (
    <AttachmentsDataPage 
      attachments={accountAttachmentsData}
      accountId={id}
    />
  );
}
