import { Delete } from "lucide-react"
import ChangePassword from "./_components/ChangePassword"
import ConfirmEmail from "./_components/ConfirmEmail"
import SelectForm from "./_components/SelectForm"
import DeleteAccount from "./_components/DeleteAccount"

export default function Page() {
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-16 mt-10 md:mt-5 mb-20">
            <div className="flex-1 flex flex-col space-y-6">
                <SelectForm />

                <ChangePassword />

                <ConfirmEmail />

                <DeleteAccount />
            </div>
        </div>
    )
}
