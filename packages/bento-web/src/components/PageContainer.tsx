import { BottomTabBar } from './BottomTabBar';

export const PageContainer: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen px-4 pt-6 pb-24 flex">
      <div className="w-full max-w-2xl mx-auto relative z-0">{children}</div>

      <BottomTabBar />
    </div>
  );
};
