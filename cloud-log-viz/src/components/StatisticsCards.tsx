import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, Bug, Activity, Clock } from "lucide-react";
import { LogStats } from "@/types/log";

interface StatisticsCardsProps {
  stats: LogStats;
  isLoading?: boolean;
}

export function StatisticsCards({ stats, isLoading }: StatisticsCardsProps) {
  const cards = [
    {
      title: "Total Logs",
      value: stats.total,
      icon: Activity,
      gradient: "bg-gradient-primary",
      iconColor: "text-primary"
    },
    {
      title: "Errors",
      value: stats.errors,
      icon: AlertTriangle,
      gradient: "bg-gradient-error",
      iconColor: "text-error"
    },
    {
      title: "Warnings",
      value: stats.warnings,
      icon: Info,
      gradient: "bg-gradient-warning",
      iconColor: "text-warning"
    },
    {
      title: "Info",
      value: stats.info,
      icon: CheckCircle,
      gradient: "bg-gradient-success",
      iconColor: "text-info"
    },
    {
      title: "Debug",
      value: stats.debug,
      icon: Bug,
      gradient: "bg-gradient-card",
      iconColor: "text-debug"
    },
    {
      title: "Processed",
      value: stats.processed,
      icon: Clock,
      gradient: "bg-gradient-success",
      iconColor: "text-success",
      subtitle: `${stats.unprocessed} pending`
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card 
            key={card.title} 
            className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className={`absolute inset-0 opacity-10 ${card.gradient}`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${card.iconColor}`} />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground mb-1">
                {card.value.toLocaleString()}
              </div>
              {card.subtitle && (
                <Badge variant="secondary" className="text-xs">
                  {card.subtitle}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}