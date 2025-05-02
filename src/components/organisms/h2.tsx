type H2Props = {
  title: string;
};

const H2 = ({ title }: H2Props) => {
  return <h2 className="text-2xl font-bold mb-6">{title}</h2>;
};

export default H2;
