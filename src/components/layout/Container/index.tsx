export const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="container">{children}</div>;
};

export const MainContentContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <main className="main-content">{children}</main>;
};
