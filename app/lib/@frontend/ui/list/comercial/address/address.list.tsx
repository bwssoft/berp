// import { AddressCard } from "./address.card";
// import { IAddress } from "@/app/lib/@backend/domain";

// interface AddressCardListProps {
//     items: IAddress[];
//     className?: string;
// }

// export function AddressCardList({ items, className }: AddressCardListProps) {
//     return (
//         <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
//             {items.map((item) => (
//                 <AddressCard
//                     key={item.id}
//                     title="Endereço:"
//                     address={{
//                         id: item.id,
//                         street: item.street,
//                         number: item.number,
//                         district: item.district,
//                         city: item.city,
//                         state: item.state,
//                         zip_code: item.zip_code,
//                         complement: item.complement,
//                         reference_point: item.reference_point,
//                         type: item.type,
//                     }}
//                 />
//             ))}
//         </div>
//     );
// }
