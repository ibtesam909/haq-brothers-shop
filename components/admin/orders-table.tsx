import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPKR, recentOrders, type Order } from "@/lib/data"
import { cn } from "@/lib/utils"

const statusStyles: Record<Order["status"], string> = {
  Delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Processing: "bg-accent/15 text-accent border-accent/25",
  Shipped: "bg-primary/10 text-primary border-primary/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

export function OrdersTable({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <Card className="rounded-2xl border-border/60">
      {showHeader ? (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Recent orders</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View all
          </Button>
        </CardHeader>
      ) : null}
      <CardContent className={cn(!showHeader && "pt-6")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Product</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="transition-colors">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="hidden max-w-[180px] truncate text-muted-foreground md:table-cell">
                    {order.product}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{order.date}</TableCell>
                  <TableCell className="font-semibold">{formatPKR(order.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={cn("rounded-full font-medium", statusStyles[order.status])}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
