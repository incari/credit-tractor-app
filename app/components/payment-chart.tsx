"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import type { Payment, UserSettings } from "../types/payment";
import { generatePaymentSchedule } from "../utils/payment-utils";
import { formatCurrency } from "../utils/currencies";
import { translations } from "../utils/translations";
import { calculatePaymentSummary } from "../utils/payment-summary";

interface PaymentChartProps {
  payments: Payment[];
  userSettings: UserSettings;
}

export function PaymentChart({ payments, userSettings }: PaymentChartProps) {
  const t = translations[userSettings.language];

  // Generate chart data
  const allInstallments = payments.flatMap((payment) =>
    generatePaymentSchedule(payment)
  );

  // Update the chart data generation to fix month ordering:
  const monthlyData = allInstallments.reduce((acc, installment) => {
    const date = new Date(installment.dueDate);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString(
      userSettings.language === "EN" ? "en-US" : "es-ES",
      {
        year: "numeric",
        month: "short",
      }
    );

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        amount: 0,
        count: 0,
        sortKey: monthKey, // Add sort key for proper ordering
      };
    }

    acc[monthKey].amount += installment.amount;
    acc[monthKey].count += 1;

    return acc;
  }, {} as Record<string, { month: string; amount: number; count: number; sortKey: string }>);

  // Fix the chart data sorting:
  const chartData = Object.values(monthlyData).sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey)
  );

  // Calculate totals
  const totalAmount = payments.reduce((sum, payment) => {
    const totalWithInterest = payment.price * (1 + payment.interestRate / 100);
    return sum + totalWithInterest;
  }, 0);

  const { totalPaid } = calculatePaymentSummary(payments);
  const totalToPay = totalAmount - totalPaid;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t.totalAmount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAmount, userSettings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t.includingInterest}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.totalPaid}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid, userSettings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">{t.initialPayments}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.remaining}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalToPay, userSettings.currency)}
            </div>
            <p className="text-xs text-muted-foreground">{t.toBePaid}</p>
          </CardContent>
        </Card>
      </div>

      {/* Update the layout to show charts side by side: */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.monthlyPaymentSchedule}</CardTitle>
            <CardDescription>
              Overview of your payment amounts by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: `${t.amount} (${userSettings.currency})`,
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="min-h-[250px] h-[300px] md:h-[350px]"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      formatCurrency(Number(value), userSettings.currency),
                      name,
                    ]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="var(--color-amount)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.paymentTimeline}</CardTitle>
            <CardDescription>{t.cumulativeAmount}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cumulative: {
                  label: `${t.cumulativeAmount} (${userSettings.currency})`,
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="min-h-[250px] h-[300px] md:h-[350px]"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData.map((item, index) => ({
                    ...item,
                    cumulative: chartData
                      .slice(0, index + 1)
                      .reduce((sum, d) => sum + d.amount, 0),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      formatCurrency(Number(value), userSettings.currency),
                      name,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="var(--color-cumulative)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
