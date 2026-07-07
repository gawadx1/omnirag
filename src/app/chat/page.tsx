import SidebarLayout from "@/components/layout/sidebar-layout";

export default function ChatPage() {
  return (
    <SidebarLayout>
      <div className="flex flex-col h-full">
        <div className="border-b px-6 py-3">
          <h1 className="text-lg font-semibold">Chat</h1>
        </div>
        <ChatMessages />
        <ChatInput />
      </div>
    </SidebarLayout>
  );
}

function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-muted p-4 max-w-3xl">
          <p className="text-sm">
            Hello! I'm your RAG assistant. I can help you find information from your
            documents. Upload documents and start asking questions!
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatInput() {
  return (
    <div className="border-t p-4">
      <form className="flex gap-2 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Ask a question..."
          className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Send
        </button>
      </form>
    </div>
  );
}
