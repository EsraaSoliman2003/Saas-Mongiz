"use client"
import { useAuth } from '@/context/AuthContext'
import SellerForm from './SellerForm';
import UserForm from './UserForm';
import "./style.css";

export default function SelectForm() {
    const { role } = useAuth();

    const rolesArray = role ? JSON.parse(role) : [];

    if (rolesArray.includes("SELLER"))
        return <SellerForm />
    else
        return <UserForm />
}
