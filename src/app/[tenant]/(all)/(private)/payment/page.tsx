import PaymentInfo from "./_components/PaymentInfo";
import OrderSummary from "./_components/OrderSummary";
import Address from "./_components/Address";

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-10 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ================= Payment Info ================= */}
                <Address />

                {/* ================= Order Summary ================= */}
                <OrderSummary />
            </div>
        </div>
    );
}
