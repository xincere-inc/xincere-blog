const ContactCTA = () => {
  return (
    <div className="bg-softGreen p-6 rounded-lg shadow-sm text-center">
      <h3 className="font-bold text-lg mb-3">お問い合わせ</h3>
      <p className="text-sm text-gray-600 mb-4">
        システム開発やAI推進についてのご相談はこちらから
      </p>
      <a
        href="#"
        className="block bg-xincereGreen text-white px-4 py-3 rounded-md hover:bg-darkGreen transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
      >
        無料相談を予約する
      </a>
    </div>
  );
};

export default ContactCTA;
