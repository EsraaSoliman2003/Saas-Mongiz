import AdminSectionHeader from "../adminSectionHeader/AdminSectionHeader";
import NoData from "../noData/NoData";

interface Props {
  isEmpty: boolean;
  children: React.ReactNode;
  className?: string;
}

const AdminGridLayout = ({ isEmpty, children, className = "" }: Props) => {
  return (
    <section>
      {isEmpty ? (
        <NoData />
      ) : (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8 ${className}`}>
          {children}
        </div>
      )}
    </section>
  );
};

export default AdminGridLayout;
