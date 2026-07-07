import SidebarLayout from "@/components/layout/sidebar-layout";

export default function DocumentsPage() {
  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">Manage your document repository</p>
          </div>
          <UploadButton />
        </div>

        <div className="rounded-lg border">
          <div className="p-6 text-center text-muted-foreground">
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-1">Upload PDF, DOCX, TXT, MD, HTML, CSV, or image files</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

function UploadButton() {
  return (
    <label className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer">
      Upload Document
      <input type="file" className="hidden" accept=".pdf,.docx,.txt,.md,.html,.csv,.png,.jpg,.jpeg" />
    </label>
  );
}
