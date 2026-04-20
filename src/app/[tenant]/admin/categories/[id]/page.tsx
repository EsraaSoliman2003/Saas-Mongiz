import CategoryDetailsPage from "./_components/CategoryDetailsPage";

interface PageProps {
    params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
    const resolvedParams = await params;

    const catId = Number(resolvedParams.id);

    if (isNaN(catId)) return <div>Invalid category ID</div>;

    return <CategoryDetailsPage categoryId={catId} />;
};

export default Page;