import Header from "./Header";

const Page = ({children}) => {
  return (
    <div className="min-h-screen h-full flex flex-col bg-gray-100">
      <Header />
      {children}
    </div>
  );
}

export default Page;