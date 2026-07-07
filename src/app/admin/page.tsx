import SidebarLayout from "@/components/layout/sidebar-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System administration and monitoring</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Users" value="0" />
          <StatCard title="Documents" value="0" />
          <StatCard title="Chunks" value="0" />
          <StatCard title="Queries" value="0" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <MetricRow label="Average Latency" value="0ms" />
                <MetricRow label="Hallucination Rate" value="0%" />
                <MetricRow label="Storage Used" value="0 MB" />
                <MetricRow label="Evaluation Score" value="N/A" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity to display</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
