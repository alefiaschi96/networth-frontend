// src/app/(dashboard)/accounts/[id]/page.tsx
import { Metadata } from "next";
import AccountDetailClient from "./account-detail-client";

export const metadata: Metadata = {
  title: "Dettaglio Account | NetWorth",
  description: "Visualizza e gestisci i dettagli del tuo account di investimento",
};

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const accountId = params.id;

  return <AccountDetailClient accountId={accountId} />;
}
