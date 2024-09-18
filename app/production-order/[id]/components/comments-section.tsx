"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
} from "@/app/lib/@frontend/ui";

const comments: { user: { name: string; pic?: string }; content: string }[] = [
  {
    user: {
      name: "Nathan Rodrigues",
      pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP9vbJZlU56WF2JCkh2Y9NtEIPhtw_-amJ-w&s",
    },
    content: "Comentário 1",
  },
  { user: { name: "Italo souza" }, content: "Comentário 2" },
  {
    user: { name: "Rodrigo Ribeiro" },
    content: "Comentário 3",
  },
  {
    user: {
      name: "Elden Ring",
      pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0YMIrJtdcxfRec3QPMYmpxMJqjOljbgIxwA&s",
    },
    content: "Comentário 4",
  },
];

export function CommentsSection() {
  return (
    <div className="p-2">
      <div className="px-4 sm:px-0 mb-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Comentários
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Aba contendo os comentários feitos nessa ordem de produção
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex flex-row gap-4">
            <Avatar>
              <AvatarImage src={comment.user.pic} alt="alt" />
              <AvatarFallback>{comment.user.name}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col w-full text-sm text-gray-800">
              <strong>{comment.user.name}</strong>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}

        <div className="w-full flex flex-col gap-2 mt-3">
          <Textarea placeholder="Insira um novo comentário" />
          <Button className="w-fit bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
            Enviar comentário
          </Button>
        </div>
      </div>
    </div>
  );
}
