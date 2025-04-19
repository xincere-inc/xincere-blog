interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { label: string; value: string }[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  tabs,
}) => {
  return (
    <div className="flex flex-wrap mb-8 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-6 py-3 text-sm font-medium rounded-t-md transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer ${
            activeTab === tab.value
              ? 'bg-xincereGreen text-white'
              : 'bg-softGreen text-gray-700 hover:bg-[#d8e6d2]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
