import Link from 'next/link';
import { FaLinkedin, FaFacebook, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';

type SocialLinksProps = {
  twitterUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  emailUrl?: string;
};

const SocialLinks = ({
  twitterUrl,
  facebookUrl,
  linkedinUrl,
  githubUrl,
  emailUrl,
}: SocialLinksProps) => (
  <div className="flex justify-center space-x-4">
    {twitterUrl && (
      <Link
        href={twitterUrl}
        className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
      >
        <FaXTwitter fontSize={24} />
      </Link>
    )}
    {facebookUrl && (
      <Link
        href={facebookUrl}
        className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
      >
        <FaFacebook fontSize={24} />
      </Link>
    )}
    {linkedinUrl && (
      <Link
        href={linkedinUrl}
        className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
      >
        <FaLinkedin fontSize={24} />
      </Link>
    )}
    {githubUrl && (
      <Link
        href={githubUrl}
        className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
      >
        <FaGithub fontSize={24} />
      </Link>
    )}
    {emailUrl && (
      <Link
        href={emailUrl}
        className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
      >
        <IoMdMail fontSize={24} />
      </Link>
    )}
  </div>
);

export default SocialLinks;
