import { DashboardLayout } from "../../../../components/supervisor/layout/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-muted-foreground">Settings coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
