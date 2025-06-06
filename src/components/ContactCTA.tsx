import Link from 'next/link';

const ContactCTA = () => {
  return (
    <div className="bg-softGreen p-6 rounded-lg shadow-sm text-center">
      <h3 className="font-bold text-lg mb-3">お問い合わせ</h3>
      <p className="text-sm text-gray-600 mb-4">
        システム開発やAI推進についてのご相談はこちらから
      </p>

      <Link href="/contacts">
        <div className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300  !rounded-button whitespace-nowrap cursor-pointer h-[50px]">
          無料相談を予約する
        </div>
      </Link>
    </div>
  );
};

export default ContactCTA;
