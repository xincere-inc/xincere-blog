import Link from 'next/link';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="flex items-center text-sm text-gray-500 mb-4">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">&gt;</span>}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
