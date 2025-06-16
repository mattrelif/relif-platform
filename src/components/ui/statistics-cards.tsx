import { ReactNode } from "react";

interface StatisticCard {
    title: string;
    value: number | string;
    icon: ReactNode;
    color: "blue" | "orange" | "red" | "green" | "purple" | "yellow";
    isLoading?: boolean;
}

interface StatisticsCardsProps {
    cards: StatisticCard[];
}

const colorClasses = {
    blue: {
        bg: "bg-blue-500",
        bgDark: "bg-blue-600",
    },
    orange: {
        bg: "bg-orange-500",
        bgDark: "bg-orange-600",
    },
    red: {
        bg: "bg-red-500",
        bgDark: "bg-red-600",
    },
    green: {
        bg: "bg-green-500",
        bgDark: "bg-green-600",
    },
    purple: {
        bg: "bg-purple-500",
        bgDark: "bg-purple-600",
    },
    yellow: {
        bg: "bg-yellow-500",
        bgDark: "bg-yellow-600",
    },
};

export const StatisticsCards = ({ cards }: StatisticsCardsProps): ReactNode => {
    return (
        <div className="w-full grid grid-cols-4 gap-4 lg:flex lg:flex-wrap mb-4">
            {cards.map((card, index) => {
                const colors = colorClasses[card.color];
                return (
                    <div
                        key={index}
                        className={`w-full h-max rounded-lg ${colors.bg} overflow-hidden flex flex-col`}
                    >
                        <div className={`w-full py-1 px-5 ${colors.bgDark} lg:p-3`}>
                            <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                                {card.icon}
                                {card.title}
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-3xl text-white font-bold lg:text-2xl">
                                {card.isLoading ? "..." : card.value}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}; 