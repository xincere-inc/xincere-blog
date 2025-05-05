import Image from 'next/image';
import Link from 'next/link';

interface AuthorCardProps {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  profileUrl?: string;
}

const AuthorCard = ({
  name,
  role,
  description,
  imageUrl,
  profileUrl,
}: AuthorCardProps) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
      <Image
        src={imageUrl}
        alt={name}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover mr-4"
      />
      <div>
        {profileUrl ? (
          <Link href="/authors/1" className="block">
            <div className="font-bold hover:text-primary transition-colors duration-300">
              {name}
            </div>
            </Link>
        ) : (
          <div className="font-bold">{name}</div>
        )}
        <p className="text-sm text-gray-600">{role}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default AuthorCard;
