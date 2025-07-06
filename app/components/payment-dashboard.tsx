"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Calendar,
  Euro,
  CheckCircle,
  X,
} from "lucide-react";
import type {
  Payment,
  PaymentInstallment,
  UserSettings,
} from "../types/payment";
import {
  generatePaymentSchedule,
  calculatePaymentSummary,
} from "../utils/payment-utils";
import { formatCurrency } from "../utils/currencies";
import { translations } from "../utils/translations";
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

interface PaymentDashboardProps {
  payments: Payment[];
  userSettings: UserSettings;
  onMarkAsPaid: (paymentId: string, installmentIndex: number) => void;
  onMarkAsUnpaid: (paymentId: string, installmentIndex: number) => void;
  onUpdateSettings: (settings: UserSettings) => void;
}

export function PaymentDashboard({
  payments,
  userSettings,
  onMarkAsPaid,
  onMarkAsUnpaid,
  onUpdateSettings,
}: PaymentDashboardProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [showPastMonths, setShowPastMonths] = useState(false);
  const [pastMonthsToShow, setPastMonthsToShow] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const monthsToShow = userSettings.monthsToShow || 12;
  const t = translations[userSettings.language];

  // Generate all installments
  const allInstallments = payments.flatMap((payment) =>
    generatePaymentSchedule(payment)
  );

  // Get current date for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Filter installments: hide paid ones only from previous months
  const visibleInstallments = allInstallments.filter((installment) => {
    const dueDate = new Date(installment.dueDate);
    const installmentMonth = dueDate.getMonth();
    const installmentYear = dueDate.getFullYear();

    // If it's paid and from a previous month, hide it
    if (installment.isPaid) {
      if (
        installmentYear < currentYear ||
        (installmentYear === currentYear && installmentMonth < currentMonth)
      ) {
        return false;
      }
    }

    return true;
  });

  // Separate upcoming and past installments from visible ones
  const upcomingInstallments = visibleInstallments
    .filter((installment) => {
      const dueDate = new Date(installment.dueDate);
      return dueDate >= today;
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  const pastInstallments = visibleInstallments.filter((installment) => {
    const dueDate = new Date(installment.dueDate);
    return dueDate < today;
  });

  // Chart data
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
      };
    }

    acc[monthKey].amount += installment.amount;
    acc[monthKey].count += 1;

    return acc;
  }, {} as Record<string, { month: string; amount: number; count: number }>);

  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort by the monthKey (YYYY-MM format)
    .map(([, data]) => data);

  // Group by month function
  const groupByMonth = (installments: PaymentInstallment[]) => {
    return installments.reduce((acc, installment) => {
      const date = new Date(installment.dueDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString(
        userSettings.language === "EN" ? "en-US" : "es-ES",
        {
          year: "numeric",
          month: "long",
        }
      );

      if (!acc[monthKey]) {
        acc[monthKey] = {
          name: monthName,
          installments: [],
          total: 0,
          date: date,
        };
      }

      acc[monthKey].installments.push(installment);
      acc[monthKey].total += installment.amount;

      return acc;
    }, {} as Record<string, { name: string; installments: PaymentInstallment[]; total: number; date: Date }>);
  };

  const groupedUpcoming = groupByMonth(upcomingInstallments);
  const groupedPast = groupByMonth(pastInstallments);

  // Sort and paginate upcoming months
  const sortedUpcomingMonths = Object.entries(groupedUpcoming)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, monthsToShow);

  // Sort past months by date (most recent first) and limit display
  const sortedPastMonths = Object.entries(groupedPast)
    .sort(([, a], [, b]) => b.date.getTime() - a.date.getTime())
    .slice(0, pastMonthsToShow);

  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  const handleMonthsToShowChange = (value: string) => {
    const newMonthsToShow = Number.parseInt(value);
    onUpdateSettings({ ...userSettings, monthsToShow: newMonthsToShow });
  };

  const totalUpcoming = Object.values(groupedUpcoming).reduce(
    (sum, month) => sum + month.total,
    0
  );
  const { totalAmount, totalPaid, totalToPay } =
    calculatePaymentSummary(payments);

  const renderMonthSection = (
    monthKey: string,
    monthData: any,
    isPast = false
  ) => (
    <div
      key={monthKey}
      className="border rounded-lg"
    >
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto"
        onClick={() => toggleMonth(monthKey)}
      >
        <div className="flex items-center gap-3">
          {expandedMonths.has(monthKey) ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium">{monthData.name}</span>
          <Badge variant={isPast ? "outline" : "secondary"}>
            {monthData.installments.length} {t.payments}
          </Badge>
          {isPast && (
            <Badge
              variant="default"
              className="bg-green-100 text-green-800"
            >
              Past
            </Badge>
          )}
        </div>
        <span className="font-bold text-lg">
          {formatCurrency(monthData.total, userSettings.currency)}
        </span>
      </Button>

      {expandedMonths.has(monthKey) && (
        <div className="border-t p-4 space-y-3">
          {monthData.installments.map(
            (installment: PaymentInstallment, index: number) => {
              const dueDate = new Date(installment.dueDate);
              const today = new Date();
              const isOverdue = dueDate < today && !installment.isPaid;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{installment.paymentName}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>****{installment.creditCard}</span>
                      <span>•</span>
                      <span>{dueDate.toLocaleDateString()}</span>
                      {installment.isPaid && (
                        <Badge
                          variant="default"
                          className="text-xs bg-green-100 text-green-800"
                        >
                          {t.paid}
                        </Badge>
                      )}
                      {isOverdue && (
                        <Badge
                          variant="destructive"
                          className="text-xs"
                        >
                          {t.overdue}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold">
                        {formatCurrency(
                          installment.amount,
                          installment.currency
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={installment.isPaid ? "outline" : "default"}
                      onClick={() =>
                        installment.isPaid
                          ? onMarkAsUnpaid(
                              installment.paymentId,
                              installment.installmentIndex
                            )
                          : onMarkAsPaid(
                              installment.paymentId,
                              installment.installmentIndex
                            )
                      }
                    >
                      {installment.isPaid ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          {t.markAsUnpaid}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t.markAsPaid}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );

  // In the PaymentDashboard component, replace the activePlans calculation:
  const activePlans = payments.filter((payment) => {
    const schedule = generatePaymentSchedule(payment);
    const completedPayments = schedule.filter((s) => s.isPaid).length;
    return completedPayments < payment.installments;
  }).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            {t.paymentSummary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Update the display in the summary section: */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {activePlans}
              </div>
              <div className="text-sm text-muted-foreground">
                {t.activePlans}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalPaid, userSettings.currency)}
              </div>
              <div className="text-sm text-muted-foreground">{t.totalPaid}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalToPay, userSettings.currency)}
              </div>
              <div className="text-sm text-muted-foreground">{t.remaining}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalAmount, userSettings.currency)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t.totalAmount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
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

      {/* Upcoming Payments by Month */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t.upcomingPaymentsByMonth}
              </CardTitle>
              <CardDescription>{t.clickToExpand}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Show months:
              </span>
              <Select
                value={monthsToShow.toString()}
                onValueChange={handleMonthsToShowChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedUpcomingMonths.map(([monthKey, monthData]) =>
            renderMonthSection(monthKey, monthData, false)
          )}

          {sortedUpcomingMonths.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t.noUpcomingPayments}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Payments */}
      {Object.keys(groupedPast).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t.pastPaymentsByMonth}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPastMonths(!showPastMonths)}
              >
                {showPastMonths ? t.hidePastMonths : t.showPastMonths}
              </Button>
            </CardTitle>
            <CardDescription>
              View your completed and past due payments
            </CardDescription>
          </CardHeader>
          {showPastMonths && (
            <CardContent className="space-y-3">
              {sortedPastMonths.map(([monthKey, monthData]) =>
                renderMonthSection(monthKey, monthData, true)
              )}

              {sortedPastMonths.length < Object.keys(groupedPast).length && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPastMonthsToShow((prev) => prev + 3)}
                  >
                    {t.loadMore}
                  </Button>
                </div>
              )}

              {pastMonthsToShow > 3 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setPastMonthsToShow(3)}
                  >
                    {t.showLess}
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
