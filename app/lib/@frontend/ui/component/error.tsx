"use client"

interface Props {
    message?: string
}

export const Error = (props: Props) => {
    const { message } = props
    return message ? <p className="text-red-500 text-sm mt-1">{message}</p> : <></>
}