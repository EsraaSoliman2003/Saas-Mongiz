import Cart from "./_components/Cart";
import Summary from "./_components/Summary";

export default function Page() {
    return (
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-10 pt-6 lg:pt-10">
            <div className="lg:col-span-2">
                <Cart />
            </div>
            <div className="lg:col-span-1">
                <Summary />
            </div>
        </div>
    );
}
