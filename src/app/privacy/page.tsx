'use client';

import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Make table of contents sticky
      if (scrollPosition > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  const lastUpdated = '2025年5月5日';

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-8 my-10">
        <h1 className="text-3xl font-bold text-center mb-2">
          プライバシーポリシー
        </h1>
        <p className="text-center text-gray-600 mb-8">
          シンシアは、お客様の個人情報保護を最優先事項と考え、適切な取り扱いを行います。
        </p>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-3/4">
            <section id="introduction" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                1. はじめに
              </h2>
              <p>
                当社は、個人情報の保護に関する法律（令和３年改正個人情報保護法、以下「APPI」）その他関連法令、ガイドライン及び本ポリシーを遵守し、適切に個人情報を取扱います。
              </p>
            </section>

            <section id="collection" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                2. 収集する情報
              </h2>
              <p className="mb-4">
                当社は、次の情報を取得する場合があります。
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">区分</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">具体例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">ご利用者が直接提供する情報</td>
                      <td className="border border-gray-300 px-4 py-2">氏名、電話番号、メールアドレス 等</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">自動的に生成・取得される情報</td>
                      <td className="border border-gray-300 px-4 py-2">IPアドレス、端末情報、ブラウザ情報、Cookie、行動履歴、ログ情報 等</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="purpose" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                3. 利用目的
              </h2>
              <p className="mb-4">
                取得した個人情報は、以下の目的で利用します。
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>本サービスの提供・維持・改善のため</li>
                <li>本人確認、認証、アカウント管理のため</li>
                <li>お問い合わせ対応、サポート提供のため</li>
                <li>新機能・キャンペーン等のご案内（マーケティング）</li>
                <li>利用規約違反調査・不正行為防止のため</li>
                <li>法令・ガイドライン等に基づく対応・通知のため</li>
              </ol>
            </section>

            <section id="legal-basis" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                4. 法的根拠（EEA 等対象の場合）
              </h2>
              <p className="mb-4">
                GDPR 等が適用される場合、当社は以下の法的根拠に基づき情報を取扱います。
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>契約の履行</strong>：利用規約に基づくサービス提供</li>
                <li><strong>同意</strong>：メールマガジン配信、クッキー利用（詳細は第6条）</li>
                <li><strong>正当な利益</strong>：サービス改善、セキュリティ確保</li>
                <li><strong>法令遵守</strong>：会計・税務・当局の要請対応</li>
              </ul>
            </section>

            <section id="sharing" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                5. 第三者提供
              </h2>
              <p className="mb-4">
                当社は、次の場合を除き、ご本人の同意なく第三者に個人情報を提供しません。
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要であり、ご本人の同意を得ることが困難な場合</li>
                <li>公衆衛生の向上、児童の健全育成推進のため特に必要な場合</li>
                <li>国の機関等への協力のうち、同意取得が業務の遂行に支障を及ぼす場合</li>
              </ul>
            </section>

            <section id="cookies" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                6. クッキー等の利用
              </h2>
              <p className="mb-4">
                当社は、ウェブサイトの利便性向上や広告配信・アクセス解析のためにクッキー（Cookie）、Webビーコン等を使用します。クッキーの保存を望まない場合は、ブラウザ設定により拒否できます。ただし、その場合は本サービスの一部機能が利用できない可能性があります。
              </p>
            </section>

            <section id="analytics" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                7. アクセス解析ツール
              </h2>
              <p className="mb-4">
                本サービスは Google Analytics 等の解析ツールを利用することがあります。ツール提供者への情報送信内容・利用目的については各提供者のポリシーをご確認ください。Google Analytics の無効化は <a href="https://tools.google.com/dlpage/gaoptout?hl=ja" className="text-[#4D8B50] underline hover:no-underline" target="_blank" rel="noopener noreferrer">こちら</a> からオプトアウト可能です。
              </p>
            </section>

            <section id="optout" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                8. オプトアウト方法
              </h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>メールマガジン</strong>：配信メールに記載の手順またはアカウント設定から配信停止が可能です。</li>
                <li><strong>ターゲティング広告</strong>：クッキー設定の変更、各広告プラットフォームのオプトアウトページで無効化できます。</li>
                <li><strong>アクセス解析</strong>：前項記載のツール提供者のオプトアウト機能をご利用ください。</li>
              </ul>
            </section>

            <section id="international" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                9. 国際データ移転
              </h2>
              <p className="mb-4">
                サーバー保守やクラウドサービス利用により、お客様の居住国以外（EU/EEAを含む）の国へ個人情報を転送する場合があります。この場合、適用法令を遵守し、必要な保護措置（EU標準契約条項等）を講じます。
              </p>
            </section>

            <section id="retention" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                10. 保存期間
              </h2>
              <p className="mb-4">
                個人情報は、利用目的達成に必要な範囲で保存し、保存期間終了後、遅滞なく消去・匿名化します。ただし、法令に別段の定めがある場合を除きます。
              </p>
            </section>

            <section id="security" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                11. セキュリティ対策
              </h2>
              <p className="mb-4">
                当社は、個人情報の漏えい、滅失または毀損の防止その他安全管理のため、次の措置を講じます。
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>物理的安全管理</strong>：入退室管理、施錠保管</li>
                <li><strong>技術的安全管理</strong>：SSL/TLS、アクセス制御、暗号化、WAF</li>
                <li><strong>組織的安全管理</strong>：内部規程整備、教育研修、監査</li>
              </ul>
            </section>

            <section id="rights" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                12. ご本人の権利
              </h2>
              <p className="mb-4">
                ご本人は、当社が保有する自己の個人情報について、以下の権利を行使できます（法令に基づく制限を含む）。
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>開示・訂正・追加・削除</li>
                <li>利用停止・消去・第三者提供停止</li>
                <li>データポータビリティ（EEA 等対象の場合）</li>
              </ul>
              <p>
                権利行使を希望される場合は、第15条のお問い合わせ窓口までご連絡ください。
              </p>
            </section>

            <section id="children" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                13. 未成年者の利用
              </h2>
              <p>
                20歳未満の方が本サービスを利用する場合、保護者の同意を得てください。保護者の同意がない場合、当社は個人情報を利用しないものとします。
              </p>
            </section>

            <section id="changes" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                14. プライバシーポリシーの改定
              </h2>
              <p>
                法令変更やサービス内容の変更等に応じ、本ポリシーを改定することがあります。重要な変更を行う場合は、当社ウェブサイト等で周知します。
              </p>
            </section>

            <section id="contact" className="mb-10">
              <h2 className="text-xl font-bold border-l-4 border-[#4D8B50] pl-3 mb-4">
                15. お問い合わせ窓口
              </h2>
              <p className="mb-4">
                個人情報の取扱いに関するお問い合わせ・苦情・ご相談は、下記窓口までご連絡ください。
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-bold mb-2">
                  株式会社シンシア 個人情報保護担当
                </p>
                <p className="mb-1">住所：〒XXX-XXXX 東京都○○区△△X-X-X</p>
                <p className="mb-1">電話番号：03-XXXX-XXXX</p>
                <p className="mb-1">メールアドレス：privacy@sincere.co.jp</p>
                <p>受付時間：平日10:00〜18:00（土日祝日・年末年始を除く）</p>
              </div>
            </section>

            <div className="text-right text-sm text-gray-500 mt-8">
              最終更新日：{lastUpdated}
            </div>
          </div>

          <div
            className={`md:w-1/4 ${isSticky ? 'md:sticky md:top-20 md:self-start' : ''}`}
          >
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">目次</h3>
              <ul className="space-y-3">
                {[
                  { id: 'introduction', title: '1. はじめに' },
                  { id: 'collection', title: '2. 収集する情報' },
                  { id: 'purpose', title: '3. 利用目的' },
                  { id: 'legal-basis', title: '4. 法的根拠' },
                  { id: 'sharing', title: '5. 第三者提供' },
                  { id: 'cookies', title: '6. クッキー等の利用' },
                  { id: 'analytics', title: '7. アクセス解析ツール' },
                  { id: 'optout', title: '8. オプトアウト方法' },
                  { id: 'international', title: '9. 国際データ移転' },
                  { id: 'retention', title: '10. 保存期間' },
                  { id: 'security', title: '11. セキュリティ対策' },
                  { id: 'rights', title: '12. ご本人の権利' },
                  { id: 'children', title: '13. 未成年者の利用' },
                  { id: 'changes', title: '14. ポリシーの改定' },
                  { id: 'contact', title: '15. お問い合わせ窓口' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left w-full hover:text-[#4D8B50] ${activeSection === item.id ? 'text-[#4D8B50] font-medium' : 'text-gray-600'}`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-[#4D8B50] text-white p-3 rounded-full shadow-lg hover:bg-[#3d7040] transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
        aria-label="ページトップへ戻る"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
};

export default App;
