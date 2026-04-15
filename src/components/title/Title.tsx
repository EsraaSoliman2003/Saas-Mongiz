type Props = {
    text: string;
}

export default function Title({ text }: Props) {
    return (
        <h2 className="text-2xl font-semibold text-right">
            {text}
        </h2>
    )
}
