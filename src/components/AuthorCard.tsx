import Image from 'next/image';
import Link from 'next/link';
import SocialLinks from './SocialLinks';

interface AuthorCardProps {
  name: string;
  role: string;
  imageUrl: string;
  profileUrl?: string;
}

const AuthorCard = ({ name, role, imageUrl, profileUrl }: AuthorCardProps) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg relative">
      <div className="absolute top-2 right-2">
        <SocialLinks twitterUrl="#" facebookUrl="#" linkedinUrl="#" />
      </div>
      <Image
        src={imageUrl}
        alt={name}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover mr-4"
      />
      <div>
        {profileUrl ? (
          <Link href={profileUrl} className="block">
            <div className="font-bold hover:text-primary transition-colors duration-300">
              {name}
            </div>
          </Link>
        ) : (
          <div className="font-bold">{name}</div>
        )}
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
};

export default AuthorCard;
