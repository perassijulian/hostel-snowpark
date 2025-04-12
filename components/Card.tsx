type CardProps = {
    title: string;
    description: string;
    emoji?: string;
};

export default function Card({ title, description, emoji }: CardProps) {
    return (
        <div key={title} className="bg-white shadow-lg p-6 rounded-2xl">
            <div className="text-4xl">{emoji}</div>
            <h3 className="text-xl font-semibold mt-2">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
        </div>
    );
}