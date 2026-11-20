"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setTransactions(await res.json());
      } catch (err) {
        toast.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Platform Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verified Stripe subscription payments (Immutable read-only audit ledger)
          </p>
        </div>
        <Badge variant="outline" className="w-fit flex items-center gap-1.5 py-1 px-3">
          <Lock className="h-3.5 w-3.5 text-amber-500" /> Read-Only Ledger
        </Badge>
      </div>

      <Card className="overflow-hidden border-orange-200/70 dark:border-zinc-800">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-red-600" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No Stripe subscription transactions recorded yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Info</TableHead>
                <TableHead>Subscription Plan</TableHead>
                <TableHead>Payment Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Transaction Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell>
                    <p className="font-bold">{tx.vendorName}</p>
                    <p className="text-xs text-muted-foreground">{tx.vendorEmail}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500 text-zinc-950 font-bold uppercase">
                      {tx.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-emerald-600">
                    ${Number(tx.amount).toFixed(2)} {tx.currency}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-600 text-white uppercase">
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}