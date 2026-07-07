import SidebarLayout from "@/components/layout/sidebar-layout";

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your RAG platform</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Documents" value="0" description="Total documents indexed" />
          <StatCard title="Chunks" value="0" description="Total chunks processed" />
          <StatCard title="Queries" value="0" description="Total queries executed" />
          <StatCard title="Avg. Latency" value="0ms" description="Average response time" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">System Health</h3>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

function StatCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
