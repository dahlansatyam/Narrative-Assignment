type Props = {
  children: React.ReactNode;
};

function Section({ children }: Props) {
  return <div className="mx-4 lg:max-w-7xl lg:mx-auto">{children}</div>;
}

export default Section;
