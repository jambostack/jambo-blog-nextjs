import { stringToColor } from "@/lib/utils";

interface AvatarInitialProps {
	name: string;
	className?: string;
	size?: number;
}

export function AvatarInitial({ name, className = "", size = 40 }: AvatarInitialProps) {
	const initial = name.charAt(0).toUpperCase();
	const bgColor = stringToColor(name);

	return (
		<div
			className={`flex items-center justify-center rounded-full text-white ${className}`}
			style={{
				backgroundColor: `#${bgColor}`,
				width: size,
				height: size,
				fontSize: Math.floor(size * 0.5),
				fontWeight: 'bold',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			{initial}
		</div>
	);
} 