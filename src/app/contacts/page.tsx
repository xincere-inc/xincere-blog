'use client';

import IdoContact from '@/api/IdoContact';
import React, { useState } from 'react';
const App: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    inquiry: '',
    privacyPolicy: false,
  });
  const [activeTab, setActiveTab] = useState('services');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrivacyModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
    // Clear error when user checks
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.companyName.trim()) {
      errors.companyName = '会社名を入力してください';
    }
    if (!formData.contactName.trim()) {
      errors.contactName = '担当者名を入力してください';
    }
    if (!formData.email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }
    if (!formData.phone.trim()) {
      errors.phone = '電話番号を入力してください';
    } else if (!/^[0-9-]{10,13}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = '有効な電話番号を入力してください';
    }
    if (!formData.inquiry.trim()) {
      errors.inquiry = '相談内容を入力してください';
    }
    if (!formData.privacyPolicy) {
      errors.privacyPolicy = 'プライバシーポリシーに同意してください';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        const response = await IdoContact.submitContactForm({
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          inquiry: formData.inquiry,
          privacyPolicy: formData.privacyPolicy,
        });

        if (response.status === 200) {
          setIsSubmitted(true);
          setFormData({
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            inquiry: '',
            privacyPolicy: false,
          });
        }
      } catch (error: any) {
        if (error.response) {
          setSubmissionError(
            error.response.data?.error || 'フォームの送信に失敗しました。'
          );
        } else {
          setSubmissionError('サーバーとの通信に問題が発生しました。');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return (
    <>
      <div className="mb-8 text-center mt-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          無料相談フォーム
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Xincereでは、マーケティング戦略からウェブ開発まで、幅広いデジタルサービスに関するご相談を承っております。
          まずはお気軽に無料相談をご利用ください。
        </p>
      </div>
      {/* モバイル用アコーディオン */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setShowAccordion(!showAccordion)}
          className="w-full bg-white p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer"
        >
          <span className="font-bold text-lg">サービス内容と相談フロー</span>
          <i
            className={`fas ${showAccordion ? 'fa-chevron-up' : 'fa-chevron-down'} text-[#427C2E]`}
          ></i>
        </button>
        {showAccordion && (
          <div className="bg-white mt-2 p-4 rounded-lg shadow-sm">
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'services' ? 'text-[#427C2E] border-b-2 border-[#427C2E]' : 'text-gray-500'} cursor-pointer`}
                onClick={() => setActiveTab('services')}
              >
                サービス内容
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'flow' ? 'text-[#427C2E] border-b-2 border-[#427C2E]' : 'text-gray-500'} cursor-pointer`}
                onClick={() => setActiveTab('flow')}
              >
                相談フロー
              </button>
            </div>
            {activeTab === 'services' ? (
              <div>
                <h3 className="font-bold text-lg mb-3">相談可能なサービス</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-chart-line text-[#427C2E] mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">マーケティング戦略</span>
                      <p className="text-sm text-gray-600">
                        デジタルマーケティング戦略の立案から実行まで、目標達成のための最適なアプローチをご提案します。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-search text-[#427C2E] mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">コンテンツSEO</span>
                      <p className="text-sm text-gray-600">
                        検索エンジン最適化とコンテンツマーケティングを組み合わせた効果的なSEO戦略をご提案します。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-code text-[#427C2E] mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">ウェブ開発</span>
                      <p className="text-sm text-gray-600">
                        モダンな技術を活用した、高品質で使いやすいウェブサイトやアプリケーションの開発をサポートします。
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-3">
                  相談から導入までの流れ
                </h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold mr-3">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">無料相談のお申し込み</h4>
                      <p className="text-sm text-gray-600">
                        こちらのフォームからお申し込みいただきます。
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold mr-3">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">ヒアリング</h4>
                      <p className="text-sm text-gray-600">
                        オンラインまたは対面でのヒアリングを実施し、課題や目標を明確にします。
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold mr-3">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">提案書の作成</h4>
                      <p className="text-sm text-gray-600">
                        ヒアリング内容に基づいた最適な解決策をご提案します。
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold mr-3">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">契約・プロジェクト開始</h4>
                      <p className="text-sm text-gray-600">
                        ご契約後、プロジェクトチームを編成し、サービス提供を開始します。
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 説明セクション（デスクトップ・タブレット用） */}
        <div className="hidden md:block w-full lg:w-5/12 lg:sticky lg:top-6 lg:self-start">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex border-b mb-6">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'services' ? 'text-[#427C2E] border-b-2 border-[#427C2E]' : 'text-gray-500'} cursor-pointer`}
                onClick={() => setActiveTab('services')}
              >
                サービス内容
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'flow' ? 'text-[#427C2E] border-b-2 border-[#427C2E]' : 'text-gray-500'} cursor-pointer`}
                onClick={() => setActiveTab('flow')}
              >
                相談フロー
              </button>
            </div>
            {activeTab === 'services' ? (
              <div>
                <h3 className="font-bold text-xl mb-4">相談可能なサービス</h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="bg-[#E8F0E6] p-3 rounded-full mr-4">
                      <i className="fas fa-chart-line text-[#427C2E] text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        マーケティング戦略
                      </h4>
                      <p className="text-gray-600">
                        デジタルマーケティング戦略の立案から実行まで、目標達成のための最適なアプローチをご提案します。データ分析に基づいた効果的なマーケティング施策で、ビジネス成長をサポートします。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#E8F0E6] p-3 rounded-full mr-4">
                      <i className="fas fa-search text-[#427C2E] text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">コンテンツSEO</h4>
                      <p className="text-gray-600">
                        検索エンジン最適化とコンテンツマーケティングを組み合わせた効果的なSEO戦略をご提案します。ターゲットユーザーに響くコンテンツ制作と技術的SEO対策で、オーガニック流入の増加を実現します。
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#E8F0E6] p-3 rounded-full mr-4">
                      <i className="fas fa-code text-[#427C2E] text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">ウェブ開発</h4>
                      <p className="text-gray-600">
                        モダンな技術を活用した、高品質で使いやすいウェブサイトやアプリケーションの開発をサポートします。SEO対策やユーザビリティを考慮した設計で、ビジネス目標の達成に貢献します。
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 p-4 bg-[#E8F0E6] rounded-lg">
                  <h4 className="font-bold text-lg mb-2">
                    まずはお気軽にご相談ください
                  </h4>
                  <p className="text-gray-700">
                    初回相談は完全無料です。お客様の課題や目標をお聞かせいただき、最適なソリューションをご提案いたします。
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-xl mb-4">
                  相談から導入までの流れ
                </h3>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        無料相談のお申し込み
                      </h4>
                      <p className="text-gray-600">
                        こちらのフォームからお申し込みいただきます。ご記入いただいた内容をもとに、担当者からご連絡いたします。
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">ヒアリング</h4>
                      <p className="text-gray-600">
                        オンラインまたは対面でのヒアリングを実施し、課題や目標を明確にします。現状分析と改善点の洗い出しを行います。
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">提案書の作成</h4>
                      <p className="text-gray-600">
                        ヒアリング内容に基づいた最適な解決策をご提案します。具体的な施策内容、スケジュール、予算感を含めた提案書を作成します。
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#427C2E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        契約・プロジェクト開始
                      </h4>
                      <p className="text-gray-600">
                        ご契約後、プロジェクトチームを編成し、サービス提供を開始します。定期的な進捗報告と効果測定を行いながら、目標達成に向けて伴走します。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-[#E8F0E6] rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-info-circle text-[#427C2E] mr-2"></i>
                    <h4 className="font-bold text-lg">
                      ご相談から契約までの期間
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    お申し込みから最短1週間でサービス提供を開始できます。お急ぎの場合はその旨をお知らせください。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* フォームセクション */}
        <div className="w-full lg:w-7/12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#427C2E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  お問い合わせありがとうございます
                </h3>
                <p className="text-gray-600 mb-6">
                  無料相談のお申し込みを受け付けました。担当者より1営業日以内にご連絡いたします。
                </p>
                <a
                  href="https://readdy.ai/home/be8c1c9a-dd36-4a42-bf07-949bb16184d3/1be32d60-68bc-48e1-bd06-739979e44110"
                  data-readdy="true"
                  className="inline-block bg-[#427C2E] text-white px-6 py-3 rounded-md hover:bg-[#356423] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  元のページに戻る
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6">お問い合わせ情報</h2>
                {submissionError && (
                  <p className="text-red-500 text-sm mb-4">{submissionError}</p>
                )}
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      会社名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#427C2E] focus:border-transparent`}
                      placeholder="例：株式会社Xincere"
                    />
                    {formErrors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.companyName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contactName"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      担当者名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#427C2E] focus:border-transparent`}
                      placeholder="例：山田 太郎"
                    />
                    {formErrors.contactName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.contactName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#427C2E] focus:border-transparent`}
                      placeholder="例：info@xincere.co.jp"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#427C2E] focus:border-transparent`}
                      placeholder="例：03-1234-5678"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="inquiry"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      相談内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="inquiry"
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-2 border ${formErrors.inquiry ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#427C2E] focus:border-transparent`}
                      placeholder="ご相談内容をご記入ください。現在の課題や目標などをお知らせいただけると、より具体的なご提案が可能です。"
                    ></textarea>
                    {formErrors.inquiry && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.inquiry}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <div
                    className={`flex items-start ${formErrors.privacyPolicy ? 'border border-red-500 p-3 rounded-md' : ''}`}
                  >
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="privacyPolicy"
                        name="privacyPolicy"
                        type="checkbox"
                        checked={formData.privacyPolicy}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-[#427C2E] border-gray-300 rounded focus:ring-[#427C2E]"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="privacyPolicy"
                        className="font-medium text-gray-700"
                      >
                        プライバシーポリシーに同意する{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-gray-500">
                        当社の
                        <a
                          href="#"
                          onClick={handlePrivacyClick}
                          className="text-[#427C2E] underline cursor-pointer"
                        >
                          プライバシーポリシー
                        </a>
                        をご確認の上、同意いただける場合はチェックを入れてください。
                        {showPrivacyModal && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                              className="absolute inset-0 bg-black opacity-50"
                              onClick={() => setShowPrivacyModal(false)}
                            ></div>
                            <div className="relative bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden">
                              <div className="flex justify-between items-center p-6 border-b">
                                <h3 className="text-2xl font-bold text-gray-800">
                                  プライバシーポリシー
                                </h3>
                                <button
                                  onClick={() => setShowPrivacyModal(false)}
                                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                  <i className="fas fa-times text-xl"></i>
                                </button>
                              </div>
                              <div
                                className="p-6 overflow-y-auto"
                                style={{ maxHeight: 'calc(80vh - 140px)' }}
                              >
                                <div className="space-y-6">
                                  <section>
                                    <h4 className="text-xl font-bold mb-3">
                                      1. 個人情報の収集目的
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      当社は、以下の目的で個人情報を収集・利用いたします：
                                    </p>
                                    <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-2">
                                      <li>
                                        サービスに関するお問い合わせ・ご相談への対応
                                      </li>
                                      <li>サービスの提供、維持、改善</li>
                                      <li>新サービスや更新情報のご案内</li>
                                      <li>
                                        マーケティング分析および統計データの作成
                                      </li>
                                    </ul>
                                  </section>

                                  <section>
                                    <h4 className="text-xl font-bold mb-3">
                                      2. 収集する個人情報の項目
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      当社が収集する個人情報は以下の通りです：
                                    </p>
                                    <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-2">
                                      <li>氏名</li>
                                      <li>会社名</li>
                                      <li>メールアドレス</li>
                                      <li>電話番号</li>
                                      <li>お問い合わせ内容</li>
                                    </ul>
                                  </section>

                                  <section>
                                    <h4 className="text-xl font-bold mb-3">
                                      3. 個人情報の管理
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      当社は、お客様の個人情報を適切に管理し、以下を徹底します：
                                    </p>
                                    <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-2">
                                      <li>
                                        個人情報の紛失、破壊、改ざん、漏洩などを防止するため、適切なセキュリティ対策を実施します。
                                      </li>
                                      <li>
                                        個人情報を取り扱う従業員に対して、個人情報保護に関する教育・啓発を実施します。
                                      </li>
                                      <li>
                                        個人情報保護に関する規程を整備し、継続的に見直し、改善を行います。
                                      </li>
                                    </ul>
                                  </section>

                                  <section>
                                    <h4 className="text-xl font-bold mb-3">
                                      4. 個人情報の第三者提供
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません：
                                    </p>
                                    <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-2">
                                      <li>お客様の同意がある場合</li>
                                      <li>法令に基づく場合</li>
                                      <li>
                                        人の生命、身体または財産の保護のために必要がある場合
                                      </li>
                                    </ul>
                                  </section>

                                  <section>
                                    <h4 className="text-xl font-bold mb-3">
                                      5. 個人情報の開示・訂正・削除
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      お客様は、当社が保有する個人情報について、開示、訂正、削除を請求することができます。請求を行う場合は、当社お問い合わせ窓口までご連絡ください。
                                    </p>
                                  </section>

                                  <section>
                                    <h4 className="text-xl font-bold mb-3">
                                      6. プライバシーポリシーの変更
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更した場合は、当ウェブサイトでお知らせいたします。
                                    </p>
                                  </section>

                                  <section>
                                    <h4 className="text-xl font-bold mb-3">
                                      7. お問い合わせ窓口
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                      本プライバシーポリシーに関するお問い合わせは、以下の窓口までご連絡ください：
                                    </p>
                                    <div className="mt-2 text-gray-600">
                                      <p>株式会社Xincere</p>
                                      <p>メール：privacy@xincere.co.jp</p>
                                      <p>
                                        電話：03-1234-5678（平日 9:00-18:00）
                                      </p>
                                    </div>
                                  </section>
                                </div>
                              </div>
                              <div className="border-t p-6 bg-gray-50">
                                <button
                                  onClick={() => setShowPrivacyModal(false)}
                                  className="w-full bg-[#427C2E] text-white py-3 px-6 rounded-md hover:bg-[#356423] transition-colors duration-300 font-medium !rounded-button whitespace-nowrap"
                                >
                                  閉じる
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>
                  {formErrors.privacyPolicy && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.privacyPolicy}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#427C2E] text-white py-3 px-6 rounded-md hover:bg-[#356423] transition-colors duration-300 font-medium !rounded-button whitespace-nowrap cursor-pointer flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      送信中...
                    </>
                  ) : (
                    '無料相談を申し込む'
                  )}
                </button>
                <p className="text-center text-gray-500 text-sm mt-4">
                  送信後、1営業日以内に担当者からご連絡いたします
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
