const HeroSection = () => {
  return (
    <div className="bg-primary-light rounded-lg p-8 mb-12 mt-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          AI時代のシステム開発を
          <br />
          成功に導くテックブログ
        </h1>
        <p className="text-lg mb-8">
          最新技術とプロジェクト実績に基づく知見を発信。
          <br />
          システム開発やAI推進に関する実践的な情報をお届けします。
        </p>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300 flex items-center !rounded-button whitespace-nowrap cursor-pointer h-[50px]">
            <i className="fas fa-download mr-2"></i>
            会社案内ダウンロード
          </div>
          <a
            href="https://corp.xincere.jp"
            target="_blank"
            className="bg-white text-primary px-6 py-3 rounded-md hover:bg-gray-50 transition-colors duration-300 border border-xincereGreen !rounded-button whitespace-nowrap cursor-pointer h-[50px]"
          >
            コーポレートサイトを見る
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
