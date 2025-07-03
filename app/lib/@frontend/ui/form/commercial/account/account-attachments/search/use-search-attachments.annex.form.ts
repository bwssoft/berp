import { IAccountAttachment } from "@/app/lib/@backend/domain/commercial/entity/account-attachment.definition";
import { useEffect, useState } from "react";

interface Props {
    attachments: IAccountAttachment[]
}

export function useSearchAttachmentsAnnexForm({attachments}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAttachments, setFilteredAttachments] = useState<IAccountAttachment[]>(attachments);
    
    useEffect(() => {
        setFilteredAttachments(attachments);
    }, [attachments]);

    const handleDelete = async (id: string) => {
        const newAttachments = filteredAttachments.filter((a) => a.id !== id);
        setFilteredAttachments(newAttachments);
    };


    const handleSearch = () => {
        if (!searchTerm.trim()) {
        setFilteredAttachments(attachments);
        return;
        }

        const filtered = attachments.filter((attachment) =>
            attachment.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAttachments(filtered);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    
    return {
        handleSearch,
        handleSearchChange,
        handleDelete,
        searchTerm,
        filteredAttachments
    }
}